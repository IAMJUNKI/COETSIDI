const debug = require('debug')('&:GESTORDATA: handlers')
const services = require('./services.js')

const getAllSubjects = async (req, res, next) => {
    try {
        const { titulacion, cursos } = req.body;
        console.log(titulacion, cursos,'ey')
        // for(const curso of cursos){
        //     console.log('curso',curso)
        // }
        const nombresGrupos =await services.getNombresGrupos(titulacion, cursos)
        const CSVFiltrado =await services.processCSVs(nombresGrupos)
        const objetoEstructurado = await services.crearObjetoEstructurado(CSVFiltrado)

        console.log(JSON.stringify(objetoEstructurado, null, 2));
        res.status(200).send(objetoEstructurado)
    } catch (e) {
        debug('Error en handlers/getAllSubjects ' + e)
        throw e
    }
};

module.exports = {
    getAllSubjects
}