

const path = require('path');
//obtenemos el archivos con las variables de entorno a usar
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('./aliases');
const express = require('express');
const app = express();

//middleware session cookie en el navegador
const session = require("express-session")

// const cors = require('cors');

const authRouter = require('@auth/router.js')



const { connectToDatabase, syncDatabase } = require('./database/connection.js');

// console.log(process.env,'eee')

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


app.use(express.static(path.join(__dirname,'../client/login/src')))
app.get(['/', ''], (req, res, next) => {
	try {
		const file = 'login.html'
        res.sendFile(file, { root: '../client/login' }, function (err) {
			if (err) { console.log(err) }
        }
	)
} catch (err) {
	console.log(err,'error')
}
})

//--------------------------------------------------------------------------
app.use('/auth',authRouter)
//--------------------------------------------------------------------------
const port = process.env.PORT || 5050;

app.listen(port, async () => {
	await connectToDatabase();
	await syncDatabase();
	console.log(`Servidor http corriendo en el puerto ${port}`);
});

app.get('/', function(req, res){
	res.send('Hola, estas en la pagina inicial');
	console.log('Se recibio una petición get');
});