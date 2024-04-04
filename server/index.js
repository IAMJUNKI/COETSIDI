const express = require('express');
const app = express();
const cors = require('cors');

const port = 80;

app.listen(port, function(){
	console.log('Servidor http corriendo en el puerto 80');
});

app.get('/', function(req, res){
	res.send('Hola, estas en la pagina inicial');
	console.log('Se recibio una petición get');
});