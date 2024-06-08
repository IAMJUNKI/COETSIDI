

// const { preventDoubleClick, hideSpinner, showSpinner } = require('@utils/utils.js');


// //initializes as soon as the DOM is safe to manipulate
$(function() {
    
    $.ajax({
        url: '/gestorData/checkIfDataUserEmpty',
        type: 'get',
        success: function (response) {
         if (response === true){
            const elements = document.getElementsByClassName("newUser");
            for (const element of elements) {
                element.style.display = "none";
            }
            document.getElementById("cambiar_asignaturas").click();  
         }
         else {
            generarHorario()
         }
        },
        error: function (error) {
           console.error(error)
        }
    })
});


//IGUAL METERLO COMO FUNCION HELPER
const preventDoubleClick = function (event) {
    let timeStampGlobal = 0
    if (Math.abs(event.timeStamp - timeStampGlobal) < 500) { timeStampGlobal = event.timeStamp; return true } 
    else { timeStampGlobal = event.timeStamp; return false }
}

//Spinner de carga
function destroySpinner() { 
    document.getElementById('spinner_loader') .remove() 
}  

function showSpinner(element) { 
    document.getElementById(element).insertAdjacentHTML('beforeend', '&nbsp;'); //añadimos un espacio entre el spinner y el html del elemento anterior
    const spinner = document.createElement('div')
    spinner.setAttribute("role","status")
    spinner.setAttribute("class","spinner-border spinner-border-sm")
    spinner.setAttribute("id","spinner_loader")
    spinner.innerHTML =  `<span class="visually-hidden">Loading...</span>`
    document.getElementById(element).append(spinner)  
}  
//CAMBIO DE PAGINAS Y GESTION OFFCANVAS-------------------------------------------------------------

$(document).on('click', '#boton_inicio', async function (event) {
    event.preventDefault()
    if (preventDoubleClick(event)) { return };
    document.getElementById("pagina_horario").style.display = "none";
    document.getElementById("pagina_inicio").style.display = "";
})

//todos los nav item triggerean el click salvo el que tiene la clase dropdown (muy util)
$(document).on('click', '.nav-item:not(.dropdown)', async function () {
    document.getElementById("boton-cerrar-offcanvas").click();
})

//INICIO-----------------------------------------------------------------------------------------
$(document).on('change', '#selector-grados', async function (event) {

    console.log($(event.currentTarget).val())
    const gradoElegido = $(event.currentTarget).val()
    if(gradoElegido === '56DM'||gradoElegido === '56EE' || gradoElegido === 'erasmus'){
        $( "#curso5" ).prop( "disabled", false );
    } else{
        $( "#curso5" ).prop( "disabled", true );
        $( "#curso5" ).prop( "checked", false );
    }
    document.getElementById("segundaParteFormulario").style.display = "";
    
})

//verifica si algun checkbox está clickado para dejar buscar asignaturas (submit el form)
$(document).on('change', '.checkboxChanger', async function () {

    const checkboxes = document.querySelectorAll('.checkboxChanger');
    let anyChecked = false
    
    checkboxes.forEach((checkbox) => {
        if(checkbox.checked) anyChecked = true //verifica el valor de la propiedad checked
    });

    if(anyChecked)   $( "#buscarAsignaturas" ).prop( "disabled", false ); //si alguno está checkeado permitimos usar el buscador

    else   $( "#buscarAsignaturas" ).prop( "disabled", true );  
})

//misma funcion pero para el segundo form
$(document).on('change', '.checkSubjectChanger', async function () {

    const checkboxes = document.querySelectorAll('.checkSubjectChanger');
    let anyChecked = false
    
    checkboxes.forEach((checkbox) => {
        if(checkbox.checked) anyChecked = true 
    });

    if(anyChecked)   $( "#submit_asignaturas_info" ).prop( "disabled", false ); 

    else   $( "#submit_asignaturas_info" ).prop( "disabled", true );  
})

