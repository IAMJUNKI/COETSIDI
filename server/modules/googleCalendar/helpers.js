
const {getDataUser} = require('@gestorData/services.js')



 async function formatEventsForGoogleCalendar (userId){
    const horario = await getDataUser(userId)
    const events = parseHorario(horario)
    // console.log(events,'events')
    return events

}

function parseHorario(horario) {
    const events = []; //donde se creará cada evento
    const now = new Date();
    const currentYear = now.getFullYear(); //año actual
    
    let startSemestre1;
    let startSemestre2;
    
    if (now.getMonth() >= 7) { // Agosto o despues
      startSemestre1 = new Date(currentYear, 8, 3); // 3 de septiembre de este año
      startSemestre2 = new Date(currentYear + 1, 0, 28); //28 de enero  del año siguiente
    } else { // Julio o antes
      startSemestre1 = null;
      startSemestre2 = new Date(currentYear, 0, 28); // 28 de enero de este año
    }

    function parseDia(horarioDia, startDate, recurrence) {
      horarioDia.forEach(session => {
        const HoraInicio = session.HoraInicio;
        const HoraFinal = session.HoraFinal;
        const aula = `${session.Aula}, ${session.Tipo}`;
        const startDateDay = new Date(startDate);
        startDateDay.setDate(startDate.getDate() + getDiaDeLaSemana(session.Dia)); //calcula desde el domingo que son los dias que le he mos dado mas arriba
  
        const event = crearEvento(
          session.Asignatura,
          aula,
          HoraInicio,
          HoraFinal,
          startDateDay,
          recurrence
        );
  
        events.push(event);
      });
    }

    if (startSemestre1) {
      for (const [dia, horarioDia] of Object.entries(horario.semestre_1)) {
        parseDia(horarioDia, startSemestre1, 16);
      }
    }
  
    if (startSemestre2) {
      for (const [dia, horarioDia] of Object.entries(horario.semestre_2)) {
        parseDia(horarioDia, startSemestre2, 17);
      }
    }
    
    return events;
  }



  function getDiaDeLaSemana(dia) {
    const diasDeLaSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasDeLaSemana.indexOf(dia);
  }

  function crearEvento(asignatura, aula, HoraInicio, HoraFinal, startDate, recurrence) {
    const [startHora, startMinuto] = HoraInicio.split(':').map(Number); //transforma en Number
    const [endHora, endMinuto] = HoraFinal.split(':').map(Number);
    
    const eventStart = new Date(startDate);
    eventStart.setHours(startHora, startMinuto, 0);

    const eventEnd = new Date(startDate);
    eventEnd.setHours(endHora, endMinuto, 0);

    return {
      summary: asignatura,
      location: aula,
      start: {
        dateTime: eventStart.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: eventEnd.toISOString(),
        timeZone: 'Europe/Madrid',
      },
      recurrence: [
        `RRULE:FREQ=WEEKLY;COUNT=${recurrence}`
      ],
    };
  }

  module.exports = {formatEventsForGoogleCalendar} 