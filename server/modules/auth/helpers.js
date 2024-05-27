
const { knex } = require('@db/knex.js')
const passport = require("passport");

//middleware de autentificación
const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require('bcrypt');


//AUTHENTICATION of users
// ------------------------------------------------------------------------------

//configuarmos una nueva instancia de la estrategia local y la pasamos al middleware passport
//con los parametros username password y done donde done nos dirá si el user está autentificado
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: true
  },login));
				
async function login(username, password, done) {
	try {
			const result = await checkUserAndPassword(username, password)
        console.log('aaaaaha',result,password, username)
        if(!result.validated){
            switch (result.error_code) {
                case 'bad_password': {
                    console.log('bad passsword')
                    // Count failed attempts by Username + IP only for registered users
                    return done(null, false, { message: `Incorrect password for ${username}` })
                }
                case 'not_user':
                    return done(null, false, { message: 'No accounts exist with that username' })
                default:
                    return done(null, false, { message: 'Incorrect username or password' })
                        };
        } else {
			return done(null, { id: result.id, newuser: result.newuser })
		}
		} catch (error) {
			return done(error)
				}
}

const checkUserAndPassword = async (username, password) => {
    try {
        const userToBeFound = username.toLowerCase()
        const infoUser = await knex('t_usuarios').where({ username: userToBeFound }).first('id', 'password') || {}
        console.log(infoUser,'infousers')
        let response
        
        if (infoUser.id) {
            const valid = await bcrypt.compare(password, infoUser.password);
            if (valid) {
              
                response = { validated: true, id: infoUser.id }
                // const isFirstTime = await funnel.primerLoginUsuario(infoUser.id)
                // response.newuser = isFirstTime
            } else {
                response = { validated: false, error_code: 'bad_password' }
            };
        } else {
            response = { validated: false, error_code: 'not_user' }
        }
        
        return response
    } catch (e) {
        console.log(e, 'checkUserAndPassword');
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
            const user = await knex('t_usuarios').first('id').where({ id: userFound })
                    if (user) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
    })

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('\x1b[31m%s\x1b[0m', 'Logged in');
        return next()
    } else {
        console.log(req.isAuthenticated(),'is not logged in', req.user, req.session,'raaa', req.session.passport)
         res.redirect('/login')
    }
}



 module.exports = { passport, isLoggedIn}

