const passport = require("passport");
const { knex } = require('@db/knex.js')

//middleware de autentificación
const LocalStrategy = require("passport-local").Strategy;

const {checkUserAndPassword} = require("@auth/helpers/encryptDecrypt")
const {emailBloqueo} = require('@email/mails.js')
// var limiter = require('@utils/limiter.js') // ES CON VAR A POSTA!

let limiter;
if (process.env.NODE_ENV === 'production') {

const createLimiters = require('@utils/limiter.js');

(async () => {
  limiter = await createLimiters();
})();

}
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },login));
				
async function login(req, username, password, done) {
	try {
        if (process.env.NODE_ENV === 'production') {
            const ipAddr = req.headers['X-Real-IP']
            const usernameIPkey = `${username}_${ipAddr}`
            const [resUsernameAndIP, resSlowByIP, rlResUsername] = await Promise.all([
                limiter.limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
                limiter.limiterSlowBruteByIP.get(ipAddr),
                limiter.limiterConsecutiveFailsByUsername.get(username)
            ])
    
            let retrySecs = 0
            // Check if IP or Username + IP is already blocked
            if (resSlowByIP !== null && resSlowByIP.consumedPoints > limiter.maxWrongAttemptsByIPperDay) {
                retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1
            } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > limiter.maxConsecutiveFailsByUsernameAndIP) {
                retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1
            } else if (rlResUsername !== null && rlResUsername.consumedPoints > limiter.maxConsecutiveFailsByUsername) {
                retrySecs = Math.round(rlResUsername.msBeforeNext / 1000) || 1
            }
            if (retrySecs > 0) {
                const email = '1resUsernameAndIP: ' + usernameIPkey + '    ' + resUsernameAndIP + '    ' + '2resSlowByIP: ' + ipAddr + '    ' + resSlowByIP + '    ' + '3relResUserName: ' + username + '    ' + rlResUsername
             
                await emailBloqueo(email)
                return done(null, false, { message: 'Bloqueado' })
    
            } else {
                const result = await checkUserAndPassword(username, password)
                console.log('aaaaaha',result,password, username)
                if(!result.validated){
                    switch (result.error_code) {
                        case 'bad_password': {
                            console.log('bad password')
                            // Count failed attempts by Username + IP only for registered users
                            const promises = []
                            promises.push(limiter.limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey))
                            promises.push(limiter.limiterSlowBruteByIP.consume(ipAddr))
                            promises.push(limiter.limiterConsecutiveFailsByUsername.consume(username))
                            await Promise.all(promises)
                            return done(null, false, { message: `Contraseña erronea` })
                        }
                        case 'not_user':
                            return done(null, false, { message: 'El usuario no existe' })
                        case 'email_not_validated': 
                            return done(null, false, { message: 'Falta la verificación del correo' })
                        default:
                            return done(null, false, { message: 'Contraseña o correo incorrecto' })
                                };
                } else {
                    // Reset limiter on successful authorisation
                    Promise.all([
                        limiter.limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey),
                        limiter.limiterSlowBruteByIP.delete(ipAddr),
                        limiter.limiterConsecutiveFailsByUsername.delete(username)
    
                    ])
                    return done(null, { id: result.id})
                }
            }

        }
        else{
            const result = await checkUserAndPassword(username, password)
                console.log('aaaaaha',result,password, username)
                if(!result.validated){
                    switch (result.error_code) {
                        case 'bad_password': {
                            console.log('bad password')
                            // Count failed attempts by Username + IP only for registered users
                            return done(null, false, { message: `Contraseña erronea` })
                        }
                        case 'not_user':
                            return done(null, false, { message: 'El usuario no existe' })
                        case 'email_not_validated': 
                            return done(null, false, { message: 'Falta la verificación del correo' })
                        default:
                            return done(null, false, { message: 'Contraseña o correo incorrecto' })
                                };
                }
                else {
                    return done(null, { id: result.id})
                }

        }

		} catch (error) {
			return done(error)
				}
}

//determinamos que info tneemos q guardar en la sesion (id del usuario)
passport.serializeUser(function (user, done) {
    console.log(user,'serialized user')
   
    return done(null, user)
})
            
            //usa el id para buscar en el database
passport.deserializeUser( async function (userToBeFound, done) {
    console.log(userToBeFound,'deserialized user')
        const userFound = userToBeFound.id || userToBeFound
        const user = await knex('t_usuarios').first('id','role').where({ id: userFound })
                if (user) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
})

const isLoggedIn = (req, res, next) => {
if (req.isAuthenticated()) {
    console.log(req.user,'rq.user')
    console.log('\x1b[31m%s\x1b[0m', 'Logged in');
    return next()
} else {
    console.log(req.isAuthenticated(),'is not logged in', req.user, req.session,'raaa', req.session.passport)
     res.redirect('/login')
}
}


/// /////////////////////////////////////////////////////////////////// PASSPORT CONFIGURATION

async function generateNewPassword (username, ipAddr) {
    try {
        if (process.env.NODE_ENV === 'production') {
            const resUserName = await limiter.limiterConsecutiveNewPassByUsername.get(username)
            if (resUserName !== null && resUserName.consumedPoints > limiter.maxWrongAttemptsByIPperDay) {
                const email = 'Demasiadas peticiones de nueva password: ' + username + '     ' + resUserName
                emailBloqueoLogin(email)
                return false
            }
            await limiter.limiterSlowBruteByIP.consume(ipAddr)
        }
        const userExists = hashr.checkUser(username)
        if (!userExists) {
            return false
        };
        // const isOauth = await hashr.checkOauth(username);
        // if (isOauth) {
        //     mailForgetOauth({ email: username, oauth: isOauth });
        // } else {
        // const newPass = await hashr.crearNuevaPassword(username);
        // mailForget({ email: username, password: newPass });
        // }
        const newPass = await hashr.crearNuevaPassword(username)
        mailForget({ email: username, password: newPass })
        return true
    } catch (e) {
        const er = errorBreadcrumbs(e, 'generateNewPassword'); throw er
    }
};


module.exports = { passport, isLoggedIn, limiter}

