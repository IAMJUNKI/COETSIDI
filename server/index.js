

const path = require('path');
//obtenemos el archivos con las variables de entorno a usar
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const app = express();

//middleware session cookie en el navegador
const session = require("express-session")
//middleware de autentificación
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const cors = require('cors');

//hashing passswords
const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = 'contraseñajdjdjd';
const wrongPassword = 'not_bacon';

const { connectToDatabase, syncDatabase } = require('./database/connection.js');

const port = process.env.PORT || 5050;
// console.log(process.env,'eee')

//hash and unhash passwords----------------------------------------
// bcrypt.hash(password, saltRounds, function(err, hash) {

// })


// bcrypt.compare(wrongPassword, hash, function(err, res) {
// 	if (res) {
// 	 // Passwords match
// 	} else {
// 	 // Passwords don't match
// 	}
//   });
// app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//COOKIES SESSION
//-----------------------------------------------------------------------
if (process.env.NODE_ENV === 'development') {

	app.use(
		session({
		  secret:process.env.COOKIE_SECRET,
		  cookie: { maxAge:172800000, secure:false, sameSite: "none"},
		  resave: false,
		  saveUninitialized: false,
		})
	  );
}
else if (process.env.NODE_ENV === 'production') {

}

//AUTHENTICATION of users
// ------------------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

//configuarmos una nueva instancia de la estrategia local y la pasamos al middleware passport
//con los parametros username password y done donde done nos dirá si el user está autentificado
passport.use(new LocalStrategy(login));

async function login(username, password, done) {
	try {
		const result = await hashr.checkUserAndPassword(username, password)
		switch (result.error_code) {
			case 'bad_password': {
				// Count failed attempts by Username + IP only for registered users
				return done(null, false, { message: 'Incorrect username or password' })
			}
			case 'not_confirmed':
				// TODO send another email...
				return done(null, false, { message: 'Account has not been confirmed' })
			case 'not_user':
				return done(null, false, { message: 'Incorrect username or password' })
			default:
				return done(null, false, { message: 'Incorrect username or password' })
			};
		// else {
			
		// 	return done(null, { id: result.id, newuser: result.newuser })
		// }
	} catch (error) {
		return done(error)
	}
}
//determinamos que info tneemos q guardar en la sesion (id del usuario)
passport.serializeUser(function (user, done) {
    return done(null, user)
})

//usa el id para buscar en el database
passport.deserializeUser(
	async function (userToBeFound, done) {
    const userFound = userToBeFound.id || userToBeFound
    const user = await knex(users_table).first('id').where({ id: userFound })
    if (user) {
        return done(null, user)
    } else {
        return done(null, false)
    }
})

//passport processess the auth
app.post("/login",
  passport.authenticate("local", { failureRedirect : "/login"}),
  (req, res) => {
    res.redirect("main");
  }
);
// app.use('/auth',authRouter)

app.use('/login/src', express.static(path.join(__dirname,'client/login/src')))
app.get(['/', ''], (req, res, next) => {
	try {
        const file = 'login.html'
        res.sendFile(file, { root: 'client/login' }, function (err) {
            if (err) { console.log(err) }
        }
        )
    } catch (err) {
       console.log(err,'error')
    }
})
//--------------------------------------------------------------------------
app.listen(port, async () => {
	await connectToDatabase();
	await syncDatabase();
	console.log(`Servidor http corriendo en el puerto ${port}`);
});

app.get('/', function(req, res){
	res.send('Hola, estas en la pagina inicial');
	console.log('Se recibio una petición get');
});