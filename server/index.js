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
const debug = require('debug')('&:INDEX JS')

//SUB ROUTERS
const authRouter = require('@auth/router.js')
const gestorDataRouter = require('@gestorData/router.js')
const googleCalendarRouter = require('@googleCalendar/router.js')



globalRouter.use(express.json());
globalRouter.use(express.urlencoded({ extended: false }));

//checkear que el problema del passport no vienen de que estamos en local
//entrada diferente
 
//COOKIES SESSION
//-----------------------------------------------------------------------
if (process.env.NODE_ENV === 'development') {
	
	const pgSession = require('connect-pg-simple')(session)
    const sessionPool = require('pg').Pool
    const sessionDBaccess = new sessionPool({
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        port: 5432,
        database: process.env.DATABASE_SESSION
    })
	globalRouter.use(
		session({
			store: new pgSession({
				pool: sessionDBaccess,
				tableName: 'dev_sessions',
				createTableIfMissing: true,
				pruneSessionInterval: false
			}),
			secret:process.env.COOKIE_SECRET,
			// proxy: true,
			cookie: { maxAge:172800000, secure:false, sameSite: 'lax', httpOnly: true},
			resave: false,
			saveUninitialized: false,
			
			
		})
	);
}
else if (process.env.NODE_ENV === 'production') {
	//store for the cookie
	// const redisClient = redis.createClient()
	// redisClient.connect().catch(console.error)
    // const store = new RedisStore({ client: redisClient })
}

globalRouter.use(passport.initialize());
globalRouter.use(passport.session());

globalRouter.use(express.static(path.join(__dirname,'../client/login/src')))
globalRouter.get(['/', '','/login'], (req, res, next) => {
	try {
		const file = 'login.html'
        res.sendFile(file, { root: '../client/login' }, function (err) {
			if (err) {
				console.log(err) 
			}
        }
	)
} catch (err) {
	console.log(err,'error')
}
})

globalRouter.use(express.static(path.join(__dirname,'../client/signup/src')))
globalRouter.get(['/signup'], (req, res, next) => {
	try {
		const file = 'signup.html'
        res.sendFile(file, { root: '../client/signup' }, function (err) {
			if (err) {
				console.log(err) 
			}
        }
	)
} catch (err) {
	console.log(err,'error')
}
})




//verifies that the user is Logged in before going to any other end point
//--------------------------------------------------------------------------
globalRouter.use('/auth',authRouter)
globalRouter.use('', isLoggedIn)
//--------------------------------------------------------------------------

globalRouter.use(express.static(path.join(__dirname,'../client/dashboard/src')))

globalRouter.get(['/dashboard.js'], async (req, res, next) => {
    try {
        const file = 'dashboard.js'
        res.sendFile(file, { root: '../client/dashboard/src/js' }, function (err) {
            if (err) { console.log(err) }
        }
        )
    } catch (e) {
        const er = errorBreadcrumbs(e, `ADMIN_ROUTER  ${req.method}  ${req.url}`); next(er)
    }
})
globalRouter.get(['/dashboard'], (req, res, next) => {
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

globalRouter.get(['/oauthgoogle'], (req, res, next) => {
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

globalRouter.get('/logout', (req, res) => {
	req.logout(function (err) {
        if (err) { debug('ERROR LOGOUT', err); return next(err) }
        debug('Logout done!!')
        req.session.destroy()
        res.redirect('/login')
    })
})

globalRouter.use('/gestorData',gestorDataRouter)
globalRouter.use('/calendar',googleCalendarRouter)

const port = process.env.PORT || 5050;

globalRouter.listen(port, async () => {
	await connectToDatabase();
	await syncDatabase();
	console.log(`Servidor http corriendo en el puerto ${port}`);
});
