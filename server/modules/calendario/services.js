
const { knex } = require('@db/knex.js');


const guardarSemestre = async (user_id, semestre) => {

  await knex('t_horarios').update({semestre_horario: semestre}).where({ user_id })
  
  }

  const guardarColor = async (user_id, color) => {

    await knex('t_horarios').update({paleta_horario: color}).where({ user_id })
    
    }
  
const personalizacionHorario = async (user_id) => {

const horarioPersonalizado = await knex('t_horarios').where({ user_id }).first('semestre_horario','paleta_horario')

if ( horarioPersonalizado.semestre_horario === null){
  const now = new Date();
  if (now.getMonth() >= 8 || now.getMonth() == 0){
    horarioPersonalizado.semestre_horario = 'semestre_1'
  }
  else {
    horarioPersonalizado.semestre_horario = 'semestre_2'
  }
}
else if (horarioPersonalizado.paleta_horario === null) {
  horarioPersonalizado.paleta_horario = 'default-color'
}

  return horarioPersonalizado

}

const createSchedule = async (scheduleData) => {
  const sessionArray = [];
  const subjectColorMap = {};
  let colorIndex = 1;
  
  // Step 1: Collect all subjects
  const allSubjects = new Set();
  
  for (const semestre in scheduleData) {
    const diasDeLaSemana = scheduleData[semestre];
    for (const dia in diasDeLaSemana) {
      const sessions = diasDeLaSemana[dia];
      sessions.forEach((session) => {
        allSubjects.add(session.Asignatura);
      });
    }
  }

  // Step 2: Sort subjects alphabetically
  const sortedSubjects = Array.from(allSubjects).sort();

  // Step 3: Assign colors based on alphabetical order
  sortedSubjects.forEach((subject) => {
    if (!subjectColorMap[subject]) {
      subjectColorMap[subject] = `default-color-${colorIndex}`;
      colorIndex = colorIndex === 12 ? 1 : colorIndex + 1; // Reset or increment color index
    }
  });


  for (const semestre in scheduleData) {
    const diasDeLaSemana = scheduleData[semestre];

    for (const dia in diasDeLaSemana) {
      const sessions = diasDeLaSemana[dia];

      const collisionMap = {};

      sessions.forEach((session, index) => {
        let { Asignatura, HoraInicio, HoraFinal, Aula, Grupo, Tipo, ID } = session;
        let asignaturaTablas = Asignatura;
        const startSession = session.HoraInicio.replace(":", "");
        const endSession = session.HoraFinal.replace(":", "");
        let collisions = 0;
        const collidedBuddy = [];
        
        for (let j = 0; j < sessions.length; j++) {
          const start2 = sessions[j].HoraInicio.replace(":", "");
          const end2 = sessions[j].HoraFinal.replace(":", "");

          if (j === index) continue;
          else if (
            (startSession >= start2 && startSession < end2) ||
            (endSession > start2 && endSession <= end2) ||
            (startSession <= start2 && endSession >= end2) ||
            (startSession >= start2 && endSession <= end2)
          ) {
            collisions++;
            collidedBuddy.push(j);
          }
        }

        const collisionHandler = {};
        collisionHandler.collidedBuddy = collidedBuddy;
        collisionHandler.collisions = collisions;
        collisionMap[index] = collisionHandler;

        // Assign color based on the pre-generated subjectColorMap
        const colorClass = subjectColorMap[Asignatura];

        let diaSinAcento = dia === 'Miércoles' ? 'miercoles' : dia.toLowerCase();

        const columnSpan = handlerForCollisions(collisionMap, index, collidedBuddy, collisions, diaSinAcento);

        if (Asignatura === 'English for Professional and Academic Communication') {
          asignaturaTablas = 'EPAC';
          Asignatura = 'EPAC';
        }

        if (columnSpan !== `${dia}-start / ${dia}-end` && Asignatura.length > 15) {
          Asignatura = shortenSentence(Asignatura);
        }

        switch (Tipo) {
          case 'Teoría y Problemas':
            Tipo = 'TyP';
            break;
          case 'Laboratorio':
            Tipo = 'Lab';
            break;
          case 'Acciones Cooperativas':
            Tipo = 'AC';
            break;
          default:
            break;
        }

        // Push session data into the sessionArray
        sessionArray.push({
          element: {
            asignatura: Asignatura,
            hora_inicio: HoraInicio,
            hora_final: HoraFinal,
            aula: Aula,
            grupo: Grupo,
            dia: diaSinAcento,
            tipo: Tipo,
            color: colorClass,
            semestre,
            column_span: columnSpan,
            id: ID,
            asignatura_tablas: asignaturaTablas,
            dia_tablas: dia
          },
          startTime: HoraInicio
        });
      });
    }
  }

  // Sort sessions by startTime
  sessionArray.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return sessionArray;
};



