const path = require('path');
require('./aliases');
//obtenemos el archivos con las variables de entorno a usar
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const globalRouter = express();

//middleware session cookie en el navegador
const session = require("express-session")
const redis = require('redis')
const RedisStore = require('connect-redis').default
// const cors = require('cors');

const {passport, isLoggedIn} = require('@auth/helpers.js')
const { connectToDatabase, syncDatabase } = require('@db/connection.js');

//SUB ROUTERS
const authRouter = require('@auth/router.js')

globalRouter.use(express.json());
globalRouter.use(express.urlencoded({ extended: false }));

//checkear que el problema del passport no vienen de que estamos en local
//entrada diferente
 
//COOKIES SESSION
//-----------------------------------------------------------------------
// if (process.env.NODE_ENV === 'development') {
	
// 	const redisClient = redis.createClient()
// 	redisClient.connect().catch(console.error)
//     const store = new RedisStore({ client: redisClient })

// 	globalRouter.use(
// 		session({
// 			store,
// 			secret:process.env.COOKIE_SECRET,
// 			cookie: { maxAge:172800000, secure:false, sameSite: "none"},
// 			resave: false,
// 			saveUninitialized: false,
			
			
// 		})
// 	);
// }
// else if (process.env.NODE_ENV === 'production') {
	
// }

// globalRouter.use(passport.initialize());
// globalRouter.use(passport.session());

// globalRouter.use(express.static(path.join(__dirname,'../client/login/src')))
// globalRouter.get(['/', '','/login'], (req, res, next) => {
// 	try {
// 		const file = 'login.html'
//         res.sendFile(file, { root: '../client/login' }, function (err) {
// 			if (err) {
// 				console.log(err) 
// 			}
//         }
// 	)
// } catch (err) {
// 	console.log(err,'error')
// }
// })
//volver a ponerlo bien cunado acabe con las `pruebas


globalRouter.use(express.static(path.join(__dirname,'../client/dashboard/src')))
globalRouter.get(['/', '','/login'], (req, res, next) => {
try {
	const file = 'dashboard.html'
	res.sendFile(file, { root: '../client/dashboard' }, function (err) {
		if (err) {
			console.log(err) 
		}
	}
)
} catch (err) {
console.log(err,'error')
}
})

// globalRouter.use(express.static(path.join(__dirname,'../client/signup/src')))
// globalRouter.get(['/signup'], (req, res, next) => {
// 	try {
// 		const file = 'signup.html'
//         res.sendFile(file, { root: '../client/signup' }, function (err) {
// 			if (err) {
// 				console.log(err) 
// 			}
//         }
// 	)
// } catch (err) {
// 	console.log(err,'error')
// }
// })

// globalRouter.get('/logout', (req, res) => {
// 	req.logout()
//     req.session.destroy()
//     res.redirect('/login')
// })

//verifies that the user is Logged in before going to any other end point
//--------------------------------------------------------------------------
// globalRouter.use('/auth',authRouter)
// globalRouter.use('', isLoggedIn)
//--------------------------------------------------------------------------
const port = process.env.PORT || 5050;

globalRouter.listen(port, async () => {
	await connectToDatabase();
	await syncDatabase();
	console.log(`Servidor http corriendo en el puerto ${port}`);
});
