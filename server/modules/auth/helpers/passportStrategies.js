const passport = require("passport");
const { knex } = require('@db/knex.js')

//middleware de autentificación
const LocalStrategy = require("passport-local").Strategy;

const {checkUserAndPassword} = require("@auth/helpers/encryptDecrypt")


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
                    return done(null, false, { message: `Contraseña erronea` })
                }
                case 'not_user':
                    return done(null, false, { message: 'El usuario no existe' })
                default:
                    return done(null, false, { message: 'Contraseña o correo incorrecto' })
                        };
        } else {
			return done(null, { id: result.id})
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



module.exports = { passport, isLoggedIn}