function handlerForCollisions(collisionMap,index,collidedBuddy,collisions, dia) {
  let counter = 0;
  let counter2 = 0;
  let greatestCollision = collisions;

  if (collisions === 0) return `${dia}-start / ${dia}-end`
  else{ 
      // Iterate through all values in the collisionMap
      for (let key in collisionMap) {
          let value = collisionMap[key];

          // Check if the current index is in the collidedBuddy array of the current key
          if (value.collidedBuddy.includes(index)) {
              // Determine the greatest collision number
              // greatestCollision = Math.max(greatestCollision, value.collisions);
                      counter++;
          }
          if(collidedBuddy.includes(key)) counter2++
      }

      counter = Math.max(counter, counter2);    
      switch (greatestCollision) {
          case 1:
              if(counter === 0) return `${dia}-start / ${dia}-half`
              else return `${dia}-half / ${dia}-end`
              break;
          case 2:
              if(counter === 0 ) return `${dia}-start / ${dia}-first-third`
              else if(counter === 1)return `${dia}-first-third / ${dia}-second-third`
              else return `${dia}-second-third / ${dia}-end`
              break;
          case 3:
              if(counter === 0 ) return `${dia}-start / ${dia}-first-third`
              else if(counter === 1)return `${dia}-first-third / ${dia}-second-third`
              else return `${dia}-second-third / ${dia}-end`
              break;
          case 4:  if(counter === 0 ) return `${dia}-start / ${dia}-first-third`
          else if(counter <= 2)return `${dia}-first-third / ${dia}-second-third`
          else return `${dia}-second-third / ${dia}-end`
          break;
          case 5:  if(counter === 0 ) return `${dia}-start / ${dia}-first-third`
          else if(counter <= 3)return `${dia}-first-third / ${dia}-second-third`
          else return `${dia}-second-third / ${dia}-end`
          default:
              break;
      }
  }
}


function shortenSentence(sentence) {
  const wordsToIgnore = ["de", "y", "en", "la", "el", "a", "con","and","for"]; // Common words to ignore
  const maxCharsPerWord = 4; // Maximum characters to take from each word

  return sentence.split(' ').map(word => {
      if (wordsToIgnore.includes(word.toLowerCase())) {
          return word;
      }
      return word.slice(0, maxCharsPerWord) + '.';
  }).join(' ');
}

const correctDataTime = (horaInicio, horaFinal) => {

  const adjustMinutes = (hours, minutes) => {
    if (minutes <= 15) {
      return `${String(hours).padStart(2, '0')}:00`; 
    } else if (minutes <= 45) {
      return `${String(hours).padStart(2, '0')}:30`;  
    } else {
      hours += 1; 
      if (hours === 24) hours = 0;  
      return `${String(hours).padStart(2, '0')}:00`;
    }
  };

  // Funcion para establecer limites  (08:00 a 21:00)
  const enforceTimeLimits = (hour, minute) => {
    const totalMinutes = hour * 60 + minute;

 
    if (totalMinutes < 8 * 60) {
      return '08:00';
    }

 
    if (totalMinutes > 21 * 60) {
      return '21:00';
    }

    return adjustMinutes(hour, minute);
  };

  // Convert time strings to hour and minute integers
  const [startHour, startMinute] = horaInicio.split(':').map(Number);
  const [endHour, endMinute] = horaFinal.split(':').map(Number);

  // Adjust and enforce time limits for start and end times
  const newHoraInicio = enforceTimeLimits(startHour, startMinute);
  const newHoraFinal = enforceTimeLimits(endHour, endMinute);

  // Compare times in total minutes since 00:00 to determine order
  const totalMinutesInicio = startHour * 60 + startMinute;
  const totalMinutesFinal = endHour * 60 + endMinute;

  // Return the corrected times with the lower one as `newHoraInicio` and the higher as `newHoraFinal`
  if (totalMinutesInicio <= totalMinutesFinal) {
    return { newHoraInicio, newHoraFinal };
  } else {
    return { newHoraInicio: newHoraFinal, newHoraFinal: newHoraInicio };  // Swap if `horaInicio` > `horaFinal`
  }
};



