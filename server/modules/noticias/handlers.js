const debug = require('debug')('&:NOTICIAS: handlers')
const services = require('@noticias/services.js')


const getNoticias = async (req, res, next) => {
    try {
        const userRole = req.user.role;
        const { ano, mes } = req.params

       const noticias =await services.getNoticias(ano, mes);
       const adminTools = await services.getAdminTools(userRole)

       const noticiasAndExtras = {}
       noticiasAndExtras.noticias = noticias
       noticiasAndExtras.delete = adminTools.delete
       noticiasAndExtras.add = adminTools.add

        res.send(noticiasAndExtras);
    } catch (e) {
        debug('Error in handlers/noticias ' + e);
        next(e); 
    }
};



const crearNuevaNoticia = async (req, res, next) => {
    try {
        const userRole = req.user.role;
        const { dia, numero, mes, ano, titulo, texto, link } = req.body

        if(userRole != 'admin'){
            res.status(500).json({message:'No tienes permisos'})
        }
        else{
             await services.crearNuevaNoticia(dia, numero, mes, ano, titulo, texto, link);
            res.status(200).json({ message: 'noticia publicada' })
        }
    
    } catch (e) {
        debug('Error in handlers/noticias ' + e);
        next(e); 
    }
};


const borrarNoticia = async (req, res, next) => {
    try {
        const userRole = req.user.role;
        const { id } = req.body

        if(userRole != 'admin'){
            res.status(500).json({message:'No tienes permisos'})
        }
        else{
             await services.borrarNoticia(id);
            res.status(200).json({ message: 'noticia borrada' })
        }
    
    } catch (e) {
        debug('Error in handlers/noticias ' + e);
        next(e); 
    }
};


module.exports = {
    getNoticias,
    crearNuevaNoticia,
    borrarNoticia
}