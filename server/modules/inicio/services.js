
const { knex } = require('@db/knex.js');
const {getDataUser} = require('@utils/utils.js');
// const { compareSync } = require('bcrypt');
const {encryptPassword} = require("@auth/helpers/encryptDecrypt")


const nombreDeUsuario = async (id) => {
  
  const nombreUsuario = await knex('t_usuarios').where({ id}).first('username')
  
  return nombreUsuario.username
  
  }

    const obtenerClasesEnCurso = async (id) => {
  
     const horario = await getDataUser(id)
     const result = obtenerClasesActualesYSiguientes(horario);
  
     return result
     
      }


      function obtenerClasesActualesYSiguientes(horario) {
        // Get the current date and time
        const now = new Date();
        const diaActual = now.toLocaleDateString('es-ES', { weekday: 'long' });
        const horaActual = now.getHours() * 60 + now.getMinutes(); // convert current time to minutes
        const mesActual = now.getMonth() + 1; // getMonth() returns 0-11, so we add 1
    
        // Check the month and determine the semester to parse
        let semestre;
        semestre = "semestre_2"
        //  if ([9, 10, 11, 12].includes(mesActual)) { 
        //     semestre = "semestre_1";
        // } else if ([2, 3, 4, 5].includes(mesActual)) { 
        //     semestre = "semestre_2";
        // } else {
        //     return { clasesActuales: [], proximaClase: [] }; 
        // }
        // variables to store current and next courses
        let clasesActuales = [];
        let proximaClase = [];
        let horaProximaClase = Infinity;
    
        // Get the courses for the determined semester
        const diasDeLaSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    
    let hoy
    let indexHoy
    for (let i = 0; i < diasDeLaSemana.length; i++) {
      if (diaActual.toLowerCase() === diasDeLaSemana[i].toLowerCase()) {
          hoy = diasDeLaSemana[i];
          indexHoy = i;
          break;
      }
  }

    const dias = horario[semestre];

    // console.log(indexHoy,'hoysindex')
    // console.log(horaActual,'current TIMEEEE')
    
    const processCourses = (dia, horaActualX) => {


      if (dias?.[dia]) {
          for (const asignatura of dias[dia]) {
              const [startHours, startMinutes] = asignatura.HoraInicio.split(':').map(Number);
              const [endHours, endMinutes] = asignatura.HoraFinal.split(':').map(Number);
              const startTime = startHours * 60 + startMinutes; // convert start time to minutes
              const endTime = endHours * 60 + endMinutes; // convert end time to minutes

              // Check if the asignatura is happening now
              if (startTime <= horaActualX && horaActualX < endTime) {
                  clasesActuales.push(asignatura);
              }

              // Check if the asignatura is the next one starting after now
              if (startTime > horaActualX && startTime <= horaProximaClase) {
                // console.log(startTime,'starttime',horaProximaClase,'horaprocimaclase',asignatura)
                  if (startTime <= horaProximaClase) {
                    proximaClase.push(asignatura)
                    horaProximaClase = startTime;
                  }
              }
          }
      }
       return {
        clasesActuales: clasesActuales,
        proximaClase: proximaClase
    }
  };

     processCourses(hoy, horaActual)

     if (proximaClase.length === 0) {
      for (let i = 1; i < diasDeLaSemana.length; i++) {
          let nextIndex = (indexHoy + i) % diasDeLaSemana.length;
          processCourses(diasDeLaSemana[nextIndex], 480); //8 de la mañana
          if (proximaClase.length > 0) break;
      }
  }

    return {
        clasesActuales: clasesActuales,
        proximaClase: proximaClase,
        diaActual: hoy
    };
}

const cambiarContrasena = async (id,password) => {
  
  try {
    
  const encryptedPassword = await encryptPassword(password)
  
  const done =await changePasswordDB(encryptedPassword,id)

  return done

  } catch (error) {
    console.error(error)
  }
  
   }
   
async function changePasswordDB(password,id) {

  await knex('t_usuarios').update({password}).where({ id })
  
}
    

const cambiarNombre = async (id,name) => {
  try {
    const done = await knex('t_usuarios').update({ username: name }).where({ id });
    console.log('Update result:', done); // Log the result
    return 'done';
} catch (error) {
    console.error('Error in cambiarNombre:', error);
    throw error; // Ensure the error is thrown so it can be caught by the caller
}
}

module.exports = {
  obtenerClasesEnCurso,
  nombreDeUsuario,
  cambiarContrasena,
  cambiarNombre
}