$(document).on('submit', '#js_form_buscar_asignaturas', async function (event) {

    event.preventDefault()
    if (preventDoubleClick(event)) { return };
    showSpinner('buscarAsignaturas')
    // showSpinner('js_form_asignaturas_usuario')
    const data = new FormData(event.target)
    // console.log(data)
    for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }

    $.ajax({
        url: '/gestorData/buscarAsignaturas',
        type: 'post',
        data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (objetoEstructurado) {
            destroySpinner()
            $('#js_form_asignaturas_usuario').empty()
            const selectorAsignaturas = document.createElement('div')

           const arrayHtml = [
                `<hr>
                <h2 class="fs-5">Selecciona tus asignaturas</h2>`
            ];
  
        Object.keys(objetoEstructurado).forEach(semestre => {

            arrayHtml.push(`<h4 class="fs-5">Semestre ${semestre.split('_')[1]}</h4>`)
          const semestreInfo = objetoEstructurado[semestre];
        //   console.log(semestre.split('_')[1],'semestre')

          Object.keys(semestreInfo).forEach(curso => {
     
            arrayHtml.push(`<h6>${curso} curso</h6>`)
            const arrayDeAsignaturas = semestreInfo[curso];
            console.log(curso,'curso')
 
            arrayDeAsignaturas.forEach(item => {

                const grupo = item.Grupo;
                const asignatura = item.Asignatura;

                arrayHtml.push(`
                <input type="checkbox" class="btn-check checkSubjectChanger" id="${grupo}_${asignatura}" value="${grupo}_${asignatura}" autocomplete="off" name="asignaturasSeleccionadas">
                <label class="btn btn-outline-primary" for="${grupo}_${asignatura}">${grupo}: ${asignatura}</label>
                `)
            });
          });
        });
        
            arrayHtml.forEach(function(array) {
                selectorAsignaturas.innerHTML += array;
            });
    
            document.getElementById('js_form_asignaturas_usuario').append(selectorAsignaturas)  
            
        },
        error: function (error) {
            $('#js_form_asignaturas_usuario').empty()
           console.error(error)
        }
    })
})


$(document).on('submit', '#js_form_asignaturas_usuario', async function (event) {

    event.preventDefault()
    if (preventDoubleClick(event)) { return };
    showSpinner('submit_asignaturas_info')
    const data = new FormData(event.target)
    // console.log(data)
    for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }

    $.ajax({
        url: '/gestorData/guardarAsignaturas',
        type: 'post',
        data,
        cache: false,
        contentType: false,
        processData: false,
        success: function () {
          destroySpinner()
          document.getElementById("cerrar_modal_asignaturas_2").click();
          generarHorario()
    
        },
        error: function (error) {
            $('#js_form_asignaturas_usuario').empty()
            document.getElementById('js_form_asignaturas_usuario').innerHTML='Error sending the data'
           console.error(error)
        }
    })
})

$(document).on('click', '#cerrar_modal_asignaturas_1, #cerrar_modal_asignaturas_2', async function (event) {
    event.preventDefault()
    if (preventDoubleClick(event)) { return };
    const elements = document.getElementsByClassName("newUser");
            for (const element of elements) {
                element.style.display = "";
            }  
            
   
})

$(document).on('click', '#cambiar_asignaturas', async function (event) {
    event.preventDefault()
    if (preventDoubleClick(event)) { return };
    $('#js_form_asignaturas_usuario').empty();
    document.getElementById("segundaParteFormulario").style.display = "none";
    
})

//HORARIO-----------------------------------------------------------------------------------------------------
$(document).on('click', '#boton_horario', async function (event) {
    event.preventDefault()
    if (preventDoubleClick(event)) { return };
    document.getElementById("pagina_inicio").style.display = "none";
    document.getElementById("pagina_horario").style.display = "";
})

function generarHorario(){
    $.ajax({
        url: '/gestorData/generarHorario',
        type: 'get',
        success: function (data) {
        
        renderSchedule(data);

        if (window.innerWidth < 992) showDay('lunes'); // Lunes es el default
        else showAllDays()

        },
        error: function (error) {
           console.error(error)
        }
    })
}



