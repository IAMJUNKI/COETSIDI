

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


document.addEventListener('DOMContentLoaded', () => {

    const LeafIcon = L.Icon.extend({
        options: {
            iconUrl: './img/dot.png',
            iconSize:     [60, 60],
            // iconAnchor:   [22, 94],
            popupAnchor:  [0, 0]
        }
    });

    //defining the map 
    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 5
    });


    const nodosPlanta0=[
        //laboratorios
        { id: 'A015-L', latlng: [164.973038, 630.064453], name: 'Lab metalográfico y CNC' },
        { id: 'A012-L', latlng: [137.252833, 571.297852], name: 'Lab de motores' },
        { id: 'A008-L', latlng: [168.10913, 497.125977], name: 'Lab de medioambiente I' },
        { id: 'A007-L', latlng: [183.975154, 446.814453], name: 'Lab de fabricación mecánica' },
        { id: 'A006-L', latlng: [167.109018, 424.625977], name: 'Lab de medioambiente II' },
        { id: 'A005-L', latlng: [168.10913, 388.375977],  name: 'Lab de hidraúlica' },
        { id: 'A004-L', latlng: [167.913795, 322.817383],  name: 'Lab de ensayos destructivos - mecánica' },
        { id: 'A002-L', latlng: [167.913795, 292.567383],  name: 'Lab de mecánica de fluidos' },
        { id: 'Fablab', latlng: [176.66477, 274.067383],  name: 'Fablab' },
        { id: 'A022-L', latlng: [327.767531, 717.157227], name: 'Lab de automatización' },
        { id: 'A021-L1', latlng: [324.767197, 655.907227], name: 'Lab de electronica I' },
        { id: 'A021-L2', latlng: [323.767086, 603.407227], name: 'Lab de electronica II' },
        { id: 'A021-L3', latlng: [302.014664, 561.907227], name: 'Lab de electronica III' },
        { id: 'A024-L1', latlng: [353.301249, 663.447266], name: 'Lab de elasticidad y resistencia de materiales' },
        { id: 'A024-L2', latlng: [354.551388, 589.197266],  name: 'Lab de mecánica y teoría de mecanismos' },
        { id: 'A024-L3', latlng: [344.900137, 581.598633],  name: 'Lab de instalaciones industriales' },
        { id: 'A024-LP', latlng: [400.555786, 698.447266],  name: 'Lab polivalente' },
        { id: 'A029-L1', latlng: [468.183556, 676.530273],  name: 'Lab de química-física' },
        { id: 'A029-L2', latlng: [463.527641, 609.459961],  name: 'Lab de operaciones y reactores' },
        { id: 'A029-A', latlng: [481.529646, 534.959961],  name: 'cultura de procesos' },
        { id: 'A032-L1', latlng: [534.168442, 665.282227],  name: 'Lab medidas magnéticas I' },
        { id: 'A032-L2', latlng: [534.168442, 641.032227],  name: 'Lab medidas magnéticas II' },
        { id: 'A032-L3', latlng: [533.668386, 606.782227],  name: 'Lab maquinas eléctricas III' },
        { id: 'A032-L7', latlng: [547.919973, 598.032227],  name: 'Lab instalaciones eléctricas' },
        { id: 'A032-L6', latlng: [559.171226, 630.782227],  name: 'Lab centrales y subestaciones' },
        { id: 'A032-L5', latlng: [558.921198, 663.032227],  name: 'Lab protecciones eléctricas' },
        { id: 'A032-L4', latlng: [559.421254, 686.782227],  name: 'Lab proyectos eléctricos' },
        { id: 'A032-A1', latlng: [538.168888, 579.782227],  name: 'Aula Schneider' },

        //despachos
        { id: 'B037', latlng: [649.217768, 685.949219],  name: 'Despacho B 037' },
        { id: 'B036', latlng: [648.663183, 695.976563], name: 'Despacho B 036' },
        { id: 'B034', latlng: [577.17323, 709.032227],  name: 'Despacho B 034' },
        { id: 'B033', latlng: [555.920864, 709.032227],  name: 'Despacho B 033' },
        { id: 'A032', latlng: [533.668386, 687.282227],  name: 'Despacho A 032' },
        { id: 'A031', latlng: [528.167774, 713.532227], name: 'Despacho A 031' },
        { id: 'A030', latlng: [502.414907, 714.032227],  name: 'Despacho A 030' },
        { id: 'A029', latlng: [485.185449, 677.780273],  name: 'Despacho A 029' },
        { id: 'A028-3', latlng: [442.011697, 718.170898],  name: 'Despacho A 028-3' },
        { id: 'A028-2', latlng: [433.51075, 722.170898],  name: 'Despacho A 028-2' },
        { id: 'A028-1', latlng: [426.009915, 719.670898], name: 'Despacho A 028-1' },
        { id: 'A026', latlng: [398.756881, 714.420898],  name: 'Despacho A 026' },
        { id: 'A024', latlng: [435.366206, 696.335449],  name: 'Despacho A 024' },
        { id: 'A021', latlng: [329.517726, 545.407227],  name: 'Despacho A 021' },
        { id: 'A006', latlng: [167.109018, 464.125977],  name: 'Despacho A 006' },
        { id: 'A007', latlng: [184.313082, 394.488281], name: 'Despacho A 007' },
        { id: 'A002', latlng: [156.485454, 272.819336],  name: 'Despacho A 002' },

        //conectar luego solo acceso con ascensor desde le segundo piso
        { id: 'C001', latlng: [467.640017, 422.693359],  name: 'Despacho C 001' },
        { id: 'C002', latlng: [450.263082, 420.443359],  name: 'Despacho C 002' },
        { id: 'C003', latlng: [433.649904, 418.427734],  name: 'Despacho C 003' },
        { id: 'C004', latlng: [416.898039, 416.677734],  name: 'Despacho C 004' },
        { id: 'C005', latlng: [400.665763, 414.797852], name: 'Despacho C 005' },
        { id: 'C006', latlng: [384.079465, 412.095703],  name: 'Despacho C 006' },
        { id: 'C007', latlng: [366.827544, 412.345703],  name: 'Despacho C 007' },
        { id: 'C008', latlng: [350.325707, 409.595703],  name: 'Despacho C 008' },
        { id: 'C009', latlng: [330.073452, 403.845703], name: 'Despacho C 009' },

        //Aulas
        { id: 'A01', latlng: [183.475098, 611.064453],  name: 'A01' },
        { id: 'A02', latlng: [183.725126, 593.064453], name: 'A02' },
        { id: 'A03', latlng: [184.975265, 549.314453],  name: 'A03' },
        { id: 'A04', latlng: [184.725238, 499.564453],  name: 'A04' },
        { id: 'A05', latlng: [241.148512, 266.692383],  name: 'A05' },
        { id: 'A06', latlng: [241.39854, 241.692383], name: 'A06' },
        { id: 'A07', latlng: [253.149848, 264.692383],  name: 'A07' },
        { id: 'A08', latlng: [253.149848, 239.942383],  name: 'A08' },
        { id: 'B01', latlng: [653.594032, 651.610352],  name: 'B01' },
        { id: 'B02', latlng: [619.215204, 582.360352],  name: 'B02' },


        //Asociaciones
        { id: 'B042', latlng: [629.765128, 505.943359], name: 'Cuarto de Asociaciones' },
        { id: 'B041', latlng: [616.764237, 523.693359],  name: 'Club de montaña' },
        { id: 'A019', latlng: [251.47681, 697.844727],  name: 'Delegación de alumnos' },

        //Otros
        { id: 'hall_entrada', latlng: [185.681162, 705.977539],  name: 'Hall Entrada' },
        { id: 'pista_deportiva', latlng: [242.538079, 305.412109],  name: 'Pista Deportiva' },
        { id: 'enfermeria', latlng: [272.229121, 698.344727],  name: 'Enfermería' },
        { id: 'A025', latlng: [370.753763, 713.920898], name: 'Reprografía' },
        { id: 'A023', latlng: [345.519508, 714.157227],  name: 'Servicio de publicaciones' },

        //Nodos
        { id: 'nodo_A05_08_sur', latlng: [245.126972, 289.598633],  name: 'nodo A05-A08' },
        { id: 'nodo_final_pasillo_A_sur', latlng: [177.092246, 292.087158],  name: 'nodo final pasillo A Sur' },
        { id: 'nodo_medio_pasillo_A_sur', latlng: [175.667767, 466.422119], name: 'nodo medio pasillo A Sur' },
        { id: 'nodo_baño_pasillo_A_sur', latlng: [174.987233, 351.323242], name: 'nodo baño pasillo A Sur' },
        { id: 'nodo_pasillo_A_lab_motores_sur', latlng: [173.669676, 579.188477],  name: 'nodo pasillo A Lab Motores' },
        { id: 'nodo_principio_pasillo_A_sur', latlng: [175.376898, 659.699219],  name: 'nodo principio pasillo A' },
        { id: 'nodo_principio_pasillo_A_norte', latlng: [238.560579, 707.199219],  name: 'nodo principio pasillo A Norte' },
        { id: 'nodo_entrada_A021s_norte', latlng: [311.486668, 694.144531],  name: 'nodo entrada A 021s' },
        { id: 'nodo_medio_A021s_norte', latlng: [328.738588, 687.894531], name: 'nodo medio A 021s' },
        { id: 'nodo_final_A021s_norte', latlng: [329.7387, 570.644531],  name: 'nodo final A 021s' },
        { id: 'nodo_pasillo_A021s_norte', latlng: [311.23664, 705.144531],  name: 'nodo pasillo A 021s' },
        { id: 'nodo_first_half_pasillo_A_norte', latlng: [384.994852, 706.144531],  name: 'nodo first half pasillo A Norte' },
        { id: 'nodo_entrada_A024s_norte', latlng: [364.228109, 700.094727],  name: 'nodo entrada A 024s norte' },
        { id: 'nodo_entrada_A028s_norte', latlng: [434.366488, 706.710449],  name: 'nodo entrada A 028s norte' },
        { id: 'nodo_entrada_A029s_norte', latlng: [468.953507, 707.030273],  name: 'nodo entrada A 029s norte' },
        { id: 'nodo_second_half_pasillo_A_norte', latlng: [540.064148, 703.417969], name: 'nodo second half pasillo A Norte' },
        { id: 'nodo_entrada_A032s_norte', latlng: [541.844592, 690.052734],  name: 'nodo entrada A 032s norte' },
        { id: 'nodo_final_pasillo_A_norte', latlng: [635.764304, 701.970703],  name: 'nodo final pasillo A norte' },
        { id: 'nodo_principio_pasillo_B', latlng: [639.514722, 668.720703], name: 'nodo principio pasillo B' },
        { id: 'nodo_mitad_pasillo_B', latlng: [608.011214, 663.470703],  name: 'nodo mitad pasillo B' },
        { id: 'nodo_final_pasillo_B', latlng: [606.010992, 542.970703],  name: 'nodo final pasillo B' },
        { id: 'nodo_principio_pasillo_asociaciones', latlng: [620.689304, 537.648926],  name: 'nodo principio pasillo asocioaciones' },
        { id: 'nodo_final_pasillo_asociaciones', latlng: [616.43883, 500.273926],  name: 'nodo final pasillo asocioaciones' },
        { id: 'nodo_bloque_C_norte', latlng: [461.198437, 414.850586],  name: 'nodo escalera bloque C norte' },
        { id: 'nodo_bloque_C_sur', latlng: [376.716109, 405.686035],  name: 'nodo escalera bloque C sur' },

        //ascensores y/o escaleras
        { id: 'nodo_escalera_entrada', latlng: [109.046159, 667.949219],  name: 'nodo escalera entrada' },
        { id: 'nodo_escaleras_terraza', latlng: [235.483088, 655.929688], name: 'nodo escaleras terraza' },
        { id: 'nodo_escalera_principal', latlng: [245.386534, 735.491211],  name: 'nodo escalera principal' },
        { id: 'nodo_escalera_bloque_A', latlng: [475.454231, 727.530273],  name: 'nodo escalera bloque A' },
        { id: 'nodo_escalera_bloque_B', latlng: [680.519288, 669.970703],  name: 'nodo escalera bloque B' },
        { id: 'nodo_escalera_bloque_B_secundaria', latlng: [626.528845, 488.818359],  name: 'nodo escalera bloque B segundaria' },
        { id: 'nodo_escalera_bloque_C', latlng: [421.415429, 408.658203],  name: 'nodo escalera bloque C' },
        { id: 'nodo_escalera_cafeteria', latlng: [191.504623, 323.524414],  name: 'nodo escalera cafeteria' },
        
    ]


    const edgesPlanta0 = [
        { from: 'hall_entrada', to: 'nodo_principio_pasillo_A_sur', weight: getDistanceBetweenPoints('hall_entrada','nodo_principio_pasillo_A_sur', nodosPlanta0) },
        { from: 'hall_entrada', to: 'nodo_principio_pasillo_A_norte', weight:  getDistanceBetweenPoints('hall_entrada','nodo_principio_pasillo_A_norte', nodosPlanta0)  },
        { from: 'hall_entrada', to: 'nodo_escaleras_terraza', weight:  getDistanceBetweenPoints('hall_entrada','nodo_escaleras_terraza', nodosPlanta0) },
        { from: 'hall_entrada', to: 'nodo_escalera_principal', weight:  getDistanceBetweenPoints('hall_entrada','nodo_escalera_principal', nodosPlanta0)},
        { from: 'hall_entrada', to: 'nodo_escalera_entrada', weight:  getDistanceBetweenPoints('hall_entrada','nodo_escalera_entrada', nodosPlanta0) },

        { from: 'nodo_principio_pasillo_A_norte', to: 'nodo_principio_pasillo_A_sur', weight: getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','nodo_principio_pasillo_A_sur', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_A_norte', to: 'nodo_escaleras_terraza', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','nodo_escaleras_terraza', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_A_norte', to: 'nodo_escalera_principal', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','nodo_escalera_principal', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_A_norte', to: 'A019', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','A019', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_A_norte', to: 'enfermeria', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','enfermeria', nodosPlanta0) },
        
        { from: 'nodo_principio_pasillo_A_sur', to: 'A015-L', weight: getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','A015-L', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_A_sur', to: 'A01', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','A01', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_A_sur', to: 'A02', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','A02', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_A_sur', to: 'nodo_pasillo_A_lab_motores_sur', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','nodo_pasillo_A_lab_motores_sur', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_A_sur', to: 'nodo_escalera_entrada', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','nodo_escalera_entrada', nodosPlanta0)},
    
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A015-L', weight: getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A015-L', nodosPlanta0) },
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A01', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A01', nodosPlanta0) },
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A02', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A02', nodosPlanta0)},
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A012-L', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A012-L', nodosPlanta0)},
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A03', weight: getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A03', nodosPlanta0) },
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A04', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A04', nodosPlanta0) },
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A008-L', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A008-L', nodosPlanta0)},
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'nodo_medio_pasillo_A_sur', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','nodo_medio_pasillo_A_sur', nodosPlanta0)},
    
        { from: 'nodo_medio_pasillo_A_sur', to: 'A03', weight: getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A03', nodosPlanta0) },
        { from: 'nodo_medio_pasillo_A_sur', to: 'A04', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A04', nodosPlanta0) },
        { from: 'nodo_medio_pasillo_A_sur', to: 'A008-L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A008-L', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A006', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A006', nodosPlanta0) },
        { from: 'nodo_medio_pasillo_A_sur', to: 'A007-L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A007-L', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A006-L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A006-L', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A007', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A007', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A005-L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A005-L', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A006', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A006', nodosPlanta0) },
    
        { from: 'nodo_baño_pasillo_A_sur', to: 'A007-L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A007-L', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'A006-L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A006-L', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'A007', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A007', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'A005-L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A005-L', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'A004-L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A004-L', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'nodo_final_pasillo_A_sur', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','nodo_final_pasillo_A_sur', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'nodo_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','nodo_escalera_cafeteria', nodosPlanta0)},
        
        { from: 'nodo_final_pasillo_A_sur', to: 'nodo_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','nodo_escalera_cafeteria', nodosPlanta0)},
        { from: 'nodo_final_pasillo_A_sur', to: 'A004-L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','A004-L', nodosPlanta0)},
        { from: 'nodo_final_pasillo_A_sur', to: 'A002-L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','A002-L', nodosPlanta0)},
        { from: 'nodo_final_pasillo_A_sur', to: 'Fablab', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','Fablab', nodosPlanta0)},
        { from: 'nodo_final_pasillo_A_sur', to: 'nodo_A05_08_sur', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','nodo_A05_08_sur', nodosPlanta0)},
        
        { from: 'A002', to: 'A002-L', weight:  getDistanceBetweenPoints('A002','A002-L', nodosPlanta0)},

        { from: 'nodo_A05_08_sur', to: 'pista_deportiva', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','pista_deportiva', nodosPlanta0)},
        { from: 'nodo_A05_08_sur', to: 'A05', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A05', nodosPlanta0)},
        { from: 'nodo_A05_08_sur', to: 'A06', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A06', nodosPlanta0)},
        { from: 'nodo_A05_08_sur', to: 'A07', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A07', nodosPlanta0)},
        { from: 'nodo_A05_08_sur', to: 'A08', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A08', nodosPlanta0)},

        { from: 'nodo_pasillo_A021s_norte', to: 'nodo_principio_pasillo_A_norte', weight: getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_principio_pasillo_A_norte', nodosPlanta0) },
        { from: 'nodo_pasillo_A021s_norte', to: 'enfermeria', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','enfermeria', nodosPlanta0) },
        { from: 'nodo_pasillo_A021s_norte', to: 'A019', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A019', nodosPlanta0)},
        { from: 'nodo_pasillo_A021s_norte', to: 'nodo_entrada_A021s_norte', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_entrada_A021s_norte', nodosPlanta0) },
        { from: 'nodo_pasillo_A021s_norte', to: 'A022-L', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A022-L', nodosPlanta0)},
        { from: 'nodo_pasillo_A021s_norte', to: 'A023', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A023', nodosPlanta0)},
        { from: 'nodo_pasillo_A021s_norte', to: 'A025', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A025', nodosPlanta0)},
        { from: 'nodo_pasillo_A021s_norte', to: 'nodo_entrada_A024s_norte', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_entrada_A024s_norte', nodosPlanta0) },
        { from: 'nodo_pasillo_A021s_norte', to: 'nodo_first_half_pasillo_A_norte', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_first_half_pasillo_A_norte', nodosPlanta0)},
    
        { from: 'nodo_entrada_A021s_norte', to: 'nodo_medio_A021s_norte', weight: getDistanceBetweenPoints('nodo_entrada_A021s_norte','nodo_medio_A021s_norte', nodosPlanta0) },

        { from: 'nodo_medio_A021s_norte', to: 'A021-L1', weight:  getDistanceBetweenPoints('nodo_medio_A021s_norte','A021-L1', nodosPlanta0) },
        { from: 'nodo_medio_A021s_norte', to: 'A021-L2', weight:  getDistanceBetweenPoints('nodo_medio_A021s_norte','A021-L2', nodosPlanta0)},
        { from: 'nodo_medio_A021s_norte', to: 'nodo_final_A021s_norte', weight:  getDistanceBetweenPoints('nodo_medio_A021s_norte','nodo_final_A021s_norte', nodosPlanta0)},

        { from: 'nodo_final_A021s_norte', to: 'A021', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021', nodosPlanta0)},
        { from: 'nodo_final_A021s_norte', to: 'A021-L3', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021-L3', nodosPlanta0)},
        { from: 'nodo_final_A021s_norte', to: 'A021-L1', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021-L1', nodosPlanta0) },
        { from: 'nodo_final_A021s_norte', to: 'A021-L2', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021-L2', nodosPlanta0)},
    
        { from: 'nodo_entrada_A024s_norte', to: 'A024-L1', weight:  getDistanceBetweenPoints('nodo_entrada_A024s_norte','A024-L1', nodosPlanta0)},
        { from: 'nodo_entrada_A024s_norte', to: 'A024-L2', weight:  getDistanceBetweenPoints('nodo_entrada_A024s_norte','A024-L2', nodosPlanta0)},
        { from: 'nodo_entrada_A024s_norte', to: 'A024-L3', weight:  getDistanceBetweenPoints('nodo_entrada_A024s_norte','A024-L3', nodosPlanta0) },
        
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A022-L', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A022-L', nodosPlanta0)},
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A023', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A023', nodosPlanta0)},
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A025', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A025', nodosPlanta0)},
        { from: 'nodo_first_half_pasillo_A_norte', to: 'nodo_entrada_A024s_norte', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','nodo_entrada_A024s_norte', nodosPlanta0) },
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A024-LP', weight: getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A024-LP', nodosPlanta0) },
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A026', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A026', nodosPlanta0) },
        { from: 'nodo_first_half_pasillo_A_norte', to: 'nodo_entrada_A028s_norte', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','nodo_entrada_A028s_norte', nodosPlanta0)},
    
        { from: 'nodo_entrada_A028s_norte', to: 'A024', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A024', nodosPlanta0)},
        { from: 'nodo_entrada_A028s_norte', to: 'A028-1', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A028-1', nodosPlanta0) },
        { from: 'nodo_entrada_A028s_norte', to: 'A028-2', weight: getDistanceBetweenPoints('nodo_entrada_A028s_norte','A028-2', nodosPlanta0) },
        { from: 'nodo_entrada_A028s_norte', to: 'A028-3', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A028-3', nodosPlanta0) },
        { from: 'nodo_entrada_A028s_norte', to: 'nodo_entrada_A029s_norte', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','nodo_entrada_A029s_norte', nodosPlanta0)},
        { from: 'nodo_entrada_A028s_norte', to: 'A024-LP', weight: getDistanceBetweenPoints('nodo_entrada_A028s_norte','A024-LP', nodosPlanta0) },
        { from: 'nodo_entrada_A028s_norte', to: 'A026', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A026', nodosPlanta0) },
        
        { from: 'nodo_entrada_A029s_norte', to: 'A029-L1', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','A029-L1', nodosPlanta0)},
        { from: 'nodo_entrada_A029s_norte', to: 'nodo_escalera_bloque_A', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','nodo_escalera_bloque_A', nodosPlanta0) },
        { from: 'nodo_entrada_A029s_norte', to: 'A030', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','A030', nodosPlanta0)},
        { from: 'nodo_entrada_A029s_norte', to: 'A031', weight: getDistanceBetweenPoints('nodo_entrada_A029s_norte','A031', nodosPlanta0) },
        { from: 'nodo_entrada_A029s_norte', to: 'nodo_second_half_pasillo_A_norte', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','nodo_second_half_pasillo_A_norte', nodosPlanta0) },
        
        { from: 'A029-L1', to: 'A029', weight:  getDistanceBetweenPoints('A029-L1','A029', nodosPlanta0)},
        { from: 'A029-L1', to: 'A029-L2', weight:  getDistanceBetweenPoints('A029-L1','A029-L2', nodosPlanta0) },
        { from: 'A029-L1', to: 'A029-A', weight:  getDistanceBetweenPoints('A029-L1','A029-A', nodosPlanta0)},
    
        { from: 'nodo_second_half_pasillo_A_norte', to: 'A030', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','A030', nodosPlanta0)},
        { from: 'nodo_second_half_pasillo_A_norte', to: 'A031', weight: getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','A031', nodosPlanta0) },
        { from: 'nodo_second_half_pasillo_A_norte', to: 'nodo_entrada_A032s_norte', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','nodo_entrada_A032s_norte', nodosPlanta0)},
        { from: 'nodo_second_half_pasillo_A_norte', to: 'B033', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','B033', nodosPlanta0) },
        { from: 'nodo_second_half_pasillo_A_norte', to: 'B034', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','B034', nodosPlanta0) },
        { from: 'nodo_second_half_pasillo_A_norte', to: 'nodo_final_pasillo_A_norte', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','nodo_final_pasillo_A_norte', nodosPlanta0) },
        
        { from: 'nodo_entrada_A032s_norte', to: 'A032', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032', nodosPlanta0)},
        { from: 'nodo_entrada_A032s_norte', to: 'A032-L1', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032-L1', nodosPlanta0)},
        { from: 'nodo_entrada_A032s_norte', to: 'A032-L2', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032-L2', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032-L3', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032-L3', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032-L4', weight: getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032-L4', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032-L5', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032-L5', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032-L6', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032-L6', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032-L7', weight: getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032-L7', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032-A1', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032-A1', nodosPlanta0) },

        { from: 'nodo_final_pasillo_A_norte', to: 'B033', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B033', nodosPlanta0) },
        { from: 'nodo_final_pasillo_A_norte', to: 'B034', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B034', nodosPlanta0) },
        { from: 'nodo_final_pasillo_A_norte', to: 'B036', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B036', nodosPlanta0)},
        { from: 'nodo_final_pasillo_A_norte', to: 'B037', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B037', nodosPlanta0) },
        { from: 'nodo_final_pasillo_A_norte', to: 'nodo_principio_pasillo_B', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','nodo_principio_pasillo_B', nodosPlanta0)},

        { from: 'nodo_principio_pasillo_B', to: 'B036', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','B036', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_B', to: 'B037', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B','B037', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_B', to: 'B01', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','B01', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_B', to: 'nodo_escalera_bloque_B', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','nodo_escalera_bloque_B', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_B', to: 'nodo_mitad_pasillo_B', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B','nodo_mitad_pasillo_B', nodosPlanta0) },
    
        { from: 'nodo_mitad_pasillo_B', to: 'B02', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_B','B02', nodosPlanta0)},
        { from: 'nodo_mitad_pasillo_B', to: 'nodo_final_pasillo_B', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_B','nodo_final_pasillo_B', nodosPlanta0)},
    
        { from: 'nodo_final_pasillo_B', to: 'B02', weight:  getDistanceBetweenPoints('nodo_final_pasillo_B','B02', nodosPlanta0)},
        { from: 'nodo_final_pasillo_B', to: 'nodo_principio_pasillo_asociaciones', weight:  getDistanceBetweenPoints('nodo_final_pasillo_B','nodo_principio_pasillo_asociaciones', nodosPlanta0)},
    
        { from: 'nodo_principio_pasillo_asociaciones', to: 'B042', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_asociaciones','B042', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_asociaciones', to: 'B041', weight: getDistanceBetweenPoints('nodo_principio_pasillo_asociaciones','B041', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_asociaciones', to: 'nodo_final_pasillo_asociaciones', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_asociaciones','nodo_final_pasillo_asociaciones', nodosPlanta0)},
    
        { from: 'nodo_final_pasillo_asociaciones', to: 'B042', weight:  getDistanceBetweenPoints('nodo_final_pasillo_asociaciones','B042', nodosPlanta0)},
        { from: 'nodo_final_pasillo_asociaciones', to: 'B041', weight: getDistanceBetweenPoints('nodo_final_pasillo_asociaciones','B041', nodosPlanta0) },
        { from: 'nodo_final_pasillo_asociaciones', to: 'nodo_escalera_bloque_B_secundaria', weight:  getDistanceBetweenPoints('nodo_final_pasillo_asociaciones','nodo_escalera_bloque_B_secundaria', nodosPlanta0)},

        { from: 'nodo_escalera_bloque_C', to: 'nodo_bloque_C_norte', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','nodo_bloque_C_norte', nodosPlanta0)},
        { from: 'nodo_escalera_bloque_C', to: 'C002', weight: getDistanceBetweenPoints('nodo_escalera_bloque_C','C002', nodosPlanta0) },
        { from: 'nodo_escalera_bloque_C', to: 'C003', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','C003', nodosPlanta0)},
        { from: 'nodo_escalera_bloque_C', to: 'C004', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','C004', nodosPlanta0)},
        { from: 'nodo_escalera_bloque_C', to: 'C005', weight: getDistanceBetweenPoints('nodo_escalera_bloque_C','C005', nodosPlanta0) },
        { from: 'nodo_escalera_bloque_C', to: 'C006', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','C006', nodosPlanta0)},
        { from: 'nodo_escalera_bloque_C', to: 'nodo_bloque_C_sur', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C','nodo_bloque_C_sur', nodosPlanta0)},
    
        { from: 'nodo_bloque_C_sur', to: 'C006', weight: getDistanceBetweenPoints('nodo_bloque_C_sur','C006', nodosPlanta0) },
        { from: 'nodo_bloque_C_sur', to: 'C007', weight:  getDistanceBetweenPoints('nodo_bloque_C_sur','C007', nodosPlanta0)},
    
        { from: 'C007', to: 'C008', weight:  getDistanceBetweenPoints('C007','C008', nodosPlanta0)},
    
        { from: 'C008', to: 'C009', weight: getDistanceBetweenPoints('C008','C009', nodosPlanta0) },

        { from: 'nodo_bloque_C_norte', to: 'C001', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte','C001', nodosPlanta0)},
        { from: 'nodo_bloque_C_norte', to: 'C002', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte','C002', nodosPlanta0)},   
    ]

const todasLasPlantas = {}
todasLasPlantas.planta0 = {}
todasLasPlantas.planta0.nodes = nodosPlanta0
todasLasPlantas.planta0.edges = edgesPlanta0




const nodosPlanta1=[
    //laboratorios
    { id: 'A139-L1', latlng: [519.943627, 591.736328], name: 'Lab de medidas eléctricas I' },
    { id: 'A139-L2', latlng: [516.235802, 602.934082], name: 'Lab de medidas eléctricas II' },
    { id: 'A108-L', latlng: [167.943295, 455.095703], name: 'Lab de análisis químico I' },
    { id: 'A110-L', latlng: [168.10913, 497.125977], name: 'Lab de análisis químico II' },
    { id: 'A112-L', latlng: [168.193323, 555.095703], name: 'Lab de análisis químico III' },
    { id: 'A134-L', latlng: [434.179202, 560.444336],  name: 'Lab de informática industrial' },
    { id: 'A133-L', latlng: [428.928617, 585.444336],  name: 'Lab de automatización II' },
    { id: 'A132-L', latlng: [428.428561, 629.694336],  name: 'Lab de automatización III' },
    { id: 'A130-L', latlng: [428.928617, 670.944336],  name: 'Lab de regulación automática' },

    //despachos
    { id: 'A140', latlng: [530.786205, 713.844238], name: 'Despacho A 140' },
    { id: 'A139', latlng: [519.534953, 686.983398],  name: 'Despacho A 139' },
    { id: 'A138', latlng: [517.704865, 711.609619],  name: 'Despacho A 138' },
    { id: 'A137', latlng: [501.140521, 711.797119],  name: 'Despacho A 137' },
    { id: 'oficina_internacional', latlng: [651.42291, 696.436035],  name: 'Oficina Internacional' },
    { id: 'B149', latlng: [669.466776, 499.614746], name: 'Despacho B 149' },
    { id: 'B150', latlng: [642.088727, 507.364746],  name: 'Despacho B 150' },
    { id: 'proyecto_mentor', latlng: [409.638454, 712.022949],  name: 'Despacho Proyecto Mentor' },
    { id: 'A129', latlng: [394.818329, 712.136475],  name: 'Despacho A 129' },
    { id: 'A128', latlng: [377.884803, 711.979736],  name: 'Despacho A 128' },
    { id: 'A127', latlng: [360.88291, 712.167236], name: 'Despacho A 127' },
    { id: 'A126', latlng: [345.974512, 711.861328],  name: 'Despacho A 126' },
    { id: 'A125', latlng: [328.777285, 711.959229],  name: 'Despacho A 125' },
    { id: 'A124', latlng: [310.621926, 571.84375], name: 'Despacho A 124' },
    { id: 'A123', latlng: [312.900517, 711.896729],  name: 'Despacho A 123' },
    { id: 'A122', latlng: [296.071739, 711.7146],  name: 'Despacho A 122' },
    { id: 'gestion_economica', latlng: [251.47681, 697.844727],  name: 'Gestión Económica' },
    { id: 'A120', latlng: [146.946392, 743.230469],  name: 'Secretaría y Registro' },
    { id: 'A118', latlng: [148.088261, 714.113281], name: 'Despacho A 118' },
    { id: 'A117', latlng: [147.963247, 665.863281],  name: 'Conserjería' },
    { id: 'direccion', latlng: [147.963247, 684.863281],  name: 'Dirección' },
    { id: 'A115', latlng: [144.027304, 628.400635],  name: 'Despacho A 115' },
    { id: 'A114', latlng: [183.475098, 611.064453], name: 'Administración' },

    //conectar luego solo acceso con ascensor desde le segundo piso
    { id: 'C101', latlng: [467.640017, 422.693359],  name: 'Despacho C 101' },
    { id: 'C102', latlng: [450.263082, 420.443359],  name: 'Despacho C 102' },
    { id: 'C103', latlng: [433.649904, 418.427734],  name: 'Despacho C 103' },
    { id: 'C104', latlng: [416.898039, 416.677734],  name: 'Despacho C 104' },
    { id: 'C105', latlng: [400.665763, 414.797852], name: 'Despacho C 105' },
    { id: 'C106', latlng: [384.079465, 412.095703],  name: 'Despacho C 106' },
    { id: 'C107', latlng: [366.827544, 412.345703],  name: 'Despacho C 107' },
    { id: 'C108', latlng: [345.044598, 412.69751],  name: 'Despacho C 108' },
    { id: 'C109', latlng: [325.979975, 401.44751], name: 'Despacho C 109' },

    // //Aulas
    { id: 'A11', latlng: [182.136402, 593.37793],  name: 'A11' },
    { id: 'A12', latlng: [182.136402, 545.87793], name: 'A12' },
    { id: 'A13', latlng: [182.136402, 493.12793],  name: 'A13' },
    { id: 'A14', latlng: [182.636458, 443.87793],  name: 'A14' },
    { id: 'A15', latlng: [167.634788, 428.62793],  name: 'A15' },
    { id: 'A16', latlng: [167.38476, 383.12793], name: 'A16' },
    { id: 'A17', latlng: [167.634788, 346.12793],  name: 'A17' },
    { id: 'A124-S1', latlng: [308.355603, 606.788818],  name: 'Sala de ordenadores' },
    { id: 'B11', latlng: [667.113303, 643.226318],  name: 'B11' },
    { id: 'B12', latlng: [678.051158, 562.976318],  name: 'B12' },

    // //Otros
    { id: 'cafeteria', latlng: [176.169565, 304.838867],  name: 'Cafetería' },
    { id: 'comedor', latlng: [200.672293, 280.338867],  name: 'Comedor' },

    // //Nodos
    { id: 'nodo_principio_pasillo_A_sur_piso1', latlng: [175.574517, 661.754883],  name: 'nodo principio pasillo A Sur piso 1' },
    { id: 'nodo_principio_pasillo_A_norte_piso1', latlng: [236.134868, 703.31311],  name: 'nodo principio pasillo A Norte piso 1' },
    { id: 'nodo_conserjeria', latlng: [157.784043, 667.127441],  name: 'nodo conserjeria' },
    { id: 'nodo_direccion', latlng: [157.283987, 697.627441], name: 'nodo direccion' },
    { id: 'nodo_secretaria', latlng: [157.602577, 742.78186],  name: 'nodo secretaria' },
    { id: 'nodo_entrada_escaleras_terraza_piso1', latlng: [234.9578, 665.563721],  name: 'nodo entrada escaleras terraza piso 1' },
    { id: 'nodo_entrada_escalera_principal_piso1', latlng: [232.828581, 741.504883],  name: 'nodo entrada escalera principal piso 1' },
    { id: 'nodo_entrada_despachos_A115', latlng: [174.574406, 629.004883],  name: 'nodo entrada despachos A 115' },
    { id: 'nodo_entrada_escalera_secundaria_piso1', latlng: [650.992433, 487.772461],  name: 'nodo entrada escalera secundaria piso 1 ' },
    { id: 'nodo_entrada_despacho_B150', latlng: [653.242683, 507.272461],  name: 'nodo entrada despacho B150' },
    { id: 'nodo_entrada_despacho_B149', latlng: [681.745857, 510.022461], name: 'nodo entrada despacho B149' },
    { id: 'nodo_pasillo_B11_B12', latlng: [684.496163, 648.272461], name: 'nodo pasillo B11 B12' },
    { id: 'nodo_B11_aseos', latlng: [639.057313, 649.706055],  name: 'nodo B11 aseos' },
    { id: 'nodo_salida_escalera_bloque_B_piso1', latlng: [639.807396, 668.706055],  name: 'nodo salida escalera bloque B piso 1' },
    { id: 'nodo_principio_pasillo_B_piso1', latlng: [628.056088, 704.956055],  name: 'nodo pricnipio pasillo B piso 1' },
    { id: 'nodo_final_pasillo_A_norte_piso1', latlng: [534.823197, 703.054688], name: 'nodo final pasillo A Norte piso 1' },
    { id: 'nodo_entrada_A139s_norte', latlng: [518.32136, 702.804688],  name: 'nodo entrada A 139s norte' },
    { id: 'nodo_entrada_escalera_bloque_A_norte_piso1', latlng: [473.956068, 706.341797],  name: 'nodo entrada escalera bloque A norte piso 1' },
    { id: 'nodo_entrada_A130_134_piso1', latlng: [432.539696, 702.484863], name: 'nodo entrada A 130 A134 piso 1' },
    { id: 'nodo_medio_A130_134_piso1', latlng: [434.268492, 632.015381], name: 'nodo medio A 130 A134 piso 1' },
    { id: 'nodo_mitad_pasillo_A_norte_piso1', latlng: [369.440362, 702.948242],  name: 'nodo mitad pasillo A norte piso 1' },
    { id: 'nodo_entrada_A124s_norte', latlng: [311.431323, 700.362305],  name: 'nodo entrada A 124s norte' },
    { id: 'nodo_entrada_escalera_cafeteria_piso1', latlng: [174.64432, 330.657227],  name: 'nodo entrada escalera cafeteria piso 1' },
    { id: 'nodo_final_pasillo_A_sur_piso1', latlng: [174.64725, 415.760742],  name: 'nodo final pasillo A sur piso 1' },
    { id: 'nodo_mitad_pasillo_A_sur_piso1', latlng: [175.647361, 524.260742],  name: 'nodo mitad pasillo A sur piso 1' },
    { id: 'nodo_bloque_C_norte_piso1', latlng: [459.067726, 416.692871],  name: 'nodo bloque C norte piso 1' },
    { id: 'nodo_bloque_C_sur_piso1', latlng: [372.434056, 407.979492],  name: 'nodo bloque C sur piso 1' },

    // //ascensores y/o escaleras
    { id: 'nodo_escaleras_terraza_piso1', latlng: [235.829556, 644.754883], name: 'nodo escaleras terraza piso 1' },
    { id: 'nodo_escalera_principal_piso1', latlng: [253.83156, 733.754883],  name: 'nodo escalera principal piso 1' },
    { id: 'nodo_escalera_bloque_A_piso1', latlng: [474.706152, 731.591797],  name: 'nodo escalera bloque A piso 1' },
    { id: 'nodo_escalera_bloque_B_piso1', latlng: [678.451463, 667.831055],  name: 'nodo escalera bloque B piso 1' },
    { id: 'nodo_escalera_bloque_B_secundaria_piso1', latlng: [627.989871, 487.772461],  name: 'nodo escalera bloque B secundaria piso 1' },
    { id: 'nodo_escalera_bloque_C_piso1', latlng: [410.56483, 408.817871],  name: 'nodo escalera bloque C piso 1' },
    { id: 'nodo_escalera_cafeteria_piso1', latlng: [200.14716, 323.157227],  name: 'nodo escalera cafeteria piso 1' },
    
]
 


const edgesPlanta1 = [
    { from: 'nodo_escalera_bloque_B_secundaria_piso1', to: 'nodo_entrada_escalera_secundaria_piso1', weight: getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_piso1','nodo_entrada_escalera_secundaria_piso1', nodosPlanta1) },

    { from: 'nodo_entrada_despacho_B150', to: 'nodo_entrada_escalera_secundaria_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','nodo_entrada_escalera_secundaria_piso1', nodosPlanta1)  },
    { from: 'nodo_entrada_despacho_B150', to: 'B150', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','B150', nodosPlanta1) },
    { from: 'nodo_entrada_despacho_B150', to: 'B149', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','B149', nodosPlanta1)},
    { from: 'nodo_entrada_despacho_B150', to: 'nodo_entrada_despacho_B149', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','nodo_entrada_despacho_B149', nodosPlanta1) },

    { from: 'nodo_entrada_despacho_B149', to: 'B149', weight: getDistanceBetweenPoints('nodo_entrada_despacho_B149','B149', nodosPlanta1) },
    { from: 'nodo_entrada_despacho_B149', to: 'B12', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B149','B12', nodosPlanta1) },
    { from: 'nodo_entrada_despacho_B149', to: 'nodo_pasillo_B11_B12', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B149','nodo_pasillo_B11_B12', nodosPlanta1)},
    
    { from: 'nodo_pasillo_B11_B12', to: 'B12', weight:  getDistanceBetweenPoints('nodo_pasillo_B11_B12','B12', nodosPlanta1)},
    { from: 'nodo_pasillo_B11_B12', to: 'B11', weight:  getDistanceBetweenPoints('nodo_pasillo_B11_B12','B11', nodosPlanta1) },
    { from: 'nodo_pasillo_B11_B12', to: 'nodo_B11_aseos', weight:  getDistanceBetweenPoints('nodo_pasillo_B11_B12','nodo_B11_aseos', nodosPlanta1) },
    
    { from: 'nodo_B11_aseos', to: 'B11', weight: getDistanceBetweenPoints('nodo_B11_aseos','B11', nodosPlanta1) },
    { from: 'nodo_B11_aseos', to: 'nodo_salida_escalera_bloque_B_piso1', weight:  getDistanceBetweenPoints('nodo_B11_aseos','nodo_salida_escalera_bloque_B_piso1', nodosPlanta1) },

    { from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_escalera_bloque_B_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_escalera_bloque_B_piso1', nodosPlanta1)},
    { from: 'nodo_salida_escalera_bloque_B_piso1', to: 'oficina_internacional', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','oficina_internacional', nodosPlanta1)},
    { from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_principio_pasillo_B_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_principio_pasillo_B_piso1', nodosPlanta1)},

    { from: 'nodo_principio_pasillo_B_piso1', to: 'oficina_internacional', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B_piso1','oficina_internacional', nodosPlanta1) },
    { from: 'nodo_principio_pasillo_B_piso1', to: 'nodo_final_pasillo_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B_piso1','nodo_final_pasillo_A_norte_piso1', nodosPlanta1) },

    { from: 'nodo_final_pasillo_A_norte_piso1', to: 'A140', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso1','A140', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_norte_piso1', to: 'nodo_entrada_A139s_norte', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso1','nodo_entrada_A139s_norte', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_norte_piso1', to: 'A138', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso1','A138', nodosPlanta1) },
    
    { from: 'nodo_entrada_A139s_norte', to: 'A140', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A140', nodosPlanta1) },
    { from: 'nodo_entrada_A139s_norte', to: 'A138', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A138', nodosPlanta1)},
    { from: 'nodo_entrada_A139s_norte', to: 'A139', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A139', nodosPlanta1)},
    { from: 'nodo_entrada_A139s_norte', to: 'A137', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A137', nodosPlanta1)},
    { from: 'nodo_entrada_A139s_norte', to: 'nodo_entrada_escalera_bloque_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','nodo_entrada_escalera_bloque_A_norte_piso1', nodosPlanta1)},

    { from: 'A139', to: 'A139-L1', weight: getDistanceBetweenPoints('A139','A139-L1', nodosPlanta1) },
    { from: 'A139', to: 'A139-L2', weight:  getDistanceBetweenPoints('A139','A139-L2', nodosPlanta1) },
    { from: 'A139-L1', to: 'A139-L2', weight:  getDistanceBetweenPoints('A139-L1','A139-L2', nodosPlanta1)},

    { from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_escalera_bloque_A_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_escalera_bloque_A_piso1', nodosPlanta1) },
    { from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_entrada_A130_134_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_entrada_A130_134_piso1', nodosPlanta1)},

    { from: 'nodo_entrada_A130_134_piso1', to: 'nodo_medio_A130_134_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','nodo_medio_A130_134_piso1', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A130-L', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A130-L', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A130-L', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A130-L', nodosPlanta1)},


    { from: 'nodo_medio_A130_134_piso1', to: 'A132-L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A132-L', nodosPlanta1)},
    { from: 'nodo_medio_A130_134_piso1', to: 'A133-L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A133-L', nodosPlanta1) },
    { from: 'nodo_medio_A130_134_piso1', to: 'A134-L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A134-L', nodosPlanta1)},
    { from: 'nodo_medio_A130_134_piso1', to: 'A137', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A137', nodosPlanta1)},

    { from: 'nodo_entrada_A130_134_piso1', to: 'proyecto_mentor', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','proyecto_mentor', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A129', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A129', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A128', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A128', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'nodo_mitad_pasillo_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','nodo_mitad_pasillo_A_norte_piso1', nodosPlanta1)},

    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'proyecto_mentor', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','proyecto_mentor', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A129', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A129', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A128', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A128', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A127', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A127', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A126', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A126', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A125', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A125', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A123', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A123', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'nodo_entrada_A124s_norte', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','nodo_entrada_A124s_norte', nodosPlanta1)},
    
    { from: 'A124-S1', to: 'A124', weight:  getDistanceBetweenPoints('A124-S1','A124', nodosPlanta1)},
    
    { from: 'nodo_entrada_A124s_norte', to: 'A124-S1', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A124-S1', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A124', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A124', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A127', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A127', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A126', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A126', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A125', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A125', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A123', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A123', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A122', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A122', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'gestion_economica', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','gestion_economica', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'nodo_principio_pasillo_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','nodo_principio_pasillo_A_norte_piso1', nodosPlanta1)},

    { from: 'nodo_principio_pasillo_A_norte_piso1', to: 'gestion_economica', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','gestion_economica', nodosPlanta1)},
    { from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_entrada_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_entrada_escalera_principal_piso1', nodosPlanta1)},
    { from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_entrada_escaleras_terraza_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_entrada_escaleras_terraza_piso1', nodosPlanta1)},
    { from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_escalera_principal_piso1', nodosPlanta1)},

    { from: 'nodo_entrada_escaleras_terraza_piso1', to: 'nodo_escaleras_terraza_piso1', weight: getDistanceBetweenPoints('nodo_entrada_escaleras_terraza_piso1','nodo_escaleras_terraza_piso1', nodosPlanta1) },
    { from: 'nodo_entrada_escaleras_terraza_piso1', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escaleras_terraza_piso1','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1) },

    { from: 'nodo_entrada_escalera_principal_piso1', to: 'nodo_secretaria', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso1','nodo_secretaria', nodosPlanta1)},
    { from: 'nodo_entrada_escalera_principal_piso1', to: 'nodo_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso1','nodo_escalera_principal_piso1', nodosPlanta1)},


    { from: 'nodo_secretaria', to: 'A120', weight:  getDistanceBetweenPoints('nodo_secretaria','A120', nodosPlanta1) },
    { from: 'nodo_secretaria', to: 'A118', weight:  getDistanceBetweenPoints('nodo_secretaria','A118', nodosPlanta1)},
    { from: 'nodo_secretaria', to: 'nodo_direccion', weight:  getDistanceBetweenPoints('nodo_secretaria','nodo_direccion', nodosPlanta1)},

    { from: 'nodo_direccion', to: 'A118', weight:  getDistanceBetweenPoints('nodo_direccion','A118', nodosPlanta1)},
    { from: 'nodo_direccion', to: 'direccion', weight:  getDistanceBetweenPoints('nodo_direccion','direccion', nodosPlanta1) },
    { from: 'nodo_direccion', to: 'nodo_conserjeria', weight:  getDistanceBetweenPoints('nodo_direccion','nodo_conserjeria', nodosPlanta1)},
    { from: 'nodo_direccion', to: 'A117', weight:  getDistanceBetweenPoints('nodo_direccion','A117', nodosPlanta1)},

    { from: 'nodo_conserjeria', to: 'direccion', weight:  getDistanceBetweenPoints('nodo_conserjeria','direccion', nodosPlanta1) },
    { from: 'nodo_conserjeria', to: 'A117', weight:  getDistanceBetweenPoints('nodo_conserjeria','A117', nodosPlanta1)},
    { from: 'nodo_conserjeria', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_conserjeria','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1)},

    { from: 'nodo_entrada_despachos_A115', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'A115', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A115', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'A114', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A114', nodosPlanta1) },
    { from: 'nodo_entrada_despachos_A115', to: 'A11', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A11', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'A112-L', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A112-L', nodosPlanta1) },
    { from: 'nodo_entrada_despachos_A115', to: 'A12', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A12', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'nodo_mitad_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','nodo_mitad_pasillo_A_sur_piso1', nodosPlanta1)},

    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A114', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A114', nodosPlanta1) },
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A11', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A11', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A112-L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A112-L', nodosPlanta1) },
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A12', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A12', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A13', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A13', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A110-L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A110-L', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A108-L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A108-L', nodosPlanta1) },
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A14', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A14', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A15', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A15', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'nodo_final_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','nodo_final_pasillo_A_sur_piso1', nodosPlanta1)},

    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A13', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A13', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A110-L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A110-L', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A108-L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A108-L', nodosPlanta1) },
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A14', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A14', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A15', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A15', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A16', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A16', nodosPlanta1) },
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A17', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A17', nodosPlanta1) },
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'nodo_entrada_escalera_cafeteria_piso1', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','nodo_entrada_escalera_cafeteria_piso1', nodosPlanta1) },
  
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'A16', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','A16', nodosPlanta1)},
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'A17', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','A17', nodosPlanta1) },
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'nodo_escalera_cafeteria_piso1', weight: getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','nodo_escalera_cafeteria_piso1', nodosPlanta1) },
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'cafeteria', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','cafeteria', nodosPlanta1) },

    { from: 'cafeteria', to: 'comedor', weight:  getDistanceBetweenPoints('cafeteria','comedor', nodosPlanta1)},
    { from: 'cafeteria', to: 'nodo_escalera_cafeteria_piso1', weight: getDistanceBetweenPoints('cafeteria','nodo_escalera_cafeteria_piso1', nodosPlanta1) }, 
   
    { from: 'nodo_escalera_bloque_C_piso1', to: 'nodo_bloque_C_norte_piso1', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','nodo_bloque_C_norte_piso1', nodosPlanta1)},
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C102', weight: getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C102', nodosPlanta1) },
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C103', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C103', nodosPlanta1)},
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C104', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C104', nodosPlanta1)},
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C105', weight: getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C105', nodosPlanta1) },
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C106', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C106', nodosPlanta1)},
    { from: 'nodo_escalera_bloque_C_piso1', to: 'nodo_bloque_C_sur_piso1', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','nodo_bloque_C_sur_piso1', nodosPlanta1)},

    { from: 'nodo_bloque_C_sur_piso1', to: 'C106', weight: getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C106', nodosPlanta1) },
    { from: 'nodo_bloque_C_sur_piso1', to: 'C107', weight:  getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C107', nodosPlanta1)},

    { from: 'C107', to: 'C108', weight:  getDistanceBetweenPoints('C107','C108', nodosPlanta1)},

    { from: 'C108', to: 'C109', weight: getDistanceBetweenPoints('C108','C109', nodosPlanta1) },

    { from: 'nodo_bloque_C_norte_piso1', to: 'C101', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte_piso1','C101', nodosPlanta1)},
    { from: 'nodo_bloque_C_norte_piso1', to: 'C102', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte_piso1','C102', nodosPlanta1)},   
]



todasLasPlantas.planta1 = {}
todasLasPlantas.planta1.nodes = nodosPlanta1
todasLasPlantas.planta1.edges = edgesPlanta1



const nodosPlanta2=[
    //laboratorios
    { id: 'A239-L', latlng: [519.98622, 641.184082], name: 'Lab de química general' },
    { id: 'B241-L', latlng: [651.42291, 696.436035],  name: 'Lab de regulación de control y procesos químicos' },
    { id: 'A224-L', latlng: [292.785542, 565.447754], name: 'Lab de termodinámica y transmisión de calor' },
    { id: 'A215-L', latlng: [155.539847, 738.46936], name: 'Lab de óptica' },
    { id: 'A211-L', latlng: [157.309326, 622.9375], name: 'Lab de ampliación de física' },
    { id: 'A210-L', latlng: [156.923126, 547.334473], name: 'Lab de física I y II' },
    { id: 'A202-L', latlng: [168.643652, 314.407227], name: 'Lab de electrónica IV' },
   
   
    
    //despachos
    { id: 'A238-2', latlng: [534.286595, 714.094238], name: 'Despacho A 238-2' },
    { id: 'A238-1', latlng: [517.704865, 711.609619],  name: 'Despacho A 238-1' },
    { id: 'A238', latlng: [501.140521, 711.797119],  name: 'Despacho A 238' },
    { id: 'A239', latlng: [519.534953, 686.983398],  name: 'Despacho A 239' },
    { id: 'B248', latlng: [669.466776, 499.614746], name: 'Despacho B 248' },
    { id: 'B249', latlng: [642.088727, 507.364746],  name: 'Despacho B 249' },
    { id: 'A233', latlng: [397.693649, 713.761475],  name: 'Despacho A 233' },
    { id: 'A232', latlng: [377.884803, 711.979736],  name: 'Despacho A 232' },
    { id: 'A231', latlng: [360.88291, 712.167236], name: 'Despacho A 231' },
    { id: 'A230', latlng: [345.974512, 711.861328],  name: 'Despacho A 230' },
    { id: 'A229', latlng: [328.777285, 711.959229],  name: 'Despacho A 229' },
    { id: 'A228', latlng: [312.900517, 711.896729],  name: 'Despacho A 228' },
    { id: 'A227', latlng: [296.071739, 711.7146],  name: 'Despacho A 227' },
    { id: 'A225', latlng: [298.870618, 573.34375],  name: 'Despacho A 225' },
    { id: 'A224', latlng: [286.427614, 669.188965],  name: 'Despacho A 224' },
    { id: 'A222-1', latlng: [250.209498, 686.313721], name: 'Despacho A 222-1' },
    { id: 'A222-2', latlng: [231.16316, 685.049805],  name: 'Despacho A 222-2' },
    { id: 'A222-3', latlng: [215.036364, 685.549805],  name: 'Despacho A 222-3' },
    { id: 'A220', latlng: [155.296359, 753.510254],  name: 'Despacho A 220' },
    { id: 'A219', latlng: [143.661853, 757.507324], name: 'Despacho A 219' },
    { id: 'A218', latlng: [136.643023, 760.316162],  name: 'Despacho A 218' },
    { id: 'A217', latlng: [130.079792, 757.128662],  name: 'Despacho A 217' },
    { id: 'sala_de_juntas', latlng: [135.138353, 739.109863], name: 'Sala de juntas' },
    { id: 'A210', latlng: [127.919897, 542.584473],  name: 'Despacho A 210' },
    { id: 'A206', latlng: [184.549815, 394.303711],  name: 'Despacho A 206' },
    
    //conectar luego solo acceso con ascensor desde le segundo piso
    // { id: 'C101', latlng: [467.640017, 422.693359],  name: 'Despacho C 101' },
    // { id: 'C102', latlng: [450.263082, 420.443359],  name: 'Despacho C 102' },
    // { id: 'C103', latlng: [433.649904, 418.427734],  name: 'Despacho C 103' },
    // { id: 'C104', latlng: [416.898039, 416.677734],  name: 'Despacho C 104' },
    // { id: 'C105', latlng: [400.665763, 414.797852], name: 'Despacho C 105' },
    // { id: 'C106', latlng: [384.079465, 412.095703],  name: 'Despacho C 106' },
    // { id: 'C107', latlng: [366.827544, 412.345703],  name: 'Despacho C 107' },
    // { id: 'C108', latlng: [345.044598, 412.69751],  name: 'Despacho C 108' },
    // { id: 'C109', latlng: [325.979975, 401.44751], name: 'Despacho C 109' },
    
    // //Aulas
    { id: 'A22', latlng: [434.268492, 632.015381], name: 'A22' },
    { id: 'A21', latlng: [430.053742, 642.319336],  name: 'A21' },
    { id: 'ADI2', latlng: [311.431323, 700.362305],  name: 'ADI 2' },

    { id: 'A23', latlng: [297.604406, 635.288818],  name: 'A23' },
    { id: 'A211', latlng: [158.028863, 633.650635], name: 'seminario A211' },
    { id: 'ADI1', latlng: [168.10913, 497.125977],  name: 'ADI 1' },
    { id: 'A208-S', latlng: [167.634788, 428.62793],  name: 'Sala de informática de libre acceso' },
    { id: 'servicios_informaticos', latlng: [167.634788, 346.12793],  name: 'servicios informaticos' },
    { id: 'B21', latlng: [667.113303, 643.226318],  name: 'B21' },
    { id: 'B22', latlng: [678.051158, 562.976318],  name: 'B22' },

    // //Otros
    { id: 'salon_de_actos', latlng: [176.169565, 304.838867],  name: 'Salón de actos' },
    { id: 'terraza', latlng: [206.731227, 540.197266],  name: 'Terraza' },
   
    // //Nodos
    { id: 'nodo_principio_pasillo_A_sur_piso2', latlng: [175.378103, 706.06311],  name: 'nodo principio pasillo A sur piso 2' },
    { id: 'nodo_entrada_juntas', latlng: [172.653654, 744.835938], name: 'nodo entrada juntas' },
    { id: 'nodo_entrada_escalera_principal_piso2', latlng: [233.078609, 727.004883],  name: 'nodo entrada escalera principal piso 2' },
    { id: 'nodo_entrada_despachos_A222s', latlng: [250.601713, 706.594727],  name: 'nodo entrada despachos A 222s' },
    { id: 'nodo_entrada_escalera_secundaria_piso2', latlng: [650.992433, 487.772461],  name: 'nodo entrada escalera secundaria piso 2 ' },
    { id: 'nodo_entrada_despacho_B249', latlng: [653.242683, 507.272461],  name: 'nodo entrada despacho B249' },
    { id: 'nodo_entrada_despacho_B248', latlng: [681.745857, 510.022461], name: 'nodo entrada despacho B248' },
    { id: 'nodo_pasillo_B21_B22', latlng: [684.496163, 648.272461], name: 'nodo pasillo B21 B22' },
    { id: 'nodo_B21_aseos', latlng: [639.057313, 649.706055],  name: 'nodo B21 aseos' },
    { id: 'nodo_salida_escalera_bloque_B_piso2', latlng: [639.807396, 668.706055],  name: 'nodo salida escalera bloque B piso 2' },
    { id: 'nodo_principio_pasillo_B_piso2', latlng: [628.056088, 704.956055],  name: 'nodo pricnipio pasillo B piso 2' },
    { id: 'nodo_final_pasillo_A_norte_piso2', latlng: [534.823197, 703.054688], name: 'nodo final pasillo A Norte piso 2' },
    { id: 'nodo_entrada_A239s_norte', latlng: [518.32136, 702.804688],  name: 'nodo entrada A 239s norte' },
    { id: 'nodo_entrada_escalera_bloque_A_norte_piso2', latlng: [473.956068, 706.341797],  name: 'nodo entrada escalera bloque A norte piso 2' },
    { id: 'nodo_entrada_A21_A22_piso2', latlng: [432.539696, 702.484863], name: 'nodo entrada A 21 A 22 piso 2' },
    { id: 'nodo_mitad_pasillo_A_norte_piso2', latlng: [369.440362, 702.948242],  name: 'nodo mitad pasillo A norte piso 2' },
    { id: 'nodo_entrada_escalera_entrada_piso2', latlng: [125.480086, 673.546875], name: 'nodo entrada escalera entrada piso 2' },
    { id: 'nodo_pasillo_escalera_entrada_piso2', latlng: [172.48532, 673.796875],  name: 'nodo pasillo escalera entrada piso 2' },
    { id: 'nodo_entrada_escalera_cafeteria_piso2', latlng: [181.145044, 330.407227],  name: 'nodo entrada escalera cafeteria piso 2' },
    { id: 'nodo_acceso_bloque_C_piso2', latlng: [178.647695, 411.260742],  name: 'nodo acceso bloque C piso 2' },
    { id: 'nodo_mitad_pasillo_A_sur_piso2', latlng: [175.647361, 524.260742],  name: 'nodo mitad pasillo A sur piso 2' },
    { id: 'nodo_entrada_bloque_C_piso2', latlng: [305.193847, 406.133789],  name: 'nodo entrada bloque C piso 2' },
    { id: 'nodo_pasillo_acceso_bloque_C_piso2', latlng: [231.480951, 410.992188],  name: 'nodo pasillo acceso bloque C piso 2' },
    { id: 'nodo_entrada_medio_terraza', latlng: [189.458447, 538.478516],  name: 'nodo entrada medio terraza' },
    { id: 'nodo_entrada_izq_terraza', latlng: [188.058665, 432.308105],  name: 'nodo entrada izq terraza' },
    { id: 'nodo_entrada_dcha_terraza', latlng: [189.288647, 642.729492],  name: 'nodo entrada dcha terraza' },
    { id: 'nodo_terraza_dcha', latlng: [213.666545, 638.776123],  name: 'nodo terraza dcha' },
    { id: 'nodo_entrada_A210s', latlng: [172.601101, 547.812988],  name: 'nodo entrada A210s' },
    { id: 'nodo_entrada_A211s', latlng: [173.699367, 630.192383],  name: 'nodo entrada A211s' },
    { id: 'nodo_entrada_A224s', latlng: [292.264186, 702.45166],  name: 'nodo entrada A224s' },

    // //ascensores y/o escaleras
    { id: 'nodo_escaleras_terraza_piso2', latlng: [235.829556, 644.754883], name: 'nodo escaleras terraza piso 2' },
    { id: 'nodo_escalera_principal_piso2', latlng: [253.83156, 733.754883],  name: 'nodo escalera principal piso 2' },
    { id: 'nodo_escalera_bloque_A_piso2', latlng: [474.706152, 731.591797],  name: 'nodo escalera bloque A piso 2' },
    { id: 'nodo_escalera_bloque_B_piso2', latlng: [678.451463, 667.831055],  name: 'nodo escalera bloque B piso 2' },
    { id: 'nodo_escalera_bloque_B_secundaria_piso2', latlng: [627.989871, 487.772461],  name: 'nodo escalera bloque B secundaria piso 2' },
    { id: 'nodo_escalera_bloque_C_piso2', latlng: [418.898262, 413.802734],  name: 'nodo escalera bloque C piso 2' },
    { id: 'nodo_escalera_cafeteria_piso2', latlng: [200.14716, 323.157227],  name: 'nodo escalera cafeteria piso 2' },
    { id: 'nodo_escalera_entrada_piso2', latlng: [108.171511, 668.487305],  name: 'nodo escalera entrada piso 2' },
        
    
]
 


const edgesPlanta2 = [
    { from: 'nodo_escalera_bloque_B_secundaria_piso1', to: 'nodo_entrada_escalera_secundaria_piso1', weight: getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_piso1','nodo_entrada_escalera_secundaria_piso1', nodosPlanta1) },

    { from: 'nodo_entrada_despacho_B150', to: 'nodo_entrada_escalera_secundaria_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','nodo_entrada_escalera_secundaria_piso1', nodosPlanta1)  },
    { from: 'nodo_entrada_despacho_B150', to: 'B150', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','B150', nodosPlanta1) },
    { from: 'nodo_entrada_despacho_B150', to: 'B149', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','B149', nodosPlanta1)},
    { from: 'nodo_entrada_despacho_B150', to: 'nodo_entrada_despacho_B149', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B150','nodo_entrada_despacho_B149', nodosPlanta1) },

    { from: 'nodo_entrada_despacho_B149', to: 'B149', weight: getDistanceBetweenPoints('nodo_entrada_despacho_B149','B149', nodosPlanta1) },
    { from: 'nodo_entrada_despacho_B149', to: 'B12', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B149','B12', nodosPlanta1) },
    { from: 'nodo_entrada_despacho_B149', to: 'nodo_pasillo_B11_B12', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B149','nodo_pasillo_B11_B12', nodosPlanta1)},
    
    { from: 'nodo_pasillo_B11_B12', to: 'B12', weight:  getDistanceBetweenPoints('nodo_pasillo_B11_B12','B12', nodosPlanta1)},
    { from: 'nodo_pasillo_B11_B12', to: 'B11', weight:  getDistanceBetweenPoints('nodo_pasillo_B11_B12','B11', nodosPlanta1) },
    { from: 'nodo_pasillo_B11_B12', to: 'nodo_B11_aseos', weight:  getDistanceBetweenPoints('nodo_pasillo_B11_B12','nodo_B11_aseos', nodosPlanta1) },
    
    { from: 'nodo_B11_aseos', to: 'B11', weight: getDistanceBetweenPoints('nodo_B11_aseos','B11', nodosPlanta1) },
    { from: 'nodo_B11_aseos', to: 'nodo_salida_escalera_bloque_B_piso1', weight:  getDistanceBetweenPoints('nodo_B11_aseos','nodo_salida_escalera_bloque_B_piso1', nodosPlanta1) },

    { from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_escalera_bloque_B_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_escalera_bloque_B_piso1', nodosPlanta1)},
    { from: 'nodo_salida_escalera_bloque_B_piso1', to: 'oficina_internacional', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','oficina_internacional', nodosPlanta1)},
    { from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_principio_pasillo_B_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_principio_pasillo_B_piso1', nodosPlanta1)},

    { from: 'nodo_principio_pasillo_B_piso1', to: 'oficina_internacional', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B_piso1','oficina_internacional', nodosPlanta1) },
    { from: 'nodo_principio_pasillo_B_piso1', to: 'nodo_final_pasillo_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B_piso1','nodo_final_pasillo_A_norte_piso1', nodosPlanta1) },

    { from: 'nodo_final_pasillo_A_norte_piso1', to: 'A140', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso1','A140', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_norte_piso1', to: 'nodo_entrada_A139s_norte', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso1','nodo_entrada_A139s_norte', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_norte_piso1', to: 'A138', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso1','A138', nodosPlanta1) },
    
    { from: 'nodo_entrada_A139s_norte', to: 'A140', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A140', nodosPlanta1) },
    { from: 'nodo_entrada_A139s_norte', to: 'A138', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A138', nodosPlanta1)},
    { from: 'nodo_entrada_A139s_norte', to: 'A139', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A139', nodosPlanta1)},
    { from: 'nodo_entrada_A139s_norte', to: 'A137', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','A137', nodosPlanta1)},
    { from: 'nodo_entrada_A139s_norte', to: 'nodo_entrada_escalera_bloque_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A139s_norte','nodo_entrada_escalera_bloque_A_norte_piso1', nodosPlanta1)},

    { from: 'A139', to: 'A139-L1', weight: getDistanceBetweenPoints('A139','A139-L1', nodosPlanta1) },
    { from: 'A139', to: 'A139-L2', weight:  getDistanceBetweenPoints('A139','A139-L2', nodosPlanta1) },
    { from: 'A139-L1', to: 'A139-L2', weight:  getDistanceBetweenPoints('A139-L1','A139-L2', nodosPlanta1)},

    { from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_escalera_bloque_A_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_escalera_bloque_A_piso1', nodosPlanta1) },
    { from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_entrada_A130_134_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_entrada_A130_134_piso1', nodosPlanta1)},

    { from: 'nodo_entrada_A130_134_piso1', to: 'nodo_medio_A130_134_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','nodo_medio_A130_134_piso1', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A130-L', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A130-L', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A130-L', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A130-L', nodosPlanta1)},


    { from: 'nodo_medio_A130_134_piso1', to: 'A132-L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A132-L', nodosPlanta1)},
    { from: 'nodo_medio_A130_134_piso1', to: 'A133-L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A133-L', nodosPlanta1) },
    { from: 'nodo_medio_A130_134_piso1', to: 'A134-L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A134-L', nodosPlanta1)},
    { from: 'nodo_medio_A130_134_piso1', to: 'A137', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A137', nodosPlanta1)},

    { from: 'nodo_entrada_A130_134_piso1', to: 'proyecto_mentor', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','proyecto_mentor', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A129', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A129', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A128', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A128', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'nodo_mitad_pasillo_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','nodo_mitad_pasillo_A_norte_piso1', nodosPlanta1)},

    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'proyecto_mentor', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','proyecto_mentor', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A129', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A129', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A128', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A128', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A127', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A127', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A126', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A126', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A125', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A125', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'A123', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','A123', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_norte_piso1', to: 'nodo_entrada_A124s_norte', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso1','nodo_entrada_A124s_norte', nodosPlanta1)},
    
    { from: 'A124-S1', to: 'A124', weight:  getDistanceBetweenPoints('A124-S1','A124', nodosPlanta1)},
    
    { from: 'nodo_entrada_A124s_norte', to: 'A124-S1', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A124-S1', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A124', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A124', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A127', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A127', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A126', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A126', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A125', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A125', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A123', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A123', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'A122', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A122', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'gestion_economica', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','gestion_economica', nodosPlanta1)},
    { from: 'nodo_entrada_A124s_norte', to: 'nodo_principio_pasillo_A_norte_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','nodo_principio_pasillo_A_norte_piso1', nodosPlanta1)},

    { from: 'nodo_principio_pasillo_A_norte_piso1', to: 'gestion_economica', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','gestion_economica', nodosPlanta1)},
    { from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_entrada_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_entrada_escalera_principal_piso1', nodosPlanta1)},
    { from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_entrada_escaleras_terraza_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_entrada_escaleras_terraza_piso1', nodosPlanta1)},
    { from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_escalera_principal_piso1', nodosPlanta1)},

    { from: 'nodo_entrada_escaleras_terraza_piso1', to: 'nodo_escaleras_terraza_piso1', weight: getDistanceBetweenPoints('nodo_entrada_escaleras_terraza_piso1','nodo_escaleras_terraza_piso1', nodosPlanta1) },
    { from: 'nodo_entrada_escaleras_terraza_piso1', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escaleras_terraza_piso1','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1) },

    { from: 'nodo_entrada_escalera_principal_piso1', to: 'nodo_secretaria', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso1','nodo_secretaria', nodosPlanta1)},
    { from: 'nodo_entrada_escalera_principal_piso1', to: 'nodo_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso1','nodo_escalera_principal_piso1', nodosPlanta1)},


    { from: 'nodo_secretaria', to: 'A120', weight:  getDistanceBetweenPoints('nodo_secretaria','A120', nodosPlanta1) },
    { from: 'nodo_secretaria', to: 'A118', weight:  getDistanceBetweenPoints('nodo_secretaria','A118', nodosPlanta1)},
    { from: 'nodo_secretaria', to: 'nodo_direccion', weight:  getDistanceBetweenPoints('nodo_secretaria','nodo_direccion', nodosPlanta1)},

    { from: 'nodo_direccion', to: 'A118', weight:  getDistanceBetweenPoints('nodo_direccion','A118', nodosPlanta1)},
    { from: 'nodo_direccion', to: 'direccion', weight:  getDistanceBetweenPoints('nodo_direccion','direccion', nodosPlanta1) },
    { from: 'nodo_direccion', to: 'nodo_conserjeria', weight:  getDistanceBetweenPoints('nodo_direccion','nodo_conserjeria', nodosPlanta1)},
    { from: 'nodo_direccion', to: 'A117', weight:  getDistanceBetweenPoints('nodo_direccion','A117', nodosPlanta1)},

    { from: 'nodo_conserjeria', to: 'direccion', weight:  getDistanceBetweenPoints('nodo_conserjeria','direccion', nodosPlanta1) },
    { from: 'nodo_conserjeria', to: 'A117', weight:  getDistanceBetweenPoints('nodo_conserjeria','A117', nodosPlanta1)},
    { from: 'nodo_conserjeria', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_conserjeria','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1)},

    { from: 'nodo_entrada_despachos_A115', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'A115', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A115', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'A114', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A114', nodosPlanta1) },
    { from: 'nodo_entrada_despachos_A115', to: 'A11', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A11', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'A112-L', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A112-L', nodosPlanta1) },
    { from: 'nodo_entrada_despachos_A115', to: 'A12', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A12', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'nodo_mitad_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','nodo_mitad_pasillo_A_sur_piso1', nodosPlanta1)},

    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A114', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A114', nodosPlanta1) },
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A11', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A11', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A112-L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A112-L', nodosPlanta1) },
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A12', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A12', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A13', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A13', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A110-L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A110-L', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A108-L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A108-L', nodosPlanta1) },
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A14', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A14', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A15', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A15', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'nodo_final_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','nodo_final_pasillo_A_sur_piso1', nodosPlanta1)},

    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A13', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A13', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A110-L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A110-L', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A108-L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A108-L', nodosPlanta1) },
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A14', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A14', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A15', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A15', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A16', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A16', nodosPlanta1) },
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A17', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A17', nodosPlanta1) },
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'nodo_entrada_escalera_cafeteria_piso1', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','nodo_entrada_escalera_cafeteria_piso1', nodosPlanta1) },
  
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'A16', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','A16', nodosPlanta1)},
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'A17', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','A17', nodosPlanta1) },
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'nodo_escalera_cafeteria_piso1', weight: getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','nodo_escalera_cafeteria_piso1', nodosPlanta1) },
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'cafeteria', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','cafeteria', nodosPlanta1) },

    { from: 'cafeteria', to: 'comedor', weight:  getDistanceBetweenPoints('cafeteria','comedor', nodosPlanta1)},
    { from: 'cafeteria', to: 'nodo_escalera_cafeteria_piso1', weight: getDistanceBetweenPoints('cafeteria','nodo_escalera_cafeteria_piso1', nodosPlanta1) }, 
   
    { from: 'nodo_escalera_bloque_C_piso1', to: 'nodo_bloque_C_norte_piso1', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','nodo_bloque_C_norte_piso1', nodosPlanta1)},
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C102', weight: getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C102', nodosPlanta1) },
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C103', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C103', nodosPlanta1)},
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C104', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C104', nodosPlanta1)},
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C105', weight: getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C105', nodosPlanta1) },
    { from: 'nodo_escalera_bloque_C_piso1', to: 'C106', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','C106', nodosPlanta1)},
    { from: 'nodo_escalera_bloque_C_piso1', to: 'nodo_bloque_C_sur_piso1', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_C_piso1','nodo_bloque_C_sur_piso1', nodosPlanta1)},

    { from: 'nodo_bloque_C_sur_piso1', to: 'C106', weight: getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C106', nodosPlanta1) },
    { from: 'nodo_bloque_C_sur_piso1', to: 'C107', weight:  getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C107', nodosPlanta1)},

    { from: 'C107', to: 'C108', weight:  getDistanceBetweenPoints('C107','C108', nodosPlanta1)},

    { from: 'C108', to: 'C109', weight: getDistanceBetweenPoints('C108','C109', nodosPlanta1) },

    { from: 'nodo_bloque_C_norte_piso1', to: 'C101', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte_piso1','C101', nodosPlanta1)},
    { from: 'nodo_bloque_C_norte_piso1', to: 'C102', weight:  getDistanceBetweenPoints('nodo_bloque_C_norte_piso1','C102', nodosPlanta1)},   
]

const ascensores = [
    { from: 'nodo_escalera_principal_piso1', to: 'nodo_escalera_principal', weight: 10},
    { from: 'nodo_escaleras_terraza', to: 'nodo_escaleras_terraza_piso1', weight:  10}, 
    { from: 'nodo_escalera_bloque_A', to: 'nodo_escalera_bloque_A_piso1', weight: 10},
    { from: 'nodo_escalera_bloque_B', to: 'nodo_escalera_bloque_B_piso1', weight:  10}, 
    { from: 'nodo_escalera_bloque_C', to: 'nodo_escalera_bloque_C_piso1', weight: 10},
    { from: 'nodo_escalera_cafeteria', to: 'nodo_escalera_cafeteria_piso1', weight:  10}, 
    { from: 'nodo_escalera_bloque_B_secundaria', to: 'nodo_escalera_bloque_B_secundaria_piso1', weight: 10},
]


todasLasPlantas.planta2 = {}
todasLasPlantas.planta2.nodes = nodosPlanta2
todasLasPlantas.planta2.edges = edgesPlanta2



//GET DISTANCE BETWEEN NODES
    function getDistanceBetweenPoints(id1, id2, nodosPlanta) {
        const point1 = nodosPlanta.find(point => point.id === id1);
        const point2 = nodosPlanta.find(point => point.id === id2);
        
        if (!point1 || !point2) {
            console.error('One or both IDs are not found in the array', point1, point2);
            return null;
        }
        
        const [x1, y1] = point1.latlng;
        const [x2, y2] = point2.latlng;
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        // console.log(`Distance: ${distance}`);
        return distance;
    }
    
//ADD MARKERS MAPS FLOOR 0 FOR NOW
const markers = {};
// nodes.forEach(node => {
//     markers[node.id] = L.marker(node.latlng, {icon: new LeafIcon()}).addTo(map);
//     markers[node.id].bindPopup(node.id); // Optional: bind popup with node id
// });

// nodosPlanta0.forEach(node => {
//     markers[node.id] = L.marker(node.latlng, {icon: new LeafIcon()}).addTo(map);
//     markers[node.id].bindPopup(node.id); // Optional: bind popup with node id
// });

nodosPlanta2.forEach(node => {
    markers[node.id] = L.marker(node.latlng, {icon: new LeafIcon()}).addTo(map);
    markers[node.id].bindPopup(node.id); // Optional: bind popup with node id
});


//CREATE POLYLINE BETWEEN NODES (EDGES)

// const geojsonFeatures = edgesPlanta0.map(edge => ({
//     type: 'Feature',
//     geometry: {
//         type: 'LineString',
//         coordinates: [
//             [nodosPlanta0.find(node => node.id === edge.from).latlng[1], nodosPlanta0.find(node => node.id === edge.from).latlng[0]],
//             [nodosPlanta0.find(node => node.id === edge.to).latlng[1], nodosPlanta0.find(node => node.id === edge.to).latlng[0]]
//         ]
//     },
//     properties: {
//         weight: edge.weight,
//         from: edge.from,
//         to: edge.to
//     }
// }));

// const geojsonFeatures = edgesPlanta1.map(edge => ({
//     type: 'Feature',
//     geometry: {
//         type: 'LineString',
//         coordinates: [
//             [nodosPlanta1.find(node => node.id === edge.from).latlng[1], nodosPlanta1.find(node => node.id === edge.from).latlng[0]],
//             [nodosPlanta1.find(node => node.id === edge.to).latlng[1], nodosPlanta1.find(node => node.id === edge.to).latlng[0]]
//         ]
//     },
//     properties: {
//         weight: edge.weight,
//         from: edge.from,
//         to: edge.to
//     }
// }));


// const geojsonFeatures = edges.map(edge => ({
//     type: 'Feature',
//     geometry: {
//         type: 'LineString',
//         coordinates: [
//             [nodes.find(node => node.id === edge.from).latlng[1], nodes.find(node => node.id === edge.from).latlng[0]],
//             [nodes.find(node => node.id === edge.to).latlng[1], nodes.find(node => node.id === edge.to).latlng[0]]
//         ]
//     },
//     properties: {
//         weight: edge.weight,
//         from: edge.from,
//         to: edge.to
//     }
// }));

//HELPERS FOR CREATION OF MAP-------------------------------------------------------------------------------------

//GET COORIDINATES ON CLICKING MARKER
map.on('layeradd', function(event) {
    if (event.layer instanceof L.Marker) {
        const marker = event.layer;
        marker.on('click', function() {
            console.log(`Marker clicked. Coordinates: ${marker.getLatLng().toString()}`);
            // Replace alert and console.log with your desired handling of coordinates
        });
    }
    // if (event.layer instanceof L.Polygon) {
    //     const layer = event.layer;
    //     layer.on('click', function() {
    //         console.log(`${JSON.stringify(layer.getLatLngs())}`)
    //     });
    // }
});

// GET POLYGONE COORDINATES INFO
function getInfoXY(e) {
    var layer = e.target
    if (layer instanceof L.Polygon) {
       console.log(JSON.stringify(layer.getLatLngs()), 'layer info')

    }
}



//PLANTA 0 AULAS CLICKABLES
    const B01 = L.polygon([
        [{"lat":692.8754693689804,"lng":591.4473876953125},{"lat":695.0482558248691,"lng":656.235595703125},{"lat":658.4395834115614,"lng":656.253662109375},{"lat":658.4036344413571,"lng":645.7734375},{"lat":619.4603207198243,"lng":645.7523193359375},{"lat":619.3940288051743,"lng":605.8902587890625},{"lat":624.2317638416912,"lng":605.86376953125},{"lat":624.21875,"lng":591.3917236328125}]
    ]);

    const B02 = L.polygon([
        [{"lat":690.8171226977452,"lng":538.6160888671875},{"lat":631.3835917991852,"lng":538.6160888671875},{"lat":631.4148329985168,"lng":546.3035888671875},{"lat":619.5082573737867,"lng":546.2723388671875},{"lat":619.5707397724499,"lng":574.0223388671875},{"lat":624.1944372735295,"lng":574.0223388671875},{"lat":624.258195769108,"lng":589.8035888671875},{"lat":692.8785666175394,"lng":589.7410888671875}]
    ]);

    const B042 = L.polygon([
        [{"lat":633.0677187963502,"lng":512.0625},{"lat":633.0364775970186,"lng":501.1875},{"lat":647.0325348975837,"lng":501.1875},{"lat":647.0658618553217,"lng":480.15625},{"lat":688.9713021938306,"lng":486.34375},{"lat":689.9397793731108,"lng":512.125}]
    ]);

    const B041 = L.polygon([
        [{"lat":614.5333727212136,"lng":515.8128662109375},{"lat":601.0996570086177,"lng":515.7191162109375},{"lat":601.068415809286,"lng":534.5003662109375},{"lat":614.5958551198769,"lng":534.5941162109375}]
    ]);

    const B037 = L.polygon([
        [{"lat":654.0882736374218,"lng":683.3436279296875},{"lat":654.1507560360851,"lng":688.8748779296875},{"lat":673.6765056183467,"lng":688.9061279296875},{"lat":673.7709244691437,"lng":709.5936279296875},{"lat":677.8010391829225,"lng":709.5936279296875},{"lat":690.2410473734112,"lng":701.2186279296875},{"lat":695.7397008711488,"lng":689.6248779296875},{"lat":695.6782569513546,"lng":683.3436279296875}]
    ]);

    const B036 = L.polygon([
        [{"lat":671.4216306347746,"lng":691.0172119140625},{"lat":654.0827650057263,"lng":691.0172119140625},{"lat":654.1452474043896,"lng":713.1422119140625},{"lat":671.4841130334379,"lng":710.5484619140625}]
    ]);

    const B034 = L.polygon([
        [{"lat":597.9792826399189,"lng":711.432861328125},{"lat":598.0417650385821,"lng":721.964111328125},{"lat":568.0739479094306,"lng":726.495361328125},{"lat":568.0739479094306,"lng":711.432861328125}]
    ]);

    const B033 = L.polygon([
        [{"lat":548.3548634840321,"lng":711.464111328125},{"lat":548.3548634840321,"lng":729.495361328125},{"lat":565.8858934673225,"lng":726.807861328125},{"lat":565.8858934673225,"lng":711.401611328125}]
    ]);

    const A031 = L.polygon([
        [{"lat":545.8001919719129,"lng":716.47314453125},{"lat":545.7377095732497,"lng":729.78564453125},{"lat":514.0591334509885,"lng":734.66064453125},{"lat":514.1216158496517,"lng":716.53564453125}]
    ]);

    const A032 = L.polygon([[{"lat":520.462857659163,"lng":679.23388671875},{"lat":520.462857659163,"lng":695.23388671875},{"lat":533.3988926412331,"lng":695.1390380859375},{"lat":533.3029905844583,"lng":679.20263671875}]]);

    const A032_L1 = L.polygon([[{"lat":533.3973214285714,"lng":651.98388671875},{"lat":533.428562627903,"lng":677.39013671875},{"lat":499.1499440277491,"lng":677.39013671875},{"lat":499.2124264264123,"lng":651.95263671875}]]);

    const A032_L2 = L.polygon([[{"lat":533.3672859208081,"lng":632.04638671875},{"lat":533.3985271201396,"lng":650.04638671875},{"lat":499.2442044665152,"lng":650.01513671875},{"lat":499.2442044665152,"lng":632.01513671875}]]);

    const A032_L3 = L.polygon([[{"lat":499.4372353932373,"lng":581.8629150390625},{"lat":499.4059941939057,"lng":597.2379150390625},{"lat":505.2480984689184,"lng":597.2379150390625},{"lat":505.40473569832716,"lng":629.6754150390625},{"lat":533.5272803118487,"lng":629.6754150390625},{"lat":533.4965759532884,"lng":581.8629150390625}]]);

    const A032_L4 = L.polygon([[{"lat":597.690316213882,"lng":680.3125},{"lat":597.7527986125453,"lng":694.875},{"lat":560.4508066105927,"lng":694.8125},{"lat":560.4508066105927,"lng":680.1875}]]);

    const A032_L5 = L.polygon([[{"lat":597.7523104688057,"lng":648.1201171875},{"lat":597.814792867469,"lng":678.2451171875},{"lat":560.3253536695266,"lng":678.3701171875},{"lat":560.3878360681899,"lng":648.1826171875}]]);

    const A032_L6 = L.polygon([[{"lat":597.2827161913524,"lng":614.679443359375},{"lat":597.5326457860053,"lng":646.116943359375},{"lat":560.1681713853894,"lng":646.179443359375},{"lat":560.1056889867262,"lng":614.679443359375}]]);

    const A032_L7 = L.polygon([[{"lat":597.4599123688114,"lng":583.98291015625},{"lat":597.647359564801,"lng":612.48291015625},{"lat":548.7199803334397,"lng":612.35791015625},{"lat":548.5950155361132,"lng":584.04541015625}]]);

    const A032_A1 = L.polygon([[{"lat":545.4081069410284,"lng":516.84375},{"lat":499.3495144377898,"lng":516.875},{"lat":499.380676431106,"lng":580.125},{"lat":545.4730359255018,"lng":580.125}]]);

    const A030 = L.polygon([[{"lat":511.5346059882095,"lng":716.4918212890625},{"lat":495.8515239237369,"lng":716.3980712890625},{"lat":495.91363669432815,"lng":737.4293212890625},{"lat":511.6279599581323,"lng":735.0230712890625}]]);

    const A029 = L.polygon([[{"lat":494.6298151390271,"lng":678.5069580078125},{"lat":478.66556228057,"lng":678.5069580078125},{"lat":478.66556228057,"lng":694.6007080078125},{"lat":494.6610563383587,"lng":694.5694580078125}]]);

    const A029_L1 = L.polygon([[{"lat":494.5660308281546,"lng":652.677490234375},{"lat":494.6286364361752,"lng":676.614990234375},{"lat":445.1928789685147,"lng":676.614990234375},{"lat":445.22524665339915,"lng":613.114990234375},{"lat":477.9104144762781,"lng":613.114990234375},{"lat":477.94506153427335,"lng":652.677490234375}]]);

    const A029_L2 = L.polygon([[{"lat":495.06283090513114,"lng":537.24169921875},{"lat":495.0978159087922,"lng":594.4375},{"lat":477.8180444210803,"lng":594.46875},{"lat":477.9742768197435,"lng":609.9375},{"lat":445.2240127996921,"lng":609.90625},{"lat":445.2559228498207,"lng":537.375}]]);

    const A029_A = L.polygon([[{"lat":494.90711246550137,"lng":517.59375},{"lat":494.90711246550137,"lng":535.125},{"lat":471.0696549433941,"lng":535.15625},{"lat":471.0696549433941,"lng":517.59375}]]);

    const A028_3 = L.polygon([[{"lat":458.34227207442314,"lng":716.442138671875},{"lat":443.87759678388375,"lng":716.473388671875},{"lat":443.9087851792051,"lng":745.379638671875},{"lat":458.2797368717496,"lng":743.098388671875}]]);

    const A028_2 = L.polygon([[{"lat":442.37485097534875,"lng":723.910888671875},{"lat":426.1606685222387,"lng":723.973388671875},{"lat":426.1920681336012,"lng":748.035888671875},{"lat":442.4999741847061,"lng":745.504638671875}]]);

    const A028_1 = L.polygon([[{"lat":424.8764967003361,"lng":716.692138671875},{"lat":424.9394455344235,"lng":748.160888671875},{"lat":409.75230636182715,"lng":750.504638671875},{"lat":409.8149735745264,"lng":716.660888671875}]]);

    const A026 = L.polygon([[{"lat":407.9070162448604,"lng":716.754638671875},{"lat":391.75225355781686,"lng":716.754638671875},{"lat":391.72174281396093,"lng":753.254638671875},{"lat":407.9046840677393,"lng":750.754638671875}]]);

    const A025 = L.polygon([[{"lat":389.4364357058371,"lng":716.723388671875},{"lat":357.0945162448604,"lng":716.692138671875},{"lat":357.06398789966767,"lng":758.504638671875},{"lat":389.5301241011584,"lng":753.535888671875}]]);

    const A023 = L.polygon([[{"lat":354.7816114141149,"lng":716.723388671875},{"lat":338.59645239190434,"lng":716.660888671875},{"lat":338.5700838292999,"lng":761.3084716796875},{"lat":354.8734604697445,"lng":758.785888671875}]]);

    const A022_L = L.polygon([[{"lat":336.3715067213638,"lng":735.7430419921875},{"lat":320.93835425154424,"lng":735.7430419921875},{"lat":320.8752118027524,"lng":716.7117919921875},{"lat":287.0316466167884,"lng":716.6805419921875},{"lat":286.97021149766255,"lng":756.1805419921875},{"lat":289.7506782381766,"lng":768.7430419921875},{"lat":336.40448165236654,"lng":761.5555419921875}]]);

    const A024= L.polygon([[{"lat":441.7484131992131,"lng":682.25},{"lat":441.81092015886566,"lng":695.9375},{"lat":430.1846256634869,"lng":695.8125},{"lat":430.30963958279204,"lng":682.1875}]]);

    const A024_LP = L.polygon([[{"lat":428.46075886891725,"lng":695.78173828125},{"lat":428.429505389091,"lng":678.84423828125},{"lat":392.77294220472515,"lng":678.81298828125},{"lat":392.8041956845514,"lng":682.59423828125},{"lat":378.99015760133256,"lng":682.59423828125},{"lat":378.95890412150624,"lng":695.90673828125}]]);

    const A024_L1 = L.polygon([[{"lat":387.8427060521139,"lng":599.8125},{"lat":387.79771305816416,"lng":678.799560546875},{"lat":353.1960821215805,"lng":678.840087890625},{"lat":353.1648286417542,"lng":660.465087890625},{"lat":349.24385984651644,"lng":660.4808349609375},{"lat":349.1859584369548,"lng":599.875}]]);

    const A024_L2 = L.polygon([[{"lat":387.3704159088378,"lng":596.737548828125},{"lat":353.9875303324858,"lng":596.7611083984375},{"lat":353.99808609554213,"lng":549.875},{"lat":387.40724697023126,"lng":549.8028564453125}]]);

    const A024_L3 = L.polygon([[{"lat":387.3736460575888,"lng":546.545166015625},{"lat":387.31113909793623,"lng":517.951416015625},{"lat":340.468070853903,"lng":517.875244140625},{"lat":340.466919611373,"lng":580.875},{"lat":350.93683535317916,"lng":580.9375},{"lat":350.90556099439516,"lng":546.59375}]]);

    const A021 = L.polygon([[{"lat":336.63722578968856,"lng":517.9141845703125},{"lat":325.28599735301214,"lng":517.86376953125},{"lat":325.3361807978546,"lng":545.8626708984375},{"lat":336.59978865855015,"lng":545.916015625}]]);

    const A021_L1 = L.polygon([[{"lat":322.7429231932742,"lng":630.150146484375},{"lat":322.6804162336216,"lng":684.212646484375},{"lat":286.9755130423889,"lng":684.212646484375},{"lat":286.91300608273633,"lng":630.212646484375}]]);

    const A021_L2 = L.polygon([[{"lat":322.4235487964441,"lng":579.29541015625},{"lat":286.73476068074683,"lng":579.246826171875},{"lat":286.60974676144167,"lng":626.684326171875},{"lat":322.4428380535244,"lng":626.6123046875}]]);

    const A021_L3 = L.polygon([[{"lat":323.24911960394934,"lng":561},{"lat":287.33618456766635,"lng":561.007568359375},{"lat":287.3113899354144,"lng":517.8125},{"lat":323.2375341022976,"lng":517.7708740234375}]]);

    const enfermeria = L.polygon([[{"lat":263.6233366430348,"lng":663.96875},{"lat":263.6233366430348,"lng":695.03125},{"lat":280.9680575145689,"lng":695},{"lat":280.89199924139785,"lng":664.0831298828125}]]);

    const A019 = L.polygon([[{"lat":261.40676269440627,"lng":660.4027099609375},{"lat":261.44447270192273,"lng":695.2275390625},{"lat":244.80339677443303,"lng":695.240478515625},{"lat":244.74088981478045,"lng":660.490478515625}]]);

    const hall_entrada = L.polygon([[{"lat":236.99446243643519,"lng":663.36572265625},{"lat":236.86944851713002,"lng":748.49072265625},{"lat":135.81620485505363,"lng":748.353515625},{"lat":135.69119093574847,"lng":663.228515625}]]);

    const A01 = L.polygon([[{"lat":228.13187584675774,"lng":603.1156005859375},{"lat":228.13167749665936,"lng":656.2406005859375},{"lat":188.05998756542073,"lng":656.1875},{"lat":187.99748060576815,"lng":603.0625}]]);

    const A02 = L.polygon([[{"lat":228.17217745490146,"lng":600.5791015625},{"lat":188.01939046202813,"lng":600.6640625},{"lat":187.98809174446012,"lng":556.6015625},{"lat":228.1433279550685,"lng":556.6009521484375}]]);

    const A03 = L.polygon([[{"lat":228.14298693209236,"lng":505.603759765625},{"lat":228.12392473367728,"lng":554.46875},{"lat":187.93595263724436,"lng":554.4404296875},{"lat":187.93522767343455,"lng":505.59375}]]);

    const A04 = L.polygon([[{"lat":228.1869884655358,"lng":503.09375},{"lat":187.91675762545935,"lng":503.127197265625},{"lat":187.96617492854756,"lng":456.09375},{"lat":228.18727381129133,"lng":456.125}]]);

    const A05 = L.polygon([[{"lat":239.15334724490555,"lng":254.4317626953125},{"lat":239.18533322816526,"lng":275.41064453125},{"lat":189.7466239885305,"lng":275.39013671875},{"lat":189.7153705087042,"lng":254.45263671875}]]);

    const A06 = L.polygon([[{"lat":239.21770257228758,"lng":251.65625},{"lat":239.1862577020155,"lng":226.8125},{"lat":189.64531319596526,"lng":226.8529052734375},{"lat":189.64531319596526,"lng":251.6966552734375}]]);

    const A07 = L.polygon([[{"lat":310.263406610742,"lng":254.2069091796875},{"lat":310.263406610742,"lng":275.3944091796875},{"lat":255.4043917727627,"lng":275.40625},{"lat":255.4043917727627,"lng":254.25}]]);

    const A08 = L.polygon([[{"lat":310.28067582866265,"lng":251.4375},{"lat":310.24942234883633,"lng":247.1875},{"lat":303.09237546861664,"lng":226.84375},{"lat":255.3723066144538,"lng":226.84375},{"lat":255.43481357410639,"lng":251.40625}]]);

    const pista_deportiva = L.polygon([[{"lat":289.57223278413943,"lng":310.2081298828125},{"lat":289.7062417644111,"lng":399.853759765625},{"lat":210.939330388627,"lng":399.908935546875},{"lat":211.06472012917115,"lng":310.283935546875}]]);

    const A015_L = L.polygon([[{"lat":164.61418933966817,"lng":616.507080078125},{"lat":160.40060804164656,"lng":616.5035400390625},{"lat":160.3741091644705,"lng":639.25},{"lat":165.28090549719758,"lng":639.25},{"lat":165.34206953388886,"lng":654.5673828125},{"lat":117.25212704381798,"lng":654.5682373046875},{"lat":117.2520435279871,"lng":590.3182373046875},{"lat":164.72068913319848,"lng":590.3494873046875}]]);

    const A012_L = L.polygon([[{"lat":164.56547931127278,"lng":521.9884033203125},{"lat":164.69014872777552,"lng":568.0196533203125},{"lat":117.24737273115326,"lng":567.96875},{"lat":117.24741796889498,"lng":521.96875}]]);

    const A008_L = L.polygon([[{"lat":164.7521406731376,"lng":518.42138671875},{"lat":117.3362263255818,"lng":518.4222412109375},{"lat":117.27945440963586,"lng":474.78125},{"lat":164.77933261571582,"lng":474.8125}]]);

    const A007_L = L.polygon([[{"lat":228.12885796741028,"lng":408.5706787109375},{"lat":228.0659751865187,"lng":453.6331787109375},{"lat":187.78956852473925,"lng":453.59033203125},{"lat":187.97708940369697,"lng":408.598876953125}]]);

    const A006_L = L.polygon([[{"lat":164.71350938161166,"lng":409.6859130859375},{"lat":164.7379110834787,"lng":452.996826171875},{"lat":117.2859970630266,"lng":453.0003662109375},{"lat":117.24753628298876,"lng":409.625}]]);

    const A005_L = L.polygon([[{"lat":164.7490360881185,"lng":405.875},{"lat":117.24785294718089,"lng":405.84375},{"lat":117.24785294718089,"lng":373.21875},{"lat":164.78046355925912,"lng":373.15625}]]);

    const A004_L = L.polygon([[{"lat":164.7174763835789,"lng":369.34375},{"lat":117.26327756718385,"lng":369.375},{"lat":117.21650203221856,"lng":306.5},{"lat":164.81181099439516,"lng":306.46875}]]);

    const A002_L = L.polygon([[{"lat":164.87489908503767,"lng":302.4375},{"lat":164.8436456052114,"lng":277},{"lat":117.40386979881964,"lng":277},{"lat":117.40386979881964,"lng":302.5}]]);

    const Fablab = L.polygon([[{"lat":184.29358279434692,"lng":226.9752197265625},{"lat":184.35584268633312,"lng":274.3189697265625},{"lat":168.26135148333395,"lng":274.2877197265625},{"lat":168.2300318868082,"lng":226.9798583984375}]]);

    const A006 = L.polygon([[{"lat":164.87396997141903,"lng":454.28125},{"lat":164.84271649159274,"lng":471.125},{"lat":150.09107401358523,"lng":471.09375},{"lat":150.09107401358523,"lng":454.21875}]]);

    const A007 = L.polygon([[{"lat":196.6346573879032,"lng":384.4952392578125},{"lat":196.6346573879032,"lng":406.9014892578125},{"lat":187.72741563741138,"lng":406.8702392578125},{"lat":187.75866911723767,"lng":384.4639892578125}]]);

    const A002 = L.polygon([[{"lat":164.67878042528116,"lng":260.6597900390625},{"lat":164.6475269454549,"lng":273.8472900390625},{"lat":131.9803963986118,"lng":273.757080078125},{"lat":131.85538247930663,"lng":260.757080078125}]]);


    const layerGroupPlanta0 = L.layerGroup([
        B01,
        B02,
        B042,
        B041,
        B037,
        B036,
        B034,
        B033,
        A031,
        A032,
        A032_L1,
        A032_L2,
        A032_L3,
        A032_L4,
        A032_L5,
        A032_L6,
        A032_L7,
        A032_A1,
        A030,
        A029,
        A029_L1,
        A029_L2,
        A029_A,
        A028_3,
        A028_2,
        A028_1,
        A026,
        A025,
        A023,
        A022_L,
        A024,
        A024_LP,
        A024_L1,
        A024_L2,
        A024_L3,
        A021,
        A021_L1,
        A021_L2,
        A021_L3,
        enfermeria,
        A019,
        hall_entrada,
        A01,
        A02,
        A03,
        A04,
        A05,
        A06,
        A07,
        A08,
        pista_deportiva,
        A015_L,
        A012_L,
        A008_L,
        A007_L,
        A006_L,
        A005_L,
        A004_L,
        A002_L,
        Fablab,
        A006,
        A007,
        A002
    ])
    // const A21 = L.polygon([
    //     [692.36, 591.75],
    //     [619.453, 645.875],
    //     [619.32878, 606,25],
    //     [623.956, 606.375],
    //     [624.206, 591.875]
    // ]).addTo(map);

    // var B03 = L.polygon([
    //     [692.36, 591.75],
    //     [623.956, 606.375],
    //     [624.206, 591.875]
    // ]).addTo(map);

    // B01.style.color = 'red'

//cambia el color de cualquier layer de tipo vector (poligono etc)
//   B01.setStyle({color:'green'})

    // map.fitBounds(B01.getBounds());

    // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

    // function onMapClick(e) {
    //     // alert("You clicked the map at " + e.latlng);
    //     console.log(e.latlng)
        
    // }
    
    // map.on('click', onMapClick);


//------------------------------------------------------------------------
//LAYERS FOR THE MAP

//PLANTA -1

//PLANTA 0

//PLANTA 1

//PLANTA 2

//PLANTA 3

//PLANTA 4


//------------------------------------------------------------------------

    function changeColorDestino(e) {
        var layer = e.target;
        if (layer instanceof L.Polygon) {
            layer.setStyle({
                color: 'green',
                opacity:'1'
            });
        }
    }

    function changeColorOrigen(e) {
        var layer = e.target;
        if (layer instanceof L.Polygon) {
            layer.setStyle({
                color: 'blue',
                opacity:'1'
            });
        }
    }

    function changeAllPolygonsOpacity(layerGroup) {
        layerGroup.eachLayer(function(layer) {
            
            if (layer instanceof L.Polygon) {
                layer.setStyle({
                    opacity: '0',
                    fillOpacity: '0'
                });
            }
        });
    }


    
    // Event listener for click on GeoJSON layer
    // geojsonLayer.on('click', function (event) {
    //     const clickedLayer = event.layer;
    
    //     if (clickedLayer.feature.geometry.type === 'LineString') {
    //         const latLngs = clickedLayer.getLatLngs(); // Get coordinates (LatLngs) of the line
    
    //         // Output coordinates to console
    //         console.log('Coordinates:', latLngs);
            
    //         // Optionally, you can display coordinates in an alert or use them in further processing
    //         alert('Coordinates clicked: ' + JSON.stringify(latLngs));
    //     }
    // });
    // If you want to use map event delegation
    // map.eachLayer(function (layer) {
    //     if (layer instanceof L.Polygon) {
    //         changeAllPolygonsOpacity();
    //         layer.on('click', function() {
    //             changeAllPolygonsOpacity();
    //         });
    //         layer.on('click', changeColor);
    //         layer.on('click', getInfoXY)
            
    //     }
    // });

    
    
//--------FOR CREATING------------------------------------------------------------------------------
    var options = {
        position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
        drawMarker: true,  // adds button to draw markers
        drawPolygon: true,  // adds button to draw a polygon
        drawPolyline: true,  // adds button to draw a polyline
        drawCircle: true,  // adds button to draw a cricle
        editPolygon: true,  // adds button to toggle global edit mode
        deleteLayer: true   // adds a button to delete layers
    };

    // add leaflet.pm controls to the map
    map.pm.addControls(options);
    

    // get array of all available shapes
    map.pm.Draw.getShapes()

    // disable drawing mode
    map.pm.disableDraw('Polygon');

    // listen to when drawing mode gets enabled
    map.on('pm:drawstart', function(e) {
    	console.log(e)
    });
    
    // listen to when drawing mode gets disabled
    map.on('pm:drawend', function(e) {
    	console.log(e)
    });
    
// listen to when a new layer is created
map.on('pm:create', function(e) {
  console.log(e)

  // listen to changes on the new layer
  e.layer.on('pm:edit', function(x) {
    console.log('edit', x)
  });
});
map.pm.setGlobalOptions({pathOptions:{color:'red'}});
//-----------------------------------------------------------------------------------------
  
    $(document).on('click', '#button-see-all', async function (event) {

        //funcion que te dirige al objeto especificado en getbounds
        // map.fitBounds(B01.getBounds());

        const estado_boton = $(event.currentTarget).val();
        const elements = document.getElementsByClassName("controles")  
        
        if(estado_boton === 'hidden'){
            for (const element of elements) {
                element.style.display = "";
            }
            document.getElementById('button-see-all').value= ""
        } 
        else{
            for (const element of elements) {
                element.style.display = "none";
            }
            document.getElementById('button-see-all').value= "hidden"
        }
    })

    const startPointSelect = document.getElementById('start-point');
    const endPointSelect = document.getElementById('end-point');
    const findRouteButton = document.getElementById('find-route');


    const bounds = [[0, 0], [1000, 1000]];

//--------------------------------------------------------------------------------------------------------


 Object.values(todasLasPlantas).forEach(planta => {
            planta.nodes.forEach(node => {
                if (!node.id.startsWith('nodo')) {
                    const option1 = document.createElement('option');
                    const option2 = document.createElement('option');
                    option1.value = option2.value = node.id;
                    option1.text = option2.text = node.name;
                    startPointSelect.appendChild(option1);
                    endPointSelect.appendChild(option2);
                }
            });
        });


// Dijkstra's algorithm to find the shortest path
    // function findShortestPath(startId, endId) {
    //     const distances = {};
    //     const prev = {};
    //     const pq = new Set(nodosPlanta0.map(n => n.id));

    //     distances[startId] = 0;

    //     nodosPlanta0.forEach(node => {
    //         if (node.id !== startId) distances[node.id] = Infinity;
    //         prev[node.id] = null;
    //     });

    //     while (pq.size > 0) {
    //         const closestNode = [...pq].reduce((min, nodeId) => 
    //             distances[nodeId] < distances[min] ? nodeId : min, [...pq][0]);

    //         pq.delete(closestNode);

    //         if (closestNode === endId) {
    //             const path = [];
    //             let step = endId;
    //             while (prev[step]) {
    //                 path.push(step);
    //                 step = prev[step];
    //             }
    //             return path.concat(startId).reverse();
    //         }

    //         const neighbors = edgesPlanta0
    //             .filter(edge => edge.from === closestNode || edge.to === closestNode)
    //             .map(edge => edge.from === closestNode ? edge.to : edge.from);

    //         neighbors.forEach(neighbor => {
    //             const alt = distances[closestNode] + edgesPlanta0.find(edge => 
    //                 (edge.from === closestNode && edge.to === neighbor) || 
    //                 (edge.to === closestNode && edge.from === neighbor)).weight;

    //             if (alt < distances[neighbor]) {
    //                 distances[neighbor] = alt;
    //                 prev[neighbor] = closestNode;
    //             }
    //         });
    //     }
    //     return [];
    // }

    function findShortestPath(startId, endId, todasLasPlantas) {
        const distances = {};
        const prev = {};
        const priorityQueue = new Set();
        
        // Combine all nodes and edges from all floors
        const nodes = [];
        const edges = [];
    
        for (const floor in todasLasPlantas) {
            nodes.push(...todasLasPlantas[floor].nodes);
            edges.push(...todasLasPlantas[floor].edges);
        }

        for( const ascensor of ascensores) {
            edges.push(ascensor)
        }
       
        console.log(edges,'edges')
        // Initialize distances and previous node mapping
        nodes.forEach(node => {
            distances[node.id] = node.id === startId ? 0 : Infinity;
            prev[node.id] = null;
            priorityQueue.add(node.id);
        });
    
        while (priorityQueue.size > 0) {
            const closestNode = [...priorityQueue].reduce((min, nodeId) => 
                distances[nodeId] < distances[min] ? nodeId : min, [...priorityQueue][0]);
    
            priorityQueue.delete(closestNode);
    
            if (closestNode === endId) {
                const path = [];
                let step = endId;
                while (prev[step]) {
                    path.push(step);
                    step = prev[step];
                }
                return path.concat(startId).reverse();
            }
    
            const neighbors = edges
                .filter(edge => edge.from === closestNode || edge.to === closestNode)
                .map(edge => edge.from === closestNode ? edge.to : edge.from);
    
            neighbors.forEach(neighbor => {
                const alternativa = distances[closestNode] + edges.find(edge => 
                    (edge.from === closestNode && edge.to === neighbor) || 
                    (edge.to === closestNode && edge.from === neighbor)).weight;
    
                if (alternativa < distances[neighbor]) {
                    distances[neighbor] = alternativa;
                    prev[neighbor] = closestNode;
                }
            });
        }
    
        return [];
    }
    
    
//--------------------------------------------------------------------------------------------------------
   

    function addOverlayAulas(floor) {

    let layerGroup
        switch (floor) {
            case '0':
               layerGroup = layerGroupPlanta0
                break;
            case '1':
                console.log(floor)
                layerGroupPlanta0.remove()
                break;
            case '2':
                console.log(floor)

                break;
            case '3':
                console.log(floor)

                break;
            case '4':
                console.log(floor)

                break;
            case 'baja':
                console.log(floor)

                break;
        
            default:
                break;
        }

        layerGroup.eachLayer(function (layer) {
         if (layer instanceof L.Polygon) {
             changeAllPolygonsOpacity(layerGroup);
             layer.on('click', function() {
                 changeAllPolygonsOpacity(layerGroup);
             });
             layer.on('click', changeColorDestino);
             layer.on('dblclick', changeColorOrigen);
   
         }
         
         });
       layerGroup.addTo(map)
    }


    let currentLayer = null;

    function loadFloor(floor) {
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }
        // addOverlayAulas(floor)
    
        const svgUrl = `/img/planta_${floor}.svg`;

        // const geojsonLayer = L.geoJSON(geojsonFeatures).addTo(map);


        currentLayer = L.imageOverlay(svgUrl, bounds).addTo(map);
        map.fitBounds(bounds);

        // Clear and populate the start and end point selects
        // startPointSelect.innerHTML = '';
        // endPointSelect.innerHTML = '';

        // Object.values(floorData).forEach(floor => {
        //     floor.nodes.forEach(node => {
        //         const option1 = document.createElement('option');
        //         const option2 = document.createElement('option');
        //         option1.value = option2.value = node.id;
        //         option1.text = option2.text = node.id;
        //         startPointSelect.appendChild(option1);
        //         endPointSelect.appendChild(option2);
        //     });
        // });
    }

    //BOTONES CAMBIO DE PISO
    $(document).on('click', '.floor-button', async function (event) {
        const selectedFloor = $(event.currentTarget).val();
        const elements = document.getElementsByClassName("floor-button");
        for (const element of elements) {
            $(element).removeClass("active");
        }
        $(event.currentTarget).addClass("active")
        loadFloor(selectedFloor);
    })

    // Initializar mapa en el piso 0
    loadFloor('0');

    
     // Function to split the path based on consecutive 'nodo_escalera' IDs
     function splitPathByEscalera(path) {
        const parts = [];
        let startIdx = 0;

        for (let i = 1; i < path.length; i++) {
            if (path[i - 1].includes('nodo_escalera') && path[i].includes('nodo_escalera')) {
                parts.push(path.slice(startIdx, i));
                startIdx = i;
            }
        }
        parts.push(path.slice(startIdx)); // Add the remaining part of the path
        return parts;
    }


    function getFloorById(id, todasLasPlantas) {
        for (const planta in todasLasPlantas) {
            if (todasLasPlantas[planta].nodes.some(node => node.id === id)) {
                const plantaAsociada = planta.match(/\d+/); // Extract number from the floor string
                return plantaAsociada ? plantaAsociada[0] : null;
            }
        }
        return null; // Return null if the id is not found in any floor
    }


    findRouteButton.addEventListener('click', () => {
        const startPoint = document.getElementById('start-point').value;
        const endPoint = document.getElementById('end-point').value;
    
        //redirige a la planta en la que se encutra el pto de salida
        // document.querySelector(`#floor-select .floor-button[value="${getFloorById(startPoint,todasLasPlantas)}"]`).click()

        const path = findShortestPath(startPoint, endPoint, todasLasPlantas);
        console.log(path, 'path');
    
        if (path.length === 0) {
            alert('No route found!');
            return;
        }
    
        const pathParts = splitPathByEscalera(path);
        console.log(pathParts, 'pathParts');
    
        // Remove existing route if any
        if (window.currentRoute) {
            map.removeLayer(window.currentRoute);
        }
    
        let currentPartIndex = 0;
    
        function drawPathPart(index) {
            if (window.currentRoute) {
                map.removeLayer(window.currentRoute);
            }
            if (window.startMarker) {
                map.removeLayer(window.startMarker);
            }
            if (window.endMarker) {
                map.removeLayer(window.endMarker);
            }
            if (window.escalatorMarker) {
                map.removeLayer(window.escalatorMarker);
            }
            if (window.secondEscalatorMarker) {
                map.removeLayer(window.secondEscalatorMarker);
            }
    
            const part = pathParts[index];

            const latlngs = part.map(id => {
                for (const planta in todasLasPlantas) {
                    const point = todasLasPlantas[planta].nodes.find(p => p.id === id);
                    if (point) return point.latlng;
                }
                return null;
            }).filter(latlng => latlng !== null);
    
            //redirige a la planta en la que se encuentra el path
       document.querySelector(`#floor-select .floor-button[value="${getFloorById(part[0],todasLasPlantas)}"]`).click()

            window.currentRoute = L.polyline(latlngs, { color: 'green', dashArray: '5,10' }).addTo(map);
            map.fitBounds(window.currentRoute.getBounds());
    
            const startLatlng = latlngs[0];
            const endLatlng = latlngs[latlngs.length - 1];
    
//         console.log(part[0],'start')
//         console.log(part[part.length - 1],'end')

            if (startLatlng && index === 0) {
                window.startMarker = L.marker(startLatlng, { title: 'Origen', icon: new LeafIcon() }).addTo(map).bindPopup('Origen').openPopup();
            }
            
            if (endLatlng && index < pathParts.length - 1) {
                window.secondEscalatorMarker = L.marker(endLatlng, { title: 'Next Path' }).addTo(map).bindPopup('Next Path').openPopup();
                window.secondEscalatorMarker.on('click', () => {
                    currentPartIndex++;
                    drawPathPart(currentPartIndex);
                });
            } else if (endLatlng && index === pathParts.length - 1) {
                window.endMarker = L.marker(endLatlng, { title: 'Destino' }).addTo(map).bindPopup('Destino').openPopup();
            }
    
            if (startLatlng && index > 0) {
                window.escalatorMarker = L.marker(startLatlng, { title: 'Previous Path' }).addTo(map).bindPopup('Previous Path').openPopup();
                window.escalatorMarker.on('click', () => {
                    currentPartIndex--;
                    drawPathPart(currentPartIndex);
                });
            }
             
        }
    
        drawPathPart(currentPartIndex);
    });
    

    
//---------------------------------------------------------------------------------------------------------------

});