const editarCalendario = async (userId, id, dia, horaInicio, horaFinal, aula, semestre) => {
  try {

      // Primero cogemos el objeto actual en la base de datos
      const currentData = await knex('t_horarios')
          .select('data_user')
          .where({ user_id: userId })
          .first();



      if (!currentData) {
          throw new Error('No se encontró el horario para este usuario.');
      }

      // Parse the JSON data
      let horarios = currentData.data_user;

      // Segundo filtramos para encontrar el ID especifico para modificar la info acorde
      let updated = false;
      let entryToMove = null;
      let originalDay = null;
      let aulaDef


      const updateSemester = (semester) => {
        for (const [day, entries] of Object.entries(semester)) {
            entries.forEach((entry, index) => {
                if (entry.ID === id) {
                    console.log('Match Found:', entry); // Log matched entry

                    if(aula === 'Sin aula asociada') aulaDef = ""
                    else aulaDef = aula
                    
                    // If the day hasn't changed, just update the entry
                    if (entry.Dia === dia) {
                        entry.HoraInicio = horaInicio;
                        entry.HoraFinal = horaFinal;
                        entry.Aula = aulaDef;
                        updated = true;
                    } else {
                        // If the day has changed, we need to move the entry
                        entryToMove = { ...entry, Dia: dia, HoraInicio: horaInicio, HoraFinal: horaFinal, Aula: aulaDef };
                        originalDay = day;  // Save the original day to remove the entry later
                    }
                }
            });
        }
    };

      // Update both semesters
      updateSemester(horarios[semestre]);
      

      // console.log('Current Data:', JSON.stringify(horarios, null, 2));

      if (entryToMove) {
        // Remove the entry from the original day
        horarios[semestre][originalDay] = horarios[semestre][originalDay].filter(entry => entry.ID !== id);

        // Add the entry to the new day
        if (!horarios[semestre][dia]) {
            horarios[semestre][dia] = [];  // If the day doesn't exist, create an empty array
        }
        horarios[semestre][dia].push(entryToMove);

        updated = true; // Mark as updated
    }

      if (!updated) {
          throw new Error('No se encontró la entrada con el ID proporcionado.');
      }

      // Step 4: Save the modified data back to the database
      const result = await knex('t_horarios')
    .where({ user_id: userId })
    .update({ data_user: horarios });


      return { success: true, message: 'Horario actualizado exitosamente.' };
  } catch (error) {
      console.error('Error al editar el calendario:', error);
      throw error;
  }
};

const borrarAsignatura = async (userId, id, semestre) => {
  try {
    // Get the current schedule data for the user
    const currentData = await knex('t_horarios')
      .select('data_user')
      .where({ user_id: userId })
      .first();

    console.log('Current Data:', currentData.data_user); // Debugging log

    if (!currentData) {
      throw new Error('No se encontró el horario para este usuario.');
    }

    // Parse the JSON data
    let horarios = currentData.data_user;
    let entryFound = false;
    let originalDay = null;

    // Function to remove the subject entry from the schedule
    const removeEntryFromSemester = (semester) => {
      for (const [day, entries] of Object.entries(semester)) {
        const filteredEntries = entries.filter(entry => {
          if (entry.ID === id) {
            entryFound = true; // Mark that we found the entry
            originalDay = day; // Save the day where the entry was found
            return false; // Remove this entry from the array
          }
          return true;
        });

        // Update the entries for the day
        semester[day] = filteredEntries;
      }
    };

    // Apply removal for the given semester
    removeEntryFromSemester(horarios[semestre]);

    // Check if the entry was found
    if (!entryFound) {
      throw new Error('No se encontró la entrada con el ID proporcionado.');
    }

    // Step 4: Save the modified data back to the database
    const result = await knex('t_horarios')
      .where({ user_id: userId })
      .update({ data_user: horarios });

    console.log('Knex Update Result:', result); // Debugging log for the update result

    return { success: true, message: 'Asignatura eliminada exitosamente.' };
  } catch (error) {
    console.error('Error al borrar asignatura:', error);
    throw error;
  }
};



module.exports = {
  personalizacionHorario,
  guardarSemestre,
  guardarColor,
  createSchedule,
  correctDataTime,
  editarCalendario,
  borrarAsignatura
}