$(document).on('change', '#day-select', async function (event) {
    // const dia = $(event.currentTarget).val()
    showDay()
})



function showDay() {
    const day=document.getElementById('day-select').value
    const semestre = document.getElementById('elegir-semestre').value
    const schedule = document.querySelector('.schedule');
    const sessions = schedule.querySelectorAll('.session');
    sessions.forEach(session => {
      const gridColumn = session.style.gridColumn;
      const className = session.className
      if (gridColumn.includes(day) && className.includes(semestre)) {
        session.style.display = 'block';
      } else {
        session.style.display = 'none';
      }
    });
  }

  function showAllDays() {
    const semestre = document.getElementById('elegir-semestre').value
    // console.log(semestre,'semestre')
    const schedule = document.querySelector('.schedule');
    const sessions = schedule.querySelectorAll('.session');
    sessions.forEach(session => {
        session.style.display = 'none';
    });
    const semestreElegido = schedule.querySelectorAll(`.${semestre}`);
    semestreElegido.forEach(session => {
        session.style.display = 'block';
    });
   
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

  function createScheduleElement(asignatura, horaInicio, horaFinal, aula, grupo, dia, tipo, colorClass, semesterClass, columnSpan) {
    

    const sessionDiv = document.createElement('div');
    sessionDiv.className = `session ${colorClass} ${semesterClass}`;
    sessionDiv.style.gridColumn = `${columnSpan}`; // Lowercase the day and add column span
    sessionDiv.style.gridRow = `time-${horaInicio.replace(':', '')} / time-${horaFinal.replace(':', '')}`;
    const timeElement = document.createElement('span');
    timeElement.className = 'session-time';
    timeElement.textContent = `${horaInicio} - ${horaFinal} ${tipo}`;

    const titleElement = document.createElement('h3');
    titleElement.className = 'session-asignatura';
    titleElement.textContent = asignatura;

    const aulaElement = document.createElement('span');
    aulaElement.className = 'session-aula';
    aulaElement.textContent = `${aula}`;
  
   
  
    const tipoElement = document.createElement('span');
    tipoElement.className = 'session-tipo';
    tipoElement.textContent = tipo;
  
    sessionDiv.appendChild(titleElement);
    sessionDiv.appendChild(aulaElement);
    sessionDiv.appendChild(timeElement);
    // sessionDiv.appendChild(tipoElement);
  
    return sessionDiv;
  }

  //cambiar semestre horario
  $(document).on('change', '#elegir-semestre', async function (event) {

    showAllDays()
    
})


  function renderSchedule(scheduleData) {
      $('.session').remove()
    const scheduleContainer = document.getElementById('schedule-container');
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
          const diaSinAcento = dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          const colorClass = subjectColorMap[Asignatura];
          const columnSpan =  handlerForCollisions(collisionMap,index, collidedBuddy,collisions, `${diaSinAcento}`)
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
          const sessionElement = createScheduleElement(Asignatura, HoraInicio, HoraFinal, Aula, Grupo, diaSinAcento, Tipo, colorClass, semestre, columnSpan);
          scheduleContainer.appendChild(sessionElement);
        });
      }
    }
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
                greatestCollision = Math.max(greatestCollision, value.collisions);
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
 
            default:
                break;
        }
    }
}
  

//FUNCIONES RESPONSIVE


    window.addEventListener('resize', function() {
        handleScreenWidthChange();
    });

    function handleScreenWidthChange() {
        if (window.innerWidth >= 992) {
            showAllDays();
        } else {
            showDay()
        }
    }

//Google calendar

$(document).on('click', '#auth_calendar', async function (event) {
    event.preventDefault()
    if (preventDoubleClick(event)) { return };
console.log('ee')
    $.ajax({
        url: '/calendar/authCalendar',
        type: 'get',
        success: function (response) {
        //  if (response === true){
        //     const elements = document.getElementsByClassName("newUser");
        //     for (const element of elements) {
        //         element.style.display = "none";
        //     }
        //     document.getElementById("cambiar_asignaturas").click();
        //  }
        },
        error: function (error) {
           console.error(error)
        }
    })
   
})

