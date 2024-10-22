const debug = require('debug')('&:GESTORDATA: handlers')
const services = require('@gestorData/services/services.js');

const checkDB = async (req, res, next) => {
    try {
        const userId = req.user.id
        console.log(req.user,'a')
        const response =await services.isDBEmpty(userId)
        res.status(200).send(response)
    } catch (e) {
        debug('Error en handlers/checkDB ' + e)
        throw e
    }
};


const getAllSubjects = async (req, res, next) => {
    try {
        const { titulacion, cursos } = req.body;
        console.log(titulacion, cursos,'ey')
        const nombresGrupos =await services.getNombresGrupos(titulacion, cursos)
        console.log(nombresGrupos)
        const CSVFiltrado =await services.processCSVs(nombresGrupos)
        const objetoEstructurado = await services.crearObjetoEstructurado(CSVFiltrado, 'cursos')

        console.log(JSON.stringify(objetoEstructurado, null, 2));
        res.status(200).send(objetoEstructurado)
    } catch (e) {
        debug('Error en handlers/getAllSubjects ' + e)
        throw e
    }
};

const saveSubjects = async (req, res, next) => {
    try {
        const { asignaturasSeleccionadas } = req.body;
        const userId = req.user.id
       
        const objetoBonito =await services.separarGradoYAsignaturas(asignaturasSeleccionadas)
        // console.log(objetoBonito,'ICIIIIIIIIIIIII')
        const CSVFiltradoTotal = [];
        for (const grupo of Object.keys(objetoBonito)) {
            // console.log(grupo,'grupo', objetoBonito[grupo],'objetoBonito[grupo]')
            const CSVFiltrado = await services.processCSVs(grupo, objetoBonito[grupo], 'Asignatura');
            CSVFiltradoTotal.push(...CSVFiltrado);
            console.log(JSON.stringify(CSVFiltrado, null, 2),'individual.');
        }
        // console.log(JSON.stringify(CSVFiltradoTotal, null, 2),'csv filtrado.');
        const objetoEstructurado = await services.crearObjetoEstructurado(CSVFiltradoTotal, 'dias')
        // console.log(objetoEstructurado,'el objeto estrucutrado')

        await services.guardarInfoDB(objetoEstructurado, userId)
        // console.log(JSON.stringify(objetoEstructurado, null, 2));
        res.status(200).send(objetoEstructurado)
    } catch (e) {
        debug('Error en handlers/saveSubjects ' + e)
        throw e
    }
};

module.exports = {
    getAllSubjects, saveSubjects, checkDB
}