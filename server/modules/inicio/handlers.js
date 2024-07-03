const debug = require('debug')('&:INICIO: handlers')
const services = require('@inicio/services.js')


const obtenerClasesEnCurso = async (req, res, next) => {
    try {
        const userId = req.user.id;

       const cursos =await services.obtenerClasesEnCurso(userId);

        res.send(cursos);
    } catch (e) {
        debug('Error in handlers/inicio ' + e);
        next(e); 
    }
};

const nombreDeUsuario = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Await the URL from authentification
        const nombreUsuario = await services.nombreDeUsuario(userId);
        
        res.send(nombreUsuario);
    } catch (e) {
        debug('Error in handlers/INICIO ' + e);
        next(e);
    }
};



module.exports = {
    obtenerClasesEnCurso,
    nombreDeUsuario
}