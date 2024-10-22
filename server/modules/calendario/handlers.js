const debug = require('debug')('&:CALENDARIO: handlers')
const services = require('@calendario/services.js')
const {getDataUser} = require('@utils/utils.js')

const guardarSemestre = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const semestre = req.params.semestre

       await services.guardarSemestre(userId,semestre);

        res.send('done');
    } catch (e) {
        debug('Error in handlers/authCalendar ' + e);
        next(e); 
    }
};

const guardarColor = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const color = req.params.color

       await services.guardarColor(userId,color);

        res.send('done');
    } catch (e) {
        debug('Error in handlers/authCalendar ' + e);
        next(e); 
    }
};

const personalizacionHorario = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Await the URL from authentification
        const semestreYColor = await services.personalizacionHorario(userId);
        
        res.send(semestreYColor);
    } catch (e) {
        debug('Error in handlers/authCalendar ' + e);
        next(e);
    }
};

const generarHorarios = async (req, res, next) => {
    try {
        const userId = req.user.id
        const dataUser =await getDataUser(userId)
        const sessionArray = await services.createSchedule(dataUser)
        res.status(200).send(sessionArray)
    } catch (e) {
        debug('Error en handlers/generarHorarios ' + e)
        throw e
    }
};

const editarCalendario = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { id, semestre, dia, horaInicio, horaFinal, aula } = req.body
        console.log (id, semestre, dia, horaInicio, horaFinal, aula)
        const correctedData = services.correctDataTime(horaInicio,horaFinal)

        const modifyData = await services.editarCalendario(userId, id, dia, correctedData.newHoraInicio, correctedData.newHoraFinal, aula, semestre)
        res.status(200).send(modifyData)
    } catch (e) {
        debug('Error en handlers/editarCalendario ' + e)
        throw e
    }
};


const borrarAsignatura = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { id, semestre, dia,} = req.body
        console.log (id, semestre)

        const modifyData = await services.borrarAsignatura(userId, id, semestre)
        res.status(200).send(modifyData)
    } catch (e) {
        debug('Error en handlers/editarCalendario ' + e)
        throw e
    }
};



module.exports = {
    guardarSemestre,
    guardarColor,
    personalizacionHorario,
    generarHorarios,
    editarCalendario,
    borrarAsignatura
}