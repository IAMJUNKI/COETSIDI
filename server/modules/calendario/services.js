
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
  const sessionArray = []
  const subjectColorMap = {};
  let colorIndex = 1;
  
  for (const semestre in scheduleData) {
    const diasDeLaSemana = scheduleData[semestre];
  
    for (const dia in diasDeLaSemana) {
      const sessions = diasDeLaSemana[dia];
     
      const collisionMap = {};
      // console.log(dia,'dia')
  // Iterate through scheduleData to calculate collision indices
  sessions.forEach( (session, index) => {
  let {Asignatura, HoraInicio, HoraFinal, Aula, Grupo, Tipo } = session;
  const startSession = session.HoraInicio.replace(":", "");
  const endSession = session.HoraFinal.replace(":", "");
  let collisions = 0
  const collidedBuddy = []
  for (let j = 0; j < sessions.length; j++) {
  
  const start2 = sessions[j].HoraInicio.replace(":", "");
  const end2 = sessions[j].HoraFinal.replace(":", "");
  
  if(j === index) continue
  else if ((startSession >= start2 && startSession < end2) || (endSession > start2 && endSession <= end2) || startSession<= start2 && endSession >= end2|| startSession>= start2 && endSession <= end2) {
      collisions ++
      collidedBuddy.push(j)
  
        }
  }
  
  const collisionHandler = {}
  collisionHandler.collidedBuddy = collidedBuddy
  collisionHandler.collisions = collisions
  collisionMap[index]=collisionHandler
  
        if (!subjectColorMap[Asignatura]) {
          subjectColorMap[Asignatura] = `default-color-${colorIndex}`;
          colorIndex = colorIndex === 12 ? 1 : colorIndex + 1; // Reset or increment color index
        }
        let diaSinAcento
        if(dia === 'Miércoles'){
          diaSinAcento = 'miercoles'
        }
        else{
          diaSinAcento = dia.toLowerCase()
        }
        const colorClass = subjectColorMap[Asignatura];
        const columnSpan =  handlerForCollisions(collisionMap,index, collidedBuddy,collisions, diaSinAcento)
        if(Asignatura = 'English for Professional and Academic Communication') Asignatura = 'EPAC'
       if(columnSpan !== `${dia}-start / ${dia}-end` && Asignatura.length>15) Asignatura = shortenSentence(Asignatura)
      switch (Tipo) {
          case 'Teoría y Problemas':
              Tipo = 'TyP'
              break;
          case 'Laboratorio':
              Tipo = 'Lab'
              break;
          case 'Acciones Cooperativas':
              Tipo = 'AC'
              break;
      
          default:
              break;
      }
        // const sessionElement = createScheduleElement(Asignatura, HoraInicio, HoraFinal, Aula, Grupo, diaSinAcento, Tipo, colorClass, semestre, columnSpan);
  
        sessionArray.push({
          element: {asignatura: Asignatura, hora_inicio: HoraInicio, hora_final: HoraFinal, aula: Aula, grupo: Grupo, dia: diaSinAcento, tipo: Tipo, color: colorClass, semestre, column_span: columnSpan},
          startTime: HoraInicio 
        })
      //   scheduleContainer.appendChild(sessionElement);
      });
    }
  }
      sessionArray.sort((a, b) => {
          return a.startTime.localeCompare(b.startTime);
      });
  
    return sessionArray;
}


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



module.exports = {
  personalizacionHorario,
  guardarSemestre,
  guardarColor,
  createSchedule,
}
