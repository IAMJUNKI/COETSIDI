

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
            cargarClasesPendientes()
            }
            },
            error: function (error) {
                console.error(error)
                }
                })
                
                insertarBienvenida()
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
//GESTION OFFCANVAS-------------------------------------------------------------

//todos los nav item triggerean el click salvo el que tiene la clase dropdown (muy util)
$(document).on('click', '.nav-item:not(.dropdown)', async function () {
    document.getElementById("boton-cerrar-offcanvas").click();
})



//INICIO---------------------------------------------------------------------------------------------------

$(document).on('click', '#boton_inicio', async function (event) {
    event.preventDefault()
    if (preventDoubleClick(event)) { return };
    document.getElementById("pagina_horario").style.display = "none";
    document.getElementById("pagina_mapa").style.display = "none";
    document.getElementById("pagina_inicio").style.display = "";
})


function insertarBienvenida (){

    $.ajax({
        url: '/inicio/getUserName',
        type: 'get',
        success: function (name) {
         document.getElementById('bienvenida').innerHTML = `¡Hola, ${name}! 👋`
        },
        error: function (error) {
           console.error(error)
        }
    })

}

function cargarClasesPendientes (){


    $.ajax({
        url: '/inicio/getCoursesNowAndAfter',
        type: 'get',
        success:async function (clases) {
       
            await insertarClasesInicio(clases)
           
        },
        error: function (error) {
           console.error(error)
        }
    })
}


$(document).on('click', '#button-link-to-map', async function (event) {

    let aulaClase = event.currentTarget.querySelector('.contenido-cards-meeting-class')?.textContent;
    if(aulaClase){

        if (aulaClase.includes('+')) {
            aulaClase = aulaClase.substring(0, aulaClase.indexOf('+'));
        }
        // else if(aulaClase.includes('')){
        //     aulaClase = aulaClase.substring(0, aulaClase.indexOf(''));
        // }
    
        $('#boton_mapa').trigger('click')
        const allNodes = await getAllNodes()
        const nodeFound = await iterateAndMatch(allNodes,aulaClase, inputEnd)
        findClassOnMap(nodeFound)
        showSearchDisplay()
        
    }
   })


//MODAL ASIGNATURAS-----------------------------------------------------------------------------------------
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
          cargarClasesPendientes()
    
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
    document.getElementById("pagina_mapa").style.display = "none";
    document.getElementById("pagina_horario").style.display = "";
})

function generarHorario(){
    $.ajax({
        url: '/calendario/generarHorario',
        type: 'get',
        success: async function (sessionArray) {
        
        renderSchedule(sessionArray);
        await getPersonalizacion()
        if (window.innerWidth >= 992) {
            showAllDays();
        } else {
            showDay()
        }
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
    console.log(semestre,'semestreee')
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
        const schedule = document.querySelector('.schedule');
        const sessions = schedule.querySelectorAll('.session');
        const semestre = document.getElementById('elegir-semestre').value
   console.log(semestre,'semestreee')
        sessions.forEach(session => {
            const className = session.className
            if (className.includes(semestre)) {
                session.style.display = 'block';
            } else {
                session.style.display = 'none';
            }
        });           
}
async function getPersonalizacion() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/calendario/personalizacion',
            type: 'get',
            success: function (datos) {
                $('#elegir-semestre').val(datos.semestre_horario);
                $('#elegir-color').val(datos.paleta_horario);

                changeColorHorario(datos.paleta_horario);
                resolve();
            },
            error: function (error) {
                console.error(error);
                reject(error);
            }
        });
    });
}

function changeColorHorario(color) {
    const schedule = document.querySelector('.schedule');
    const sessions = schedule.querySelectorAll('.session');
    sessions.forEach(session => {
        let colorNumber
        let semestre
        session.classList.forEach(cls => {
            if (cls.includes('color')) {
                colorNumber = cls.substring(cls.lastIndexOf('-') + 1);
            }
            if (cls.includes('semestre')) {
                semestre = cls;
            }
        })
        session.className = `session ${color}-${colorNumber} ${semestre}`
    });
}


  //cambiar semestre horario
  $(document).on('change', '#elegir-semestre', async function (event) {

 const semestre =  $(event.currentTarget).val()
    try {
        $.ajax({
            url: `/calendario/guardarSemestre/${semestre}`,
            type: 'post',
            success: async function () {

                if (window.innerWidth < 992) showDay(); // Lunes es el default
                else showAllDays()
            },
            error: function (error) {
               console.error(error)
            }
        }) 
    } catch (error) {
        
    }   
})

  //cambiar color horario
  $(document).on('change', '#elegir-color', async function (event) {

      const color =  $(event.currentTarget).val()
      
      try {
          $.ajax({
              url: `/calendario/guardarColor/${color}`,
              type: 'post',
              success: async function () {
                  
                  changeColorHorario(color)
    
               },
               error: function (error) {
                  console.error(error)
               }
           }) 
       } catch (error) {
           
       }   
   })

   $(document).on('click', '.session', async function (event) {

    let sessionAula = event.currentTarget.querySelector('.session-aula').textContent;


    console.log('Clicked session-aula:', sessionAula);

    if (sessionAula) {
        
        if (sessionAula.includes('+')) {
            sessionAula = sessionAula.substring(0, sessionAula.indexOf('+'));
        }
    
        $('#boton_mapa').trigger('click')
        const allNodes = await getAllNodes()
        const nodeFound = await iterateAndMatch(allNodes,sessionAula, inputEnd)
        findClassOnMap(nodeFound)
        showSearchDisplay()
        
    }
    
   })

   function renderSchedule(sessionArray){
    $('.session').remove()
    const scheduleContainer = document.getElementById('schedule-container');

    sessionArray.forEach(miniSession => {
            const elementos = miniSession.element
        const sessionElement = createScheduleElement(elementos.asignatura, elementos.hora_inicio,  elementos.hora_final,  elementos.aula, elementos.grupo, elementos.dia, elementos.tipo, elementos.color, elementos.semestre, elementos.column_span);

        scheduleContainer.appendChild(sessionElement);
      });
   }


   async function insertarClasesInicio(clases) {
    // console.log('Current Courses:', clases.clasesActuales);
    // console.log('Next Course:', clases.proximaClase);
    // console.log('hoy:', clases.diaActual);

    const clasesActuales =  clases.clasesActuales
    const proximaClase = clases.proximaClase
    const diaActual = clases.diaActual

    const containerWrapper = document.getElementById('container-inicio-clases')

    containerWrapper.innerHTML= ''

    const rowWrapper = document.createElement('div')
    rowWrapper.className ='row'
    
        const cardClasesActuales = await createCard (clasesActuales, 'Clase Actual')
        const cardClasesProximas =  await createCard (proximaClase, 'Próxima Clase', diaActual)

        rowWrapper.appendChild(cardClasesActuales)
        rowWrapper.appendChild(cardClasesProximas)

        containerWrapper.appendChild(rowWrapper)
}

async function createCard(clasesActualesOProximas,cardTitleContent, diaActual = '') {

    const cardHeader = document.createElement('div')
    cardHeader.className = "card-header no-border"

    const cardTitle = document.createElement('h5')
    cardTitle.className = "card-title"
    cardTitle.textContent = `${cardTitleContent}`

    cardHeader.appendChild(cardTitle)

    if(cardTitleContent === 'Próxima Clase' && clasesActualesOProximas.length >= 1 ){

        let diaProximoContent = clasesActualesOProximas[0]['Dia']

        if(diaActual === clasesActualesOProximas[0]['Dia']) diaProximoContent = 'Hoy'

        const cardInfoDiaProxima = document.createElement('h7')
        cardInfoDiaProxima.className = "card-day-info"
        cardInfoDiaProxima.textContent = `${diaProximoContent}`

        cardHeader.appendChild(cardInfoDiaProxima)
    }

  
    if (clasesActualesOProximas.length > 1) {
        const badgePill = document.createElement('span')
        badgePill.className = "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        badgePill.textContent = `${clasesActualesOProximas.length}`

        cardHeader.appendChild(badgePill)
    }


    const card = document.createElement('div');
    card.className = 'card card-margin';
    
    card.appendChild(cardHeader)

    let tipo
    if (cardTitleContent === 'Próxima Clase') {
        tipo= 'Proximo'
    }
    else {
        tipo = 'Actual'
    }
    
    if(clasesActualesOProximas.length > 1){
        let carouselId 
        if (cardTitleContent === 'Próxima Clase') carouselId = 'carouselProximasClases'
        else carouselId = 'carouselClasesActuales'

        const extendedCard = await extendCardCarousel(clasesActualesOProximas,carouselId, tipo)

        card.appendChild(extendedCard)
    }
    else {
        let textoGenericoNoClase
        if (cardTitleContent === 'Próxima Clase') textoGenericoNoClase = 'Este mes no tienes clases'
        else  textoGenericoNoClase = 'Actualmente no tienes clase'

        const extendedCard = await extendCardNoCarousel(clasesActualesOProximas, textoGenericoNoClase, tipo)

        card.appendChild(extendedCard)
    }


    const cardGridSystem = document.createElement('div')
    cardGridSystem.className = "col-lg-4"

    cardGridSystem.appendChild(card)
    
    return cardGridSystem
}

async function extendCardNoCarousel(clasesActualesOProximas, textoGenericoNoClase, tipo) {
    
    if (clasesActualesOProximas.length === 0) {


        clasesActualesOProximas.push({Asignatura: `${textoGenericoNoClase}`, Tipo: '', Aula: ''})
        
    }
    

        //CARD TITLE
    const cardMeetingTitle= document.createElement('span')
    cardMeetingTitle.className = "contenido-cards-pro-title"
    cardMeetingTitle.textContent=`${clasesActualesOProximas[0]['Asignatura']}`
    
    const cardMeetingInfo= document.createElement('div')
    cardMeetingInfo.className = "contenido-cards-meeting-info"
    
    cardMeetingInfo.appendChild(cardMeetingTitle)
     //CARD TIME
     if (clasesActualesOProximas[0]['HoraFinal']){
       
         const cardMeetingTime= document.createElement('span')
         cardMeetingTime.className = "contenido-cards-meeting-time"

         if (tipo === 'Actual') cardMeetingTime.textContent = `Hasta las ${clasesActualesOProximas[0]['HoraFinal']}`
         else cardMeetingTime.textContent = `De ${clasesActualesOProximas[0]['HoraInicio']} a ${clasesActualesOProximas[0]['HoraFinal']}`
         
         const cardMeetingClass= document.createElement('span')
         cardMeetingClass.className = "contenido-cards-meeting-class"
          cardMeetingClass.textContent = `${clasesActualesOProximas[0]['Aula']}`
         
        cardMeetingInfo.appendChild(cardMeetingTime)
        cardMeetingInfo.appendChild(cardMeetingClass)
     }
    
    const cardAnchorToMap= document.createElement('a')
    cardAnchorToMap.id = "button-link-to-map"
    cardAnchorToMap.setAttribute('role', 'button')
    cardAnchorToMap.setAttribute('aria-expanded', 'false')
    cardAnchorToMap.setAttribute('value', 'hidden')
    
    cardAnchorToMap.appendChild(cardMeetingInfo)
    
    
    let tipeContenidoCards
    let tipeIcon
    switch (clasesActualesOProximas[0]['Tipo']) {
        case 'Teoría y Problemas':
            tipeContenidoCards = "contenido-cards-teoria"
            tipeIcon = "fa-solid fa-book-open"
            break;
         case 'Laboratorio':
            tipeContenidoCards = "contenido-cards-laboratorio"
            tipeIcon = "fa-solid fa-flask"
            break;
         case 'Acciones Cooperativas':
            tipeContenidoCards = "contenido-cards-cooperativas"
            tipeIcon = "fa-solid fa-users-gear"
            break;
    
        default:
            tipeContenidoCards = "contenido-cards-noclass"
            tipeIcon = "fa-regular fa-clock"
            break;
    }
    
    
    
    const cardIconWrapper= document.createElement('span')
    cardIconWrapper.className = "contenido-cards-icon"
    
    
    const cardIcon= document.createElement('i')
    cardIcon.className = `${tipeIcon}`
    
    cardIconWrapper.appendChild(cardIcon)
    
    const cardContentTipeClass= document.createElement('div')
    cardContentTipeClass.className = `${tipeContenidoCards}`
    
    cardContentTipeClass.appendChild(cardIconWrapper)
    
    const cardContentTitleWrapper= document.createElement('div')
    cardContentTitleWrapper.className = "contenido-cards-title-wrapper"
    
    cardContentTitleWrapper.appendChild(cardContentTipeClass)
    cardContentTitleWrapper.appendChild(cardAnchorToMap)
    
     const cardContent = document.createElement('div')
    cardContent.className = "contenido-cards"
    
    cardContent.appendChild(cardContentTitleWrapper)
    
    const cardBody = document.createElement('div')
    cardBody.className = "card-body pt-0"
    
    cardBody.appendChild(cardContent)

    return cardBody
    
}


 async function extendCardCarousel(clasesActualesOProximas,carouselId,tipo) {
    
    const carouselCard= document.createElement('div')
    carouselCard.className = "carousel slide"
    carouselCard.id = `${carouselId}`
    
    const carouselInner= document.createElement('div')
    carouselInner.className = "carousel-inner"
    
    
    clasesActualesOProximas.forEach((course,index)=>{
    
     if (course['Asignatura'] === 'English for Professional and Academic Communication') course['Asignatura'] = 'EPAC'
        
        //CARD TITLE
    const cardMeetingTitle= document.createElement('span')
    cardMeetingTitle.className = "contenido-cards-pro-title"
    cardMeetingTitle.textContent=`${course['Asignatura']}`
    
     //CARD TIME
    const cardMeetingTime= document.createElement('span')
    cardMeetingTime.className = "contenido-cards-meeting-time"

    if (tipo === 'Actual') cardMeetingTime.textContent = `Hasta las ${course['HoraFinal']}`
    else cardMeetingTime.textContent = `De ${course['HoraInicio']} a ${course['HoraFinal']}`

    
    const cardMeetingClass= document.createElement('span')
    cardMeetingClass.className = "contenido-cards-meeting-class"
     cardMeetingClass.textContent = `${course['Aula']}`
    
    const cardMeetingInfo= document.createElement('div')
    cardMeetingInfo.className = "contenido-cards-meeting-info"
    
    cardMeetingInfo.appendChild(cardMeetingTitle)
    cardMeetingInfo.appendChild(cardMeetingTime)
    cardMeetingInfo.appendChild(cardMeetingClass)
    
    const cardAnchorToMap= document.createElement('a')
    cardAnchorToMap.id = "button-link-to-map"
    cardAnchorToMap.setAttribute('role', 'button')
    cardAnchorToMap.setAttribute('aria-expanded', 'false')
    cardAnchorToMap.setAttribute('value', 'hidden')
    
    cardAnchorToMap.appendChild(cardMeetingInfo)
    
    
    let tipeContenidoCards
    let tipeIcon
    switch (course['Tipo']) {
        case 'Teoría y Problemas':
            tipeContenidoCards = "contenido-cards-teoria"
            tipeIcon = "fa-solid fa-book-open"
            break;
         case 'Laboratorio':
            tipeContenidoCards = "contenido-cards-laboratorio"
            tipeIcon = "fa-solid fa-flask"
            break;
         case 'Acciones Cooperativas':
            tipeContenidoCards = "contenido-cards-cooperativas"
            tipeIcon = "fa-solid fa-users-gear"
            break;
    
        default:
            tipeContenidoCards = "contenido-cards-noclass"
            tipeIcon = "fa-regular fa-clock"
            break;
    }
    
    
    
    const cardIconWrapper= document.createElement('span')
    cardIconWrapper.className = "contenido-cards-icon"
    
    
    const cardIcon= document.createElement('i')
    cardIcon.className = `${tipeIcon}`
    
    cardIconWrapper.appendChild(cardIcon)
    
    const cardContentTipeClass= document.createElement('div')
    cardContentTipeClass.className = `${tipeContenidoCards}`
    
    cardContentTipeClass.appendChild(cardIconWrapper)
    
    const cardContentTitleWrapper= document.createElement('div')
    cardContentTitleWrapper.className = "contenido-cards-title-wrapper"
    
    cardContentTitleWrapper.appendChild(cardContentTipeClass)
    cardContentTitleWrapper.appendChild(cardAnchorToMap)
    
     const cardContent = document.createElement('div')
    cardContent.className = "contenido-cards"
    
    cardContent.appendChild(cardContentTitleWrapper)
    
    const cardBody = document.createElement('div')
    cardBody.className = "card-body pt-0"
    
    cardBody.appendChild(cardContent)
    
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item';
    if (index === 0) {
      carouselItem.classList.add('active');
    }
    carouselItem.appendChild(cardBody)
    carouselInner.appendChild(carouselItem)
    })
    
    carouselCard.appendChild(carouselInner)

    const buttonPrevCarousel = document.createElement('button')
    buttonPrevCarousel.className = "carousel-control-prev"
    buttonPrevCarousel.setAttribute('type', 'button')
    buttonPrevCarousel.setAttribute('data-bs-target', `#${carouselId}`)
    buttonPrevCarousel.setAttribute('data-bs-slide', 'prev')

    const buttonNextCarousel = document.createElement('button')
    buttonNextCarousel.className = "carousel-control-next"
    buttonNextCarousel.setAttribute('type', 'button')
    buttonNextCarousel.setAttribute('data-bs-target', `#${carouselId}`)
    buttonNextCarousel.setAttribute('data-bs-slide', 'next')

    const buttonControlNext= document.createElement('span')
    buttonControlNext.className = "carousel-control-next-icon"
    buttonControlNext.setAttribute('aria-hidden', 'true')

    const nextText = document.createElement('span');
    nextText.className = 'visually-hidden';
    nextText.textContent = 'Next';

    const buttonControlPrev= document.createElement('span')
    buttonControlPrev.className = "carousel-control-prev-icon"
    buttonControlPrev.setAttribute('aria-hidden', 'true')

    const prevText = document.createElement('span');
    prevText.className = 'visually-hidden';
    prevText.textContent = 'Previous';

    buttonNextCarousel.appendChild(buttonControlNext)
    buttonNextCarousel.appendChild(nextText)

    buttonPrevCarousel.appendChild(buttonControlPrev)
    buttonPrevCarousel.appendChild(prevText)


    carouselCard.appendChild(buttonPrevCarousel)
    carouselCard.appendChild(buttonNextCarousel)
    
    return carouselCard
}


   function createScheduleElement(asignatura, horaInicio, horaFinal, aula, grupo, dia, tipo, colorClass, semesterClass, columnSpan) {
    
    const sessionDiv = document.createElement('a');
    sessionDiv.className = `session ${colorClass} ${semesterClass}`;
    sessionDiv.style.gridColumn = `${columnSpan}`; // Lowercase the day and add column span
    sessionDiv.style.gridRow = `time-${horaInicio.replace(':', '')} / time-${horaFinal.replace(':', '')}`;

    const sessionWrapper = document.createElement('div')
    sessionWrapper.className ='session-title-wrapper'

    const sessionInfo = document.createElement('div')
    sessionInfo.className ='session-info-wrapper'


    const timeElement = document.createElement('span');
    timeElement.className = 'session-time';
    timeElement.textContent = `${horaInicio} - ${horaFinal} ${tipo}`;

    const aulaElement = document.createElement('span');
    aulaElement.className = 'session-aula';
    aulaElement.textContent = `${aula}`;
  
    const titleElement = document.createElement('h3');
    titleElement.className = 'session-asignatura';
    titleElement.textContent = asignatura;

   
  
    const tipoElement = document.createElement('span');
    tipoElement.className = 'session-tipo';
    tipoElement.textContent = tipo;
  
    sessionInfo.appendChild(titleElement)
    sessionInfo.appendChild(aulaElement);

    sessionWrapper.appendChild(sessionInfo);
    sessionWrapper.appendChild(timeElement);

    sessionDiv.appendChild(sessionWrapper);

    // sessionDiv.appendChild(titleElement);
    // sessionDiv.appendChild(aulaElement);
    // sessionDiv.appendChild(timeElement);
    // sessionDiv.appendChild(tipoElement);
  
    return sessionDiv;
  }


//FUNCIONES RESPONSIVE

//para retrasar una funcion activada con click o input por ejemlo
const debounce = (fn, delay = 1000) => {
    let timerId = null
    return (...args) => {
        clearTimeout(timerId)
        timerId = setTimeout(() => fn(...args), delay)
    }
}


window.addEventListener('resize', debounce(handleScreenWidthChange, 100));


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
    showSpinner('auth_calendar')
try {
    $.ajax({
        url: '/googleCalendar/authCalendar',
        type: 'get',
        success: function (done) {
            console.log(done)
            destroySpinner()
            document.getElementById("cerrar_modal_google_calendar").click();
        },
        error: function (error) {
           console.error(error)
        }
    })
} catch (error) {
    console.error('AJAX request falied',error)
}
    
   
})

//MAPA-----------------------------------------------------------------------------------

$(document).on('click', '#boton_mapa', async function (event) {
    event.preventDefault()
    if (preventDoubleClick(event)) { return };
    const paginaMapa = document.getElementById("pagina_mapa")
    document.getElementById("pagina_inicio").style.display = "none";
    document.getElementById("pagina_horario").style.display = "none";
    paginaMapa.style.display = "";

     
    if (paginaMapa.getAttribute('content-loaded') === 'false') {

        loadFloor('0');
        await loadDropdownSearch()

        paginaMapa.setAttribute('content-loaded','true');
    }

})




// <div class="btn-group"><button type="button" title="Previous month" aria-pressed="false" class="fc-prev-button btn btn-primary"><span class="bi bi-chevron-left"></span></button><button type="button" title="Next month" aria-pressed="false" class="fc-next-button btn btn-primary"><span class="bi bi-chevron-right"></span></button></div>


// async function loadDropdownSearch (){
//     try {
//         $.ajax({
//             url: '/mapa/guardarAsignaturas',
//             type: 'post',
//             data,
//             cache: false,
//             contentType: false,
//             processData: false,
//             success:  function () {
            
              

//             },
//             error: function (error) {
//                 $('#js_form_asignaturas_usuario').empty()
//                 document.getElementById('js_form_asignaturas_usuario').innerHTML='Error sending the data'
//             console.error(error)
//             }
//         })

//         const allNodes = await getAllNodes()
//         await addNodesToDropdown(allNodes)  
//     } catch (error) {
        
//     }
 
// }

// async function changeDestinoOrOrigenMapa(aula){
//     try {

//         $.ajax({
//             url: '/mapa/guardarAsignaturas',
//             type: 'post',
//             data,
//             cache: false,
//             contentType: false,
//             processData: false,
//             success: async function (allNodes) {
            
//                 const inputStart = document.getElementById('combo-input-start');
//                 const inputEnd = document.getElementById('combo-input-end');
                
//                 const DestinoIcon = document.getElementById("icon-destino-location");
            
//                 let input
                
//                 if (DestinoIcon.getAttribute('selected-mode') === 'true') input = inputEnd
            
//                 else input = inputStart
            
            
//                 const allNodes = await getAllNodes()
//                 const nodeFound = await iterateAndMatch(allNodes,aula, input)
//                 if (nodeFound === true) console.log('worked')

//             },
//             error: function (error) {
//                 $('#js_form_asignaturas_usuario').empty()
//                 document.getElementById('js_form_asignaturas_usuario').innerHTML='Error sending the data'
//             console.error(error)
//             }
//         })
// } catch (error) {
//     console.error('Something went wrong ', error.response ? error.response.data : error.message);

// }
// }

   
    const finalIcon = L.divIcon({
        className: 'pin-icon',
        html: '<div id="final-position-container"></div>',
        iconSize:     [40, 40],
        iconAnchor:   [20,60],

    });
    const currentPositionIcon = L.divIcon({
        className: 'pulsing-circle-icon',
        html: '<div id="current-position-container"></div>',
        iconSize:     [50, 50]
    
    });
    const arrowUpIcon = L.divIcon({
        className: 'pulsing-up-arrow-icon',
        html: '<div id="arrow-position-container"></div>',
        iconSize:     [60, 60],
        popupAnchor:  [0, 83]
    
    });
    const arrowDownIcon = L.divIcon({
        className: 'pulsing-down-arrow-icon',
        html: '<div id="arrow-position-container"></div>',
        iconSize:     [60, 60],
        popupAnchor:  [0, -9]
    
    });


    //defining the map 
    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 5
    });


    const nodosPlanta5=[
        //laboratorios
    { id: 'B_150_L1', latlng: [637.971925, 631.903809], name: 'Lab de metrología dimensional' },
    { id: 'B_150_L2', latlng: [656.849027, 587.278809], name: 'Lab de fabricación ensamblaje y ensayo de conjuntos mecánicos' },
    { id: 'A_146', latlng: [573.489507, 637.048828], name: 'Ormazabal' },
    { id: 'A_146_L', latlng: [572.820976, 556.239746], name: 'Lab de alta tensión' },
    { id: 'A_144_L1', latlng: [520.726778, 653.275879], name: 'Lab de máquinas eléctricas II' },
    { id: 'A_144_L2', latlng: [536.811088, 610.832031],  name: 'Lab de máquinas eléctricas II' },
    { id: 'A_138_L', latlng: [430.220015, 715.640625],  name: 'Lab de prototipado electrónico' },
    { id: 'A_140_L1', latlng: [481.862663, 661.858887],  name: 'Lab de ensayos de polímeros' },
    { id: 'A_240_L2', latlng: [468.299629, 589.759766],  name: 'Lab de transformación de polímeros' },
    { id: 'A_137_L', latlng: [434.74629, 698.173828], name: 'Lab de medios comtinuos' },
    { id: 'A_134_L', latlng: [409.967761, 697.140625],  name: 'Lab de ing. térmica' },
    { id: 'A_133_L', latlng: [362.340726, 696.889648],  name: 'Lab de máquina herramienta y soldadura' },
    { id: 'A_132_L', latlng: [328.777285, 711.959229],  name: 'Lab de investigación LIMIT' },
    { id: 'A_131_L1', latlng: [308.92815, 684.136719],  name: 'Lab de proyectos 1' },
    { id: 'A_131_L2', latlng: [308.752243, 538.386719],  name: 'Lab de mecatrónica' },
    { id: 'A_125_L', latlng: [218.820166, 728.90625],  name: 'Lab de óptica' },
    { id: 'A_113_L', latlng: [162.720758, 707.277588],  name: 'Lab de coworking' },
    { id: 'A_111_L', latlng: [184.813261, 611.6875],  name: 'Lab de idiomas' },


    //despachos
    { id: 'B_150_1', latlng: [651.84847, 649.028809], name: 'Despacho B 150-1' },
    { id: 'B_150_2', latlng: [664.372325, 631.839355], name: 'Despacho B 150-2' },
    { id: 'B_150b', latlng: [664.372325, 613.464355], name: 'Despacho B 150b' },
    { id: 'B_148', latlng: [651.42291, 696.436035],  name: 'Despacho de ing. mecánica y construcción' },
    { id: 'A_140', latlng: [464.219814, 686.217773], name: 'Despacho A -140' },
    { id: 'A_108', latlng: [185.563344, 510.6875],  name: 'Despacho A -108' },
    { id: 'A_105', latlng: [181.026707, 421.788086],  name: 'Despacho A -105' },
  
   
    // //Aulas
    { id: 'taller2', latlng: [582.615523, 688.173828],  name: 'Taller 2' },
    { id: 'taller1', latlng: [561.613185, 688.923828], name: 'Taller 1' },
    { id: 'taller', latlng: [535.560949, 567.707031],  name: 'Taller' },
    { id: 'A_140_A', latlng: [451.234253, 661.233887],  name: 'Aula de tecnología de polímeros' },
    { id: 'A_129_S1', latlng: [324.054834, 685.761719],  name: 'Sala 1' },
    { id: 'A_129_S2', latlng: [293.551438, 686.136719], name: 'Sala 2' },
    { id: 'A_109_S', latlng: [183.81315, 556.4375],  name: 'Sala roja' },
    { id: 'A_106_S', latlng: [185.27718, 473.038086],  name: 'Sala azul' },
  
    // //Otros
    { id: 'A_139', latlng: [448.22202, 715.640625],  name: 'MotoStudent' },
    { id: 'almacen_de_zinico', latlng: [171.248274, 327.507813],  name: 'Almacén de zinico' },
    { id: 'club_deportivo', latlng: [270.899217, 745.759766],  name: 'Club deportivo' },


    // //Nodos
  
    { id: 'nodo_exterior_medio_pisoBAJO', latlng: [271.790185, 502.625],  name: 'nodo ext medio piso -1' },
    { id: 'nodo_despachos_b-150', latlng: [656.37431, 632.375],  name: 'nodo despachosb150 ' },
    { id: 'nodo_lab_maquinas_pisoBAJO', latlng: [535.228393, 654.275879], name: 'nodo labs maqs piso -1' },
    { id: 'nodo_labs2_pisoBAJO', latlng: [534.823197, 703.054688], name: 'nodo labs 2 piso -1' },
    { id: 'nodo_B-150s', latlng: [639.057313, 649.706055],  name: 'nodo B -150s' },
    { id: 'nodo_salida_escalera_bloque_B_pisoBAJO', latlng: [639.807396, 668.706055],  name: 'nodo salida escalera bloque B piso -1' },
    { id: 'nodo_principio_pasillo_B_pisoBAJO', latlng: [628.056088, 704.956055],  name: 'nodo pricnipio pasillo B piso -1' },
    { id: 'nodo_labs1_pisoBAJO', latlng: [572.014259, 708.339355], name: 'nodo labs 1 piso -1' },
    { id: 'nodo_talleres_pisoBAJO', latlng: [572.61441, 688.673828],  name: 'nodo talleres piso -1' },
    { id: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', latlng: [463.719758, 705.467773],  name: 'nodo entrada escalera bloque A norte piso -1' },
    { id: 'nodo_labs3_pisoBAJO', latlng: [466.799462, 660.509766], name: 'nodo labs 3 piso -1' },
    { id: 'nodo_mitad_pasillo_A_norte_pisoBAJO', latlng: [384.843232, 706.389648],  name: 'nodo mitad pasillo A norte piso -1' },
    { id: 'nodo_labs4_pisoBAJO', latlng: [336.950893, 706.875],  name: 'nodo labs 4 piso -1' },
    { id: 'nodo_final_pasillo_labs_pisoBAJO', latlng: [278.194351, 706.625],  name: 'nodo final pasillo labs piso -1' },
    { id: 'nodo_entrada_escalera_principal_pisoBAJO', latlng: [272.904521, 691.193848],  name: 'nodo entrada escalera principal piso -1' },
    { id: 'nodo_exterior_pisoBAJO', latlng: [270.456191, 647.402344],  name: 'nodo exterior ppiso -1' },
    { id: 'nodo_1_pasillo_pisoBAJO', latlng: [251.311959, 678.499023],  name: 'nodo 1 pasillo piso -1' },
    { id: 'nodo_2_pasillo_pisoBAJO', latlng: [248.568061, 723.252197],  name: 'nodo 2 pasillo piso -1' },
    { id: 'nodo_3_pasillo_pisoBAJO', latlng: [226.757573, 727.754395],  name: 'nodo 3 pasillo piso -1' },
    { id: 'nodo_4_pasillo_pisoBAJO', latlng: [227.632671, 748.254395],  name: 'nodo 4 pasillo piso -1' },
    { id: 'nodo_5_pasillo_pisoBAJO', latlng: [173.832473, 748.75293],  name: 'nodo 5 pasillo piso -1' },
    { id: 'nodo_6_pasillo_pisoBAJO', latlng: [173.535638, 707.787109],  name: 'nodo 6 pasillo piso -1' },
    { id: 'nodo_6_7_pasillo_pisoBAJO', latlng: [173.504704, 670.741418],  name: 'nodo 6-7 pasillo piso -1' },
    { id: 'nodo_7_pasillo_pisoBAJO', latlng: [173.468248, 627.083984],  name: 'nodo 7 pasillo piso -1' },
    { id: 'nodo_8_pasillo_pisoBAJO', latlng: [174.718387, 527.833984],  name: 'nodo 8 pasillo piso -1' },
    { id: 'nodo_9_pasillo_pisoBAJO', latlng: [173.056092, 409.296875],  name: 'nodo 9 pasillo piso -1' },
    { id: 'nodo_entrada_escalera_cafet_pisoBAJO', latlng: [172.701684, 335.305542],  name: 'nodo entrada escalera cafet piso -1' },
   
    { id: 'nodo_salida_ext_pisoBAJO', latlng: [180.066342, 392.050293],  name: 'nodo dsalida ext piso -1' },
    { id: 'nodo_entrada_escalera_pista_deportiva_pisoBAJO', latlng: [293.739342, 392.451172],  name: 'nodo entrada escalera pista depprtiva piso -1' },
    { id: 'nodo_entrada_salas_pisoBAJO', latlng: [309.525911, 706.044922],  name: 'nodo entrada salas piso -1' },

    { id: 'nodo_bloque_A_subida_escalera_3_pisoBAJO', latlng: [487.768538, 734.208008],  name: 'nodo bloque A subida escaleras 3 piso -1' },
    { id: 'nodo_bloque_A_subida_escalera_2_pisoBAJO', latlng: [464.515949, 735.458008],  name: 'nodo bloque A subida escaleras 2 piso -1' },
    { id: 'nodo_bloque_A_subida_escalera_1_pisoBAJO', latlng: [464.631283, 726.875488],  name: 'nodo escalera bloque A subida 1 piso -1' },
    
    { id: 'nodo_bloque_B_subida_escalera_3_pisoBAJO', latlng: [689.061094, 664.0625],  name: 'nodo bloque B subida escaleras 3 piso -1' },
    { id: 'nodo_bloque_B_subida_escalera_2_pisoBAJO', latlng: [689.123601, 676.75],  name: 'nodo bloque B subida escaleras 2 piso -1' },
    { id: 'nodo_bloque_B_subida_escalera_1_pisoBAJO', latlng: [668.371291, 676.8125],  name: 'nodo escalera bloque B subida 1 piso -1' },

    { id: 'nodo_conexion_entrada_subida_escalera_3_pisoBAJO', latlng: [94.855581, 663.999023],  name: 'nodo esclaera entrada subida escaleras 3 piso -1' },
    { id: 'nodo_conexion_entrada_subida_escalera_2_pisoBAJO', latlng: [94.855581, 672.624023],  name: 'nodo escalera entrada subida escaleras 2 piso -1' },
    { id: 'nodo_conexion_entrada_subida_escalera_1_pisoBAJO', latlng: [105.856806, 673.124023],  name: 'nodo escalera entrada subida 1 piso -1' },


    { id: 'nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO', latlng: [199.611653, 315.074707],  name: 'nodo esclaera cafetria subida escaleras 3 piso -1' },
    { id: 'nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO', latlng: [200.309159, 335.347168],  name: 'nodo escalera cafeteria subida escaleras 2 piso -1' },
   

    { id: 'nodo_conexion_terraza_subida_escalera_3_pisoBAJO', latlng: [257.794412, 650.500977],  name: 'nodo escalera terraza subida 1 piso -1' },
    { id: 'nodo_conexion_terraza_subida_escalera_2_pisoBAJO', latlng: [234.916865, 651.000977],  name: 'nodo escalera terraza subida escaleras 2 piso -1' },
    { id: 'nodo_conexion_terraza_subida_escalera_1_pisoBAJO', latlng: [234.091715, 641.816406],  name: 'nodo esclaera terraza subida escaleras 3 piso -1' },


    { id: 'nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO', latlng: [298.978173, 369.359375],  name: 'nodo escalera pista deport subida 1 piso -1' },

    
    
    
    

    // //ascensores y/o escaleras
    
    { id: 'nodo_escalera_principal_pisoBAJO', latlng: [271.154326, 727.068848],  name: 'nodo escalera principal piso -1' },
    
    { id: 'nodo_escaleras_terraza_SUBIDA_pisoBAJO', latlng: [257.41937, 641.250977], name: 'nodo escaleras terraza piso -1' },

    { id: 'nodo_escalera_entrada_SUBIDA_pisoBAJO', latlng: [110.607335, 663.499023],  name: 'nodo escalera entrada subida piso -1' },

    { id: 'nodo_escalera_bloque_A_SUBIDA_pisoBAJO', latlng: [486.768427, 718.458008],  name: 'nodo escalera bloque A subida piso -1' },

    { id: 'nodo_escalera_bloque_B_SUBIDA_pisoBAJO', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso -1' },

    { id: 'nodo_escalera_cafeteria_SUBIDA_pisoBAJO', latlng: [186.985247, 314.199707],  name: 'nodo escalera cafeteria piso -1' },

    { id: 'nodo_escalera_pista_deportiva_SUBIDA_pisoBAJO', latlng: [298.665638, 353.203125],  name: 'nodo escalera pista deportiva piso -1' },
    
]
 


    const edgesPlanta5 = [
        { from: 'nodo_despachos_b-150', to: 'B_150_L2', weight: getDistanceBetweenPoints('nodo_despachos_b-150','B_150_L2', nodosPlanta5) },
        { from: 'nodo_despachos_b-150', to: 'B_150b', weight:  getDistanceBetweenPoints('nodo_despachos_b-150','B_150b', nodosPlanta5)  },
        { from: 'nodo_despachos_b-150', to: 'B_150_2', weight:  getDistanceBetweenPoints('nodo_despachos_b-150','B_150_2', nodosPlanta5) },
        { from: 'nodo_despachos_b-150', to: 'nodo_B-150s', weight:  getDistanceBetweenPoints('nodo_despachos_b-150','nodo_B-150s', nodosPlanta5)},
       
        { from: 'nodo_B-150s', to: 'B_150_L1', weight: getDistanceBetweenPoints('nodo_B-150s','B_150_L1', nodosPlanta5) },
        { from: 'nodo_B-150s', to: 'B_150_1', weight:  getDistanceBetweenPoints('nodo_B-150s','B_150_1', nodosPlanta5) },
        { from: 'nodo_B-150s', to: 'nodo_salida_escalera_bloque_B_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_B-150s','nodo_salida_escalera_bloque_B_pisoBAJO', nodosPlanta5)},
        
        { from: 'nodo_salida_escalera_bloque_B_pisoBAJO', to: 'B_150_1', weight: getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_pisoBAJO','B_150_1', nodosPlanta5) },



        { from: 'nodo_6_7_pasillo_pisoBAJO', to: 'nodo_conexion_entrada_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_6_7_pasillo_pisoBAJO','nodo_conexion_entrada_subida_escalera_1_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_conexion_entrada_subida_escalera_1_pisoBAJO', to: 'nodo_conexion_entrada_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_pisoBAJO','nodo_conexion_entrada_subida_escalera_2_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_conexion_entrada_subida_escalera_2_pisoBAJO', to: 'nodo_conexion_entrada_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_2_pisoBAJO','nodo_conexion_entrada_subida_escalera_3_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_conexion_entrada_subida_escalera_3_pisoBAJO', to: 'nodo_escalera_entrada_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_pisoBAJO','nodo_escalera_entrada_SUBIDA_pisoBAJO', nodosPlanta5) },








        { from: 'nodo_salida_escalera_bloque_B_pisoBAJO', to: 'nodo_bloque_B_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_pisoBAJO','nodo_bloque_B_subida_escalera_1_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_bloque_B_subida_escalera_1_pisoBAJO', to: 'nodo_bloque_B_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_1_pisoBAJO','nodo_bloque_B_subida_escalera_2_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_bloque_B_subida_escalera_2_pisoBAJO', to: 'nodo_bloque_B_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_pisoBAJO','nodo_bloque_B_subida_escalera_3_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_bloque_B_subida_escalera_3_pisoBAJO', to: 'nodo_escalera_bloque_B_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_3_pisoBAJO','nodo_escalera_bloque_B_SUBIDA_pisoBAJO', nodosPlanta5) },



        { from: 'nodo_salida_escalera_bloque_B_pisoBAJO', to: 'B_148', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_pisoBAJO','B_148', nodosPlanta5)},
        { from: 'nodo_salida_escalera_bloque_B_pisoBAJO', to: 'nodo_principio_pasillo_B_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_pisoBAJO','nodo_principio_pasillo_B_pisoBAJO', nodosPlanta5)},
       
        { from: 'nodo_principio_pasillo_B_pisoBAJO', to: 'B_148', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B_pisoBAJO','B_148', nodosPlanta5) },
        { from: 'nodo_principio_pasillo_B_pisoBAJO', to: 'nodo_labs1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B_pisoBAJO','nodo_labs1_pisoBAJO', nodosPlanta5) },

        { from: 'nodo_labs1_pisoBAJO', to: 'nodo_labs2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_labs1_pisoBAJO','nodo_labs2_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_labs1_pisoBAJO', to: 'nodo_talleres_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_labs1_pisoBAJO','nodo_talleres_pisoBAJO', nodosPlanta5)},

        { from: 'nodo_talleres_pisoBAJO', to: 'taller2', weight: getDistanceBetweenPoints('nodo_talleres_pisoBAJO','taller2', nodosPlanta5) },
        { from: 'nodo_talleres_pisoBAJO', to: 'taller1', weight:  getDistanceBetweenPoints('nodo_talleres_pisoBAJO','taller1', nodosPlanta5) },
        { from: 'nodo_talleres_pisoBAJO', to: 'A_146', weight:  getDistanceBetweenPoints('nodo_talleres_pisoBAJO','A_146', nodosPlanta5)},

        { from: 'A_146', to: 'A_146_L', weight:  getDistanceBetweenPoints('A_146','A_146_L', nodosPlanta5)},
    
        { from: 'nodo_labs2_pisoBAJO', to: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', weight: getDistanceBetweenPoints('nodo_labs2_pisoBAJO','nodo_entrada_escalera_bloque_A_norte_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_labs2_pisoBAJO', to: 'nodo_lab_maquinas_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_labs2_pisoBAJO','nodo_lab_maquinas_pisoBAJO', nodosPlanta5) },
        
        { from: 'nodo_lab_maquinas_pisoBAJO', to: 'A_144_L1', weight:  getDistanceBetweenPoints('nodo_lab_maquinas_pisoBAJO','A_144_L1', nodosPlanta5)},
        { from: 'nodo_lab_maquinas_pisoBAJO', to: 'A_144_L2', weight:  getDistanceBetweenPoints('nodo_lab_maquinas_pisoBAJO','A_144_L2', nodosPlanta5) },
       
        { from: 'A_144_L2', to: 'taller', weight:  getDistanceBetweenPoints('A_144_L2','taller', nodosPlanta5)},



        { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'nodo_bloque_A_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','nodo_bloque_A_subida_escalera_1_pisoBAJO', nodosPlanta5)},

        { from: 'nodo_bloque_A_subida_escalera_1_pisoBAJO', to: 'nodo_bloque_A_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_1_pisoBAJO','nodo_bloque_A_subida_escalera_2_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_bloque_A_subida_escalera_2_pisoBAJO', to: 'nodo_bloque_A_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_pisoBAJO','nodo_bloque_A_subida_escalera_3_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_bloque_A_subida_escalera_3_pisoBAJO', to: 'nodo_escalera_bloque_A_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_3_pisoBAJO','nodo_escalera_bloque_A_SUBIDA_pisoBAJO', nodosPlanta5)},




        { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_140', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_140', nodosPlanta5)},
        { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_139', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_139', nodosPlanta5)},
        { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_138_L', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_138_L', nodosPlanta5) },
        { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_137_L', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_137_L', nodosPlanta5)},
        { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'A_134_L', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','A_134_L', nodosPlanta5) },
        { from: 'nodo_entrada_escalera_bloque_A_norte_pisoBAJO', to: 'nodo_mitad_pasillo_A_norte_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_pisoBAJO','nodo_mitad_pasillo_A_norte_pisoBAJO', nodosPlanta5)},
       
    
        { from: 'A_140', to: 'nodo_labs3_pisoBAJO', weight:  getDistanceBetweenPoints('A_140','nodo_labs3_pisoBAJO', nodosPlanta5)},

        { from: 'nodo_labs3_pisoBAJO', to: 'A_140_L1', weight:  getDistanceBetweenPoints('nodo_labs3_pisoBAJO','A_140_L1', nodosPlanta5)},
        { from: 'nodo_labs3_pisoBAJO', to: 'A_140_A', weight:  getDistanceBetweenPoints('nodo_labs3_pisoBAJO','A_140_A', nodosPlanta5)},
        { from: 'nodo_labs3_pisoBAJO', to: 'A_240_L2', weight:  getDistanceBetweenPoints('nodo_labs3_pisoBAJO','A_240_L2', nodosPlanta5)},

        { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_139', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_139', nodosPlanta5)},
        { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_138_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_138_L', nodosPlanta5) },
        { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_137_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_137_L', nodosPlanta5)},
        { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_134_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_134_L', nodosPlanta5) },
        { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'A_133_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','A_133_L', nodosPlanta5)},
        { from: 'nodo_mitad_pasillo_A_norte_pisoBAJO', to: 'nodo_labs4_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_pisoBAJO','nodo_labs4_pisoBAJO', nodosPlanta5) },
      
        { from: 'nodo_labs4_pisoBAJO', to: 'A_133_L', weight:  getDistanceBetweenPoints('nodo_labs4_pisoBAJO','A_133_L', nodosPlanta5)},
        { from: 'nodo_labs4_pisoBAJO', to: 'A_132_L', weight:  getDistanceBetweenPoints('nodo_labs4_pisoBAJO','A_132_L', nodosPlanta5)},
        { from: 'nodo_labs4_pisoBAJO', to: 'nodo_entrada_salas_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_labs4_pisoBAJO','nodo_entrada_salas_pisoBAJO', nodosPlanta5)},
        
        { from: 'nodo_entrada_salas_pisoBAJO', to: 'A_132_L', weight:  getDistanceBetweenPoints('nodo_entrada_salas_pisoBAJO','A_132_L', nodosPlanta5)},
        { from: 'nodo_entrada_salas_pisoBAJO', to: 'A_131_L1', weight:  getDistanceBetweenPoints('nodo_entrada_salas_pisoBAJO','A_131_L1', nodosPlanta5)},
        { from: 'nodo_entrada_salas_pisoBAJO', to: 'nodo_final_pasillo_labs_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_salas_pisoBAJO','nodo_final_pasillo_labs_pisoBAJO', nodosPlanta5)},

        { from: 'nodo_final_pasillo_labs_pisoBAJO', to: 'nodo_entrada_escalera_principal_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_final_pasillo_labs_pisoBAJO','nodo_entrada_escalera_principal_pisoBAJO', nodosPlanta5)},
                
        { from: 'A_131_L1', to: 'A_129_S2', weight:  getDistanceBetweenPoints('A_131_L1','A_129_S2', nodosPlanta5)},
        { from: 'A_131_L1', to: 'A_129_S1', weight:  getDistanceBetweenPoints('A_131_L1','A_129_S1', nodosPlanta5)},
        { from: 'A_131_L1', to: 'A_131_L2', weight:  getDistanceBetweenPoints('A_131_L1','A_131_L2', nodosPlanta5)},
       
        { from: 'nodo_entrada_escalera_principal_pisoBAJO', to: 'nodo_escalera_principal_pisoBAJO', weight: getDistanceBetweenPoints('nodo_entrada_escalera_principal_pisoBAJO','nodo_escalera_principal_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_entrada_escalera_principal_pisoBAJO', to: 'nodo_exterior_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_pisoBAJO','nodo_exterior_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_entrada_escalera_principal_pisoBAJO', to: 'nodo_1_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_pisoBAJO','nodo_1_pasillo_pisoBAJO', nodosPlanta5)},

        { from: 'nodo_1_pasillo_pisoBAJO', to: 'nodo_2_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_1_pasillo_pisoBAJO','nodo_2_pasillo_pisoBAJO', nodosPlanta5) },



        { from: 'nodo_exterior_pisoBAJO', to: 'nodo_conexion_terraza_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_exterior_pisoBAJO','nodo_conexion_terraza_subida_escalera_1_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_conexion_terraza_subida_escalera_1_pisoBAJO', to: 'nodo_conexion_terraza_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_1_pisoBAJO','nodo_conexion_terraza_subida_escalera_2_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_conexion_terraza_subida_escalera_2_pisoBAJO', to: 'nodo_conexion_terraza_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_2_pisoBAJO','nodo_conexion_terraza_subida_escalera_3_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_conexion_terraza_subida_escalera_3_pisoBAJO', to: 'nodo_escaleras_terraza_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_3_pisoBAJO','nodo_escaleras_terraza_SUBIDA_pisoBAJO', nodosPlanta5)},


        { from: 'nodo_exterior_pisoBAJO', to: 'nodo_exterior_medio_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_exterior_pisoBAJO','nodo_exterior_medio_pisoBAJO', nodosPlanta5)},

        { from: 'nodo_escalera_principal_pisoBAJO', to: 'club_deportivo', weight:  getDistanceBetweenPoints('nodo_escalera_principal_pisoBAJO','club_deportivo', nodosPlanta5)},

        { from: 'nodo_3_pasillo_pisoBAJO', to: 'nodo_2_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_3_pasillo_pisoBAJO','nodo_2_pasillo_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_3_pasillo_pisoBAJO', to: 'nodo_4_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_3_pasillo_pisoBAJO','nodo_4_pasillo_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_3_pasillo_pisoBAJO', to: 'A_125_L', weight:  getDistanceBetweenPoints('nodo_3_pasillo_pisoBAJO','A_125_L', nodosPlanta5)},

        { from: 'nodo_4_pasillo_pisoBAJO', to: 'nodo_5_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_4_pasillo_pisoBAJO','nodo_5_pasillo_pisoBAJO', nodosPlanta5)},

        { from: 'nodo_6_pasillo_pisoBAJO', to: 'nodo_5_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_6_pasillo_pisoBAJO','nodo_5_pasillo_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_6_pasillo_pisoBAJO', to: 'nodo_6_7_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_6_pasillo_pisoBAJO','nodo_6_7_pasillo_pisoBAJO', nodosPlanta5) },

        { from: 'nodo_6_7_pasillo_pisoBAJO', to: 'nodo_7_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_6_7_pasillo_pisoBAJO','nodo_7_pasillo_pisoBAJO', nodosPlanta5) },
    

        { from: 'nodo_6_pasillo_pisoBAJO', to: 'A_113_L', weight:  getDistanceBetweenPoints('nodo_6_pasillo_pisoBAJO','A_113_L', nodosPlanta5)},
    
        { from: 'nodo_7_pasillo_pisoBAJO', to: 'A_111_L', weight:  getDistanceBetweenPoints('nodo_7_pasillo_pisoBAJO','A_111_L', nodosPlanta5)},
        { from: 'nodo_7_pasillo_pisoBAJO', to: 'A_109_S', weight:  getDistanceBetweenPoints('nodo_7_pasillo_pisoBAJO','A_109_S', nodosPlanta5)},
        { from: 'nodo_7_pasillo_pisoBAJO', to: 'nodo_8_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_7_pasillo_pisoBAJO','nodo_8_pasillo_pisoBAJO', nodosPlanta5) },
        

        { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_111_L', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_111_L', nodosPlanta5)},
        { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_109_S', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_109_S', nodosPlanta5)},
        { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_108', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_108', nodosPlanta5) },
        { from: 'nodo_8_pasillo_pisoBAJO', to: 'nodo_9_pasillo_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','nodo_9_pasillo_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_106_S', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_106_S', nodosPlanta5)},
        { from: 'nodo_8_pasillo_pisoBAJO', to: 'A_105', weight:  getDistanceBetweenPoints('nodo_8_pasillo_pisoBAJO','A_105', nodosPlanta5) },
      
        { from: 'nodo_9_pasillo_pisoBAJO', to: 'A_108', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','A_108', nodosPlanta5) },
        { from: 'nodo_9_pasillo_pisoBAJO', to: 'A_106_S', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','A_106_S', nodosPlanta5)},
        { from: 'nodo_9_pasillo_pisoBAJO', to: 'A_105', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','A_105', nodosPlanta5) },
        { from: 'nodo_9_pasillo_pisoBAJO', to: 'nodo_salida_ext_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','nodo_salida_ext_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_9_pasillo_pisoBAJO', to: 'nodo_entrada_escalera_cafet_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_9_pasillo_pisoBAJO','nodo_entrada_escalera_cafet_pisoBAJO', nodosPlanta5)},

        { from: 'nodo_entrada_escalera_cafet_pisoBAJO', to: 'almacen_de_zinico', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafet_pisoBAJO','almacen_de_zinico', nodosPlanta5)},
        





        { from: 'nodo_entrada_escalera_cafet_pisoBAJO', to: 'nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafet_pisoBAJO','nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO', to: 'nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_2_pisoBAJO','nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO', to: 'nodo_escalera_cafeteria_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_3_pisoBAJO','nodo_escalera_cafeteria_SUBIDA_pisoBAJO', nodosPlanta5) },
        






        { from: 'nodo_entrada_escalera_pista_deportiva_pisoBAJO', to: 'nodo_salida_ext_pisoBAJO', weight: getDistanceBetweenPoints('nodo_entrada_escalera_pista_deportiva_pisoBAJO','nodo_salida_ext_pisoBAJO', nodosPlanta5) },
        { from: 'nodo_entrada_escalera_pista_deportiva_pisoBAJO', to: 'nodo_exterior_medio_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_pista_deportiva_pisoBAJO','nodo_exterior_medio_pisoBAJO', nodosPlanta5) },

        { from: 'nodo_entrada_escalera_pista_deportiva_pisoBAJO', to: 'nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_pista_deportiva_pisoBAJO','nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO', nodosPlanta5)},
        { from: 'nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO', to: 'nodo_escalera_pista_deportiva_SUBIDA_pisoBAJO', weight:  getDistanceBetweenPoints('nodo_conexion_pista_deportiva_subida_escalera_1_pisoBAJO','nodo_escalera_pista_deportiva_SUBIDA_pisoBAJO', nodosPlanta5)},
    ]

const todasLasPlantas = {}
todasLasPlantas.planta5 = {}
todasLasPlantas.planta5.nodes = nodosPlanta5
todasLasPlantas.planta5.edges = edgesPlanta5


    const nodosPlanta0=[
        //laboratorios
        { id: 'A015_L', latlng: [164.973038, 630.064453], name: 'Lab metalográfico y CNC' },
        { id: 'A012_L', latlng: [137.252833, 571.297852], name: 'Lab de motores' },
        { id: 'A008_L', latlng: [168.10913, 497.125977], name: 'Lab de medioambiente I' },
        { id: 'A007_L', latlng: [183.975154, 446.814453], name: 'Lab de fabricación mecánica' },
        { id: 'A006_L', latlng: [167.109018, 424.625977], name: 'Lab de medioambiente II' },
        { id: 'A005_L', latlng: [168.10913, 388.375977],  name: 'Lab de hidraúlica' },
        { id: 'A004_L', latlng: [167.913795, 322.817383],  name: 'Lab de ensayos destructivos _ mecánica' },
        { id: 'A002_L', latlng: [167.913795, 292.567383],  name: 'Lab de mecánica de fluidos' },
        { id: 'Fablab', latlng: [176.66477, 274.067383],  name: 'Fablab' },
        { id: 'A022_L', latlng: [327.767531, 717.157227], name: 'Lab de automatización' },
        { id: 'A021_L1', latlng: [324.767197, 655.907227], name: 'Lab de electronica I' },
        { id: 'A021_L2', latlng: [323.767086, 603.407227], name: 'Lab de electronica II' },
        { id: 'A021_L3', latlng: [302.014664, 561.907227], name: 'Lab de electronica III' },
        { id: 'A024_L1', latlng: [353.301249, 663.447266], name: 'Lab de elasticidad y resistencia de materiales' },
        { id: 'A024_L2', latlng: [354.551388, 589.197266],  name: 'Lab de mecánica y teoría de mecanismos' },
        { id: 'A024_L3', latlng: [344.900137, 581.598633],  name: 'Lab de instalaciones industriales' },
        { id: 'A024_LP', latlng: [400.555786, 698.447266],  name: 'Lab polivalente' },
        { id: 'A029_L1', latlng: [468.183556, 676.530273],  name: 'Lab de química-física' },
        { id: 'A029_L2', latlng: [463.527641, 609.459961],  name: 'Lab de operaciones y reactores' },
        { id: 'A029_A', latlng: [481.529646, 534.959961],  name: 'cultura de procesos' },
        { id: 'A032_L1', latlng: [534.168442, 665.282227],  name: 'Lab medidas magnéticas I' },
        { id: 'A032_L2', latlng: [534.168442, 641.032227],  name: 'Lab medidas magnéticas II' },
        { id: 'A032_L3', latlng: [533.668386, 606.782227],  name: 'Lab maquinas eléctricas III' },
        { id: 'A032_L7', latlng: [547.919973, 598.032227],  name: 'Lab instalaciones eléctricas' },
        { id: 'A032_L6', latlng: [559.171226, 630.782227],  name: 'Lab centrales y subestaciones' },
        { id: 'A032_L5', latlng: [558.921198, 663.032227],  name: 'Lab protecciones eléctricas' },
        { id: 'A032_L4', latlng: [559.421254, 686.782227],  name: 'Lab proyectos eléctricos' },
        { id: 'A032_A1', latlng: [538.168888, 579.782227],  name: 'Aula Schneider' },

        //despachos
        { id: 'B037', latlng: [649.217768, 685.949219],  name: 'Despacho B 037' },
        { id: 'B036', latlng: [648.663183, 695.976563], name: 'Despacho B 036' },
        { id: 'B034', latlng: [577.17323, 709.032227],  name: 'Despacho B 034' },
        { id: 'B033', latlng: [555.920864, 709.032227],  name: 'Despacho B 033' },
        { id: 'A032', latlng: [533.668386, 687.282227],  name: 'Despacho A 032' },
        { id: 'A031', latlng: [528.167774, 713.532227], name: 'Despacho A 031' },
        { id: 'A030', latlng: [502.414907, 714.032227],  name: 'Despacho A 030' },
        { id: 'A029', latlng: [485.185449, 677.780273],  name: 'Despacho A 029' },
        { id: 'A028_3', latlng: [442.011697, 718.170898],  name: 'Despacho A 028-3' },
        { id: 'A028_2', latlng: [433.51075, 722.170898],  name: 'Despacho A 028-2' },
        { id: 'A028_1', latlng: [426.009915, 719.670898], name: 'Despacho A 028-1' },
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

        { id: 'nodo_bloque_A_subida_escalera_3_piso0', latlng: [487.768538, 734.208008],  name: 'nodo bloque A subida escaleras 3 piso 0' },
    { id: 'nodo_bloque_A_subida_escalera_2_piso0', latlng: [464.515949, 735.458008],  name: 'nodo bloque A subida escaleras 2 piso 0' },
    { id: 'nodo_bloque_A_subida_escalera_1_piso0', latlng: [464.631283, 726.875488],  name: 'nodo escalera bloque A subida 1 piso 0' },
    
    { id: 'nodo_bloque_B_subida_escalera_3_piso0', latlng: [689.061094, 664.0625],  name: 'nodo bloque B subida escaleras 3 piso 0' },
    { id: 'nodo_bloque_B_subida_escalera_2_piso0', latlng: [689.123601, 676.75],  name: 'nodo bloque B subida escaleras 2 piso 0' },
    { id: 'nodo_bloque_B_subida_escalera_1_piso0', latlng: [668.371291, 676.8125],  name: 'nodo escalera bloque B subida 1 piso 0' },

    { id: 'nodo_conexion_entrada_subida_escalera_3_piso0', latlng: [97.54338, 662.842773],  name: 'nodo esclaera entrada subida escaleras 3 piso 0' },
    { id: 'nodo_conexion_entrada_subida_escalera_2_piso0', latlng: [97.418366, 672.717773],  name: 'nodo escalera entrada subida escaleras 2 piso 0' },
    { id: 'nodo_conexion_entrada_subida_escalera_1_piso0', latlng: [105.856806, 673.124023],  name: 'nodo escalera entrada subida 1 piso 0' },


    { id: 'nodo_conexion_cafeteria_subida_escalera_3_piso0', latlng: [199.611653, 315.074707],  name: 'nodo esclaera cafetria subida escaleras 3 piso 0' },
    { id: 'nodo_conexion_cafeteria_subida_escalera_2_piso0', latlng: [200.309159, 335.347168],  name: 'nodo escalera cafeteria subida escaleras 2 piso 0' },
    { id: 'nodo_conexion_cafeteria_subida_escalera_1_piso0', latlng: [184.269361, 335],  name: 'nodo escalera cafeteria subida escaleras 1 piso 0' },
   

    { id: 'nodo_conexion_principal_subida_escalera_3_piso0', latlng: [272.00574, 725.628906],  name: 'nodo esclaera principal subida escaleras 3 piso 0' },
    { id: 'nodo_conexion_principal_subida_escalera_2_piso0', latlng: [272.00574, 746.128906],  name: 'nodo escalera principal subida escaleras 2 piso 0' },
    { id: 'nodo_conexion_principal_subida_escalera_1_piso0', latlng: [246.750762, 746.003906],  name: 'nodo escalera principal subida escaleras 1 piso 0' },
   


    { id: 'nodo_conexion_terraza_subida_escalera_3_piso0', latlng: [257.794412, 650.500977],  name: 'nodo escalera terraza subida 1 piso 0' },
    { id: 'nodo_conexion_terraza_subida_escalera_2_piso0', latlng: [234.916865, 651.000977],  name: 'nodo escalera terraza subida escaleras 2 piso 0' },

    { id: 'nodo_subida_escalera_bloque_B_secundaria_1_piso0', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B subida escalera secundaria 1 piso 0' },
    

    { id: 'nodo_acceso_escalera_entrada', latlng: [132.635314, 673.236328],  name: 'nodo escalera entrada' },
    { id: 'nodo_acceso_escalera_cafeteria', latlng: [175.992478, 323.035153],  name: 'nodo escalera cafeteria' },
    { id: 'nodo_acceso_escalera_principal', latlng: [233.634218, 735.366211],  name: 'nodo escalera cafeteria' },
       
 


      //ascensores y/o escaleras
        { id: 'nodo_escalera_principal_SUBIDA_piso0', latlng: [272.00574, 725.628906],  name: 'nodo escalera principal subida piso 0' },
        { id: 'nodo_escalera_principal_BAJADA_piso0', latlng: [247.773326, 726.43457],  name: 'nodo escalera principal bajada piso 0' },
       
        { id: 'nodo_escalera_entrada_SUBIDA_piso0', latlng: [97.54338, 662.842773],  name: 'nodo escalera entrada subida piso 0' },
        { id: 'nodo_escalera_entrada_BAJADA_piso0', latlng: [110.607335, 663.499023],  name: 'nodo escalera entrada subida piso 0' },
        
        { id: 'nodo_escalera_bloque_A_SUBIDA_piso0', latlng: [487.768538, 734.208008],  name: 'nodo escalera bloque A subida piso 0' },
        { id: 'nodo_escalera_bloque_A_BAJADA_piso0', latlng: [486.768427, 718.458008],  name: 'nodo escalera bloque A subida piso 0' },

        { id: 'nodo_escalera_bloque_B_SUBIDA_piso0', latlng: [689.061094, 664.0625],  name: 'nodo escalera bloque B piso 0' },

        { id: 'nodo_escalera_bloque_B_BAJADA_piso0', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso 0' },

        { id: 'nodo_escaleras_terraza_SUBIDA_piso0', latlng: [257.41937, 641.250977], name: 'nodo escaleras terraza piso 0' },

        { id: 'nodo_escaleras_terraza_BAJADA_piso0', latlng: [234.091715, 641.816406],  name: 'nodo esclaera terraza subida escaleras 3 piso 0' },

        { id: 'nodo_escalera_cafeteria_SUBIDA_piso0', latlng: [199.611653, 315.074707],  name: 'nodo escalera cafeteria piso 0' },

        { id: 'nodo_escalera_cafeteria_BAJADA_piso0', latlng: [186.985247, 314.199707],  name: 'nodo escalera cafeteria piso 0' },

       { id: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso0', latlng: [630.404609, 484.193359],  name: 'nodo escalera bloque B segundaria' },


        { id: 'nodo_escalera_bloque_C', latlng: [421.415429, 408.658203],  name: 'nodo escalera bloque C' },
        
        { id: 'nodo_escalera_pista_deportiva_BAJADA_piso0', latlng: [304.229235, 353.390625],  name: 'nodo escalera pista deportiva piso 0' },
        
    ]


    const edgesPlanta0 = [
        { from: 'nodo_escalera_pista_deportiva_BAJADA_piso0', to: 'pista_deportiva', weight: getDistanceBetweenPoints('nodo_escalera_pista_deportiva_BAJADA_piso0','pista_deportiva', nodosPlanta0) },
       
        { from: 'hall_entrada', to: 'nodo_principio_pasillo_A_sur', weight: getDistanceBetweenPoints('hall_entrada','nodo_principio_pasillo_A_sur', nodosPlanta0) },
        { from: 'hall_entrada', to: 'nodo_principio_pasillo_A_norte', weight:  getDistanceBetweenPoints('hall_entrada','nodo_principio_pasillo_A_norte', nodosPlanta0)  },
        { from: 'hall_entrada', to: 'nodo_conexion_terraza_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('hall_entrada','nodo_conexion_terraza_subida_escalera_2_piso0', nodosPlanta0) },
        { from: 'hall_entrada', to: 'nodo_acceso_escalera_principal', weight:  getDistanceBetweenPoints('hall_entrada','nodo_acceso_escalera_principal', nodosPlanta0)},
        { from: 'hall_entrada', to: 'nodo_acceso_escalera_entrada', weight:  getDistanceBetweenPoints('hall_entrada','nodo_acceso_escalera_entrada', nodosPlanta0) },

        { from: 'nodo_conexion_entrada_subida_escalera_1_piso0', to: 'nodo_acceso_escalera_entrada', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso0','nodo_acceso_escalera_entrada', nodosPlanta0) },
        { from: 'nodo_escalera_entrada_BAJADA_piso0', to: 'nodo_acceso_escalera_entrada', weight:  getDistanceBetweenPoints('nodo_escalera_entrada_BAJADA_piso0','nodo_acceso_escalera_entrada', nodosPlanta0) },


        { from: 'nodo_conexion_entrada_subida_escalera_1_piso0', to: 'nodo_conexion_entrada_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso0','nodo_conexion_entrada_subida_escalera_2_piso0', nodosPlanta0) },
        { from: 'nodo_conexion_entrada_subida_escalera_3_piso0', to: 'nodo_conexion_entrada_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso0','nodo_conexion_entrada_subida_escalera_2_piso0', nodosPlanta0) },
        { from: 'nodo_conexion_entrada_subida_escalera_3_piso0', to: 'nodo_escalera_entrada_SUBIDA_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso0','nodo_escalera_entrada_SUBIDA_piso0', nodosPlanta0) },


        { from: 'nodo_conexion_terraza_subida_escalera_2_piso0', to: 'nodo_escaleras_terraza_BAJADA_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_2_piso0','nodo_escaleras_terraza_BAJADA_piso0', nodosPlanta0) },
        { from: 'nodo_conexion_terraza_subida_escalera_2_piso0', to: 'nodo_conexion_terraza_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_2_piso0','nodo_conexion_terraza_subida_escalera_3_piso0', nodosPlanta0) },
        { from: 'nodo_escaleras_terraza_SUBIDA_piso0', to: 'nodo_conexion_terraza_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_escaleras_terraza_SUBIDA_piso0','nodo_conexion_terraza_subida_escalera_3_piso0', nodosPlanta0) },

        { from: 'nodo_principio_pasillo_A_norte', to: 'nodo_principio_pasillo_A_sur', weight: getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','nodo_principio_pasillo_A_sur', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_A_norte', to: 'nodo_conexion_terraza_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','nodo_conexion_terraza_subida_escalera_2_piso0', nodosPlanta0) },


        { from: 'nodo_principio_pasillo_A_norte', to: 'nodo_acceso_escalera_principal', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','nodo_acceso_escalera_principal', nodosPlanta0)},

        { from: 'nodo_escalera_principal_BAJADA_piso0', to: 'nodo_acceso_escalera_principal', weight:  getDistanceBetweenPoints('nodo_escalera_principal_BAJADA_piso0','nodo_acceso_escalera_principal', nodosPlanta0)},

        { from: 'nodo_conexion_principal_subida_escalera_1_piso0', to: 'nodo_acceso_escalera_principal', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_1_piso0','nodo_acceso_escalera_principal', nodosPlanta0)},
        { from: 'nodo_conexion_principal_subida_escalera_1_piso0', to: 'nodo_conexion_principal_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_1_piso0','nodo_conexion_principal_subida_escalera_2_piso0', nodosPlanta0)},
        { from: 'nodo_conexion_principal_subida_escalera_3_piso0', to: 'nodo_conexion_principal_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_3_piso0','nodo_conexion_principal_subida_escalera_2_piso0', nodosPlanta0)},
        { from: 'nodo_conexion_principal_subida_escalera_3_piso0', to: 'nodo_escalera_principal_SUBIDA_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_3_piso0','nodo_escalera_principal_SUBIDA_piso0', nodosPlanta0)},





        { from: 'nodo_principio_pasillo_A_norte', to: 'A019', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','A019', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_A_norte', to: 'enfermeria', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte','enfermeria', nodosPlanta0) },
        
        { from: 'nodo_principio_pasillo_A_sur', to: 'A015_L', weight: getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','A015_L', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_A_sur', to: 'A01', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','A01', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_A_sur', to: 'A02', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','A02', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_A_sur', to: 'nodo_pasillo_A_lab_motores_sur', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','nodo_pasillo_A_lab_motores_sur', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_A_sur', to: 'nodo_acceso_escalera_entrada', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur','nodo_acceso_escalera_entrada', nodosPlanta0)},
    
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A015_L', weight: getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A015_L', nodosPlanta0) },
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A01', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A01', nodosPlanta0) },
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A02', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A02', nodosPlanta0)},
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A012_L', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A012_L', nodosPlanta0)},
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A03', weight: getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A03', nodosPlanta0) },
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A04', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A04', nodosPlanta0) },
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'A008_L', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','A008_L', nodosPlanta0)},
        { from: 'nodo_pasillo_A_lab_motores_sur', to: 'nodo_medio_pasillo_A_sur', weight:  getDistanceBetweenPoints('nodo_pasillo_A_lab_motores_sur','nodo_medio_pasillo_A_sur', nodosPlanta0)},
    
        { from: 'nodo_medio_pasillo_A_sur', to: 'A03', weight: getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A03', nodosPlanta0) },
        { from: 'nodo_medio_pasillo_A_sur', to: 'A04', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A04', nodosPlanta0) },
        { from: 'nodo_medio_pasillo_A_sur', to: 'A008_L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A008_L', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A006', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A006', nodosPlanta0) },
        { from: 'nodo_medio_pasillo_A_sur', to: 'A007_L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A007_L', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A006_L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A006_L', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A007', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A007', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A005_L', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A005_L', nodosPlanta0)},
        { from: 'nodo_medio_pasillo_A_sur', to: 'A006', weight:  getDistanceBetweenPoints('nodo_medio_pasillo_A_sur','A006', nodosPlanta0) },
    
        { from: 'nodo_baño_pasillo_A_sur', to: 'A007_L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A007_L', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'A006_L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A006_L', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'A007', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A007', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'A005_L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A005_L', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'A004_L', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','A004_L', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'nodo_final_pasillo_A_sur', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','nodo_final_pasillo_A_sur', nodosPlanta0)},
        { from: 'nodo_baño_pasillo_A_sur', to: 'nodo_acceso_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_baño_pasillo_A_sur','nodo_acceso_escalera_cafeteria', nodosPlanta0)},
        
        { from: 'nodo_final_pasillo_A_sur', to: 'nodo_acceso_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','nodo_acceso_escalera_cafeteria', nodosPlanta0)},


        { from: 'nodo_conexion_cafeteria_subida_escalera_1_piso0', to: 'nodo_acceso_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_1_piso0','nodo_acceso_escalera_cafeteria', nodosPlanta0)},
        { from: 'nodo_conexion_cafeteria_subida_escalera_1_piso0', to: 'nodo_conexion_cafeteria_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_1_piso0','nodo_conexion_cafeteria_subida_escalera_2_piso0', nodosPlanta0)},
        { from: 'nodo_conexion_cafeteria_subida_escalera_3_piso0', to: 'nodo_conexion_cafeteria_subida_escalera_2_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_3_piso0','nodo_conexion_cafeteria_subida_escalera_2_piso0', nodosPlanta0)},
        { from: 'nodo_conexion_cafeteria_subida_escalera_3_piso0', to: 'nodo_escalera_cafeteria_SUBIDA_piso0', weight:  getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_3_piso0','nodo_escalera_cafeteria_SUBIDA_piso0', nodosPlanta0)},



        { from: 'nodo_escalera_cafeteria_BAJADA_piso0', to: 'nodo_acceso_escalera_cafeteria', weight:  getDistanceBetweenPoints('nodo_escalera_cafeteria_BAJADA_piso0','nodo_acceso_escalera_cafeteria', nodosPlanta0)},

        { from: 'nodo_final_pasillo_A_sur', to: 'A004_L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','A004_L', nodosPlanta0)},
        { from: 'nodo_final_pasillo_A_sur', to: 'A002_L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','A002_L', nodosPlanta0)},
        { from: 'nodo_final_pasillo_A_sur', to: 'Fablab', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','Fablab', nodosPlanta0)},
        { from: 'nodo_final_pasillo_A_sur', to: 'nodo_A05_08_sur', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur','nodo_A05_08_sur', nodosPlanta0)},
        
        { from: 'A002', to: 'A002_L', weight:  getDistanceBetweenPoints('A002','A002_L', nodosPlanta0)},

        { from: 'nodo_A05_08_sur', to: 'pista_deportiva', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','pista_deportiva', nodosPlanta0)},
        { from: 'nodo_A05_08_sur', to: 'A05', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A05', nodosPlanta0)},
        { from: 'nodo_A05_08_sur', to: 'A06', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A06', nodosPlanta0)},
        { from: 'nodo_A05_08_sur', to: 'A07', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A07', nodosPlanta0)},
        { from: 'nodo_A05_08_sur', to: 'A08', weight:  getDistanceBetweenPoints('nodo_A05_08_sur','A08', nodosPlanta0)},

        { from: 'nodo_pasillo_A021s_norte', to: 'nodo_principio_pasillo_A_norte', weight: getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_principio_pasillo_A_norte', nodosPlanta0) },
        { from: 'nodo_pasillo_A021s_norte', to: 'enfermeria', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','enfermeria', nodosPlanta0) },
        { from: 'nodo_pasillo_A021s_norte', to: 'A019', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A019', nodosPlanta0)},
        { from: 'nodo_pasillo_A021s_norte', to: 'nodo_entrada_A021s_norte', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_entrada_A021s_norte', nodosPlanta0) },
        { from: 'nodo_pasillo_A021s_norte', to: 'A022_L', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A022_L', nodosPlanta0)},
        { from: 'nodo_pasillo_A021s_norte', to: 'A023', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A023', nodosPlanta0)},
        { from: 'nodo_pasillo_A021s_norte', to: 'A025', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','A025', nodosPlanta0)},
        { from: 'nodo_pasillo_A021s_norte', to: 'nodo_entrada_A024s_norte', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_entrada_A024s_norte', nodosPlanta0) },
        { from: 'nodo_pasillo_A021s_norte', to: 'nodo_first_half_pasillo_A_norte', weight:  getDistanceBetweenPoints('nodo_pasillo_A021s_norte','nodo_first_half_pasillo_A_norte', nodosPlanta0)},
    
        { from: 'nodo_entrada_A021s_norte', to: 'nodo_medio_A021s_norte', weight: getDistanceBetweenPoints('nodo_entrada_A021s_norte','nodo_medio_A021s_norte', nodosPlanta0) },

        { from: 'nodo_medio_A021s_norte', to: 'A021_L1', weight:  getDistanceBetweenPoints('nodo_medio_A021s_norte','A021_L1', nodosPlanta0) },
        { from: 'nodo_medio_A021s_norte', to: 'A021_L2', weight:  getDistanceBetweenPoints('nodo_medio_A021s_norte','A021_L2', nodosPlanta0)},
        { from: 'nodo_medio_A021s_norte', to: 'nodo_final_A021s_norte', weight:  getDistanceBetweenPoints('nodo_medio_A021s_norte','nodo_final_A021s_norte', nodosPlanta0)},

        { from: 'nodo_final_A021s_norte', to: 'A021', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021', nodosPlanta0)},
        { from: 'nodo_final_A021s_norte', to: 'A021_L3', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021_L3', nodosPlanta0)},
        { from: 'nodo_final_A021s_norte', to: 'A021_L1', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021_L1', nodosPlanta0) },
        { from: 'nodo_final_A021s_norte', to: 'A021_L2', weight:  getDistanceBetweenPoints('nodo_final_A021s_norte','A021_L2', nodosPlanta0)},
    
        { from: 'nodo_entrada_A024s_norte', to: 'A024_L1', weight:  getDistanceBetweenPoints('nodo_entrada_A024s_norte','A024_L1', nodosPlanta0)},
        { from: 'nodo_entrada_A024s_norte', to: 'A024_L2', weight:  getDistanceBetweenPoints('nodo_entrada_A024s_norte','A024_L2', nodosPlanta0)},
        { from: 'nodo_entrada_A024s_norte', to: 'A024_L3', weight:  getDistanceBetweenPoints('nodo_entrada_A024s_norte','A024_L3', nodosPlanta0) },
        
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A022_L', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A022_L', nodosPlanta0)},
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A023', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A023', nodosPlanta0)},
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A025', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A025', nodosPlanta0)},
        { from: 'nodo_first_half_pasillo_A_norte', to: 'nodo_entrada_A024s_norte', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','nodo_entrada_A024s_norte', nodosPlanta0) },
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A024_LP', weight: getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A024_LP', nodosPlanta0) },
        { from: 'nodo_first_half_pasillo_A_norte', to: 'A026', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','A026', nodosPlanta0) },
        { from: 'nodo_first_half_pasillo_A_norte', to: 'nodo_entrada_A028s_norte', weight:  getDistanceBetweenPoints('nodo_first_half_pasillo_A_norte','nodo_entrada_A028s_norte', nodosPlanta0)},
    
        { from: 'nodo_entrada_A028s_norte', to: 'A024', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A024', nodosPlanta0)},
        { from: 'nodo_entrada_A028s_norte', to: 'A028_1', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A028_1', nodosPlanta0) },
        { from: 'nodo_entrada_A028s_norte', to: 'A028_2', weight: getDistanceBetweenPoints('nodo_entrada_A028s_norte','A028_2', nodosPlanta0) },
        { from: 'nodo_entrada_A028s_norte', to: 'A028_3', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A028_3', nodosPlanta0) },
        { from: 'nodo_entrada_A028s_norte', to: 'nodo_entrada_A029s_norte', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','nodo_entrada_A029s_norte', nodosPlanta0)},
        { from: 'nodo_entrada_A028s_norte', to: 'A024_LP', weight: getDistanceBetweenPoints('nodo_entrada_A028s_norte','A024_LP', nodosPlanta0) },
        { from: 'nodo_entrada_A028s_norte', to: 'A026', weight:  getDistanceBetweenPoints('nodo_entrada_A028s_norte','A026', nodosPlanta0) },
        
        { from: 'nodo_entrada_A029s_norte', to: 'A029_L1', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','A029_L1', nodosPlanta0)},


        { from: 'nodo_entrada_A029s_norte', to: 'nodo_escalera_bloque_A_BAJADA_piso0', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','nodo_escalera_bloque_A_BAJADA_piso0', nodosPlanta0) },


        { from: 'nodo_entrada_A029s_norte', to: 'nodo_bloque_A_subida_escalera_1_piso0', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','nodo_bloque_A_subida_escalera_1_piso0', nodosPlanta0) },
        { from: 'nodo_bloque_A_subida_escalera_2_piso0', to: 'nodo_bloque_A_subida_escalera_1_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso0','nodo_bloque_A_subida_escalera_1_piso0', nodosPlanta0) },
        { from: 'nodo_bloque_A_subida_escalera_2_piso0', to: 'nodo_bloque_A_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso0','nodo_bloque_A_subida_escalera_3_piso0', nodosPlanta0) },
        { from: 'nodo_escalera_bloque_A_SUBIDA_piso0', to: 'nodo_bloque_A_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_A_SUBIDA_piso0','nodo_bloque_A_subida_escalera_3_piso0', nodosPlanta0) },



        { from: 'nodo_entrada_A029s_norte', to: 'A030', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','A030', nodosPlanta0)},
        { from: 'nodo_entrada_A029s_norte', to: 'A031', weight: getDistanceBetweenPoints('nodo_entrada_A029s_norte','A031', nodosPlanta0) },
        { from: 'nodo_entrada_A029s_norte', to: 'nodo_second_half_pasillo_A_norte', weight:  getDistanceBetweenPoints('nodo_entrada_A029s_norte','nodo_second_half_pasillo_A_norte', nodosPlanta0) },
        
        { from: 'A029_L1', to: 'A029', weight:  getDistanceBetweenPoints('A029_L1','A029', nodosPlanta0)},
        { from: 'A029_L1', to: 'A029_L2', weight:  getDistanceBetweenPoints('A029_L1','A029_L2', nodosPlanta0) },
        { from: 'A029_L1', to: 'A029_A', weight:  getDistanceBetweenPoints('A029_L1','A029_A', nodosPlanta0)},
    
        { from: 'nodo_second_half_pasillo_A_norte', to: 'A030', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','A030', nodosPlanta0)},
        { from: 'nodo_second_half_pasillo_A_norte', to: 'A031', weight: getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','A031', nodosPlanta0) },
        { from: 'nodo_second_half_pasillo_A_norte', to: 'nodo_entrada_A032s_norte', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','nodo_entrada_A032s_norte', nodosPlanta0)},
        { from: 'nodo_second_half_pasillo_A_norte', to: 'B033', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','B033', nodosPlanta0) },
        { from: 'nodo_second_half_pasillo_A_norte', to: 'B034', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','B034', nodosPlanta0) },
        { from: 'nodo_second_half_pasillo_A_norte', to: 'nodo_final_pasillo_A_norte', weight:  getDistanceBetweenPoints('nodo_second_half_pasillo_A_norte','nodo_final_pasillo_A_norte', nodosPlanta0) },
        
        { from: 'nodo_entrada_A032s_norte', to: 'A032', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032', nodosPlanta0)},
        { from: 'nodo_entrada_A032s_norte', to: 'A032_L1', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L1', nodosPlanta0)},
        { from: 'nodo_entrada_A032s_norte', to: 'A032_L2', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L2', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032_L3', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L3', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032_L4', weight: getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L4', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032_L5', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L5', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032_L6', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L6', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032_L7', weight: getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_L7', nodosPlanta0) },
        { from: 'nodo_entrada_A032s_norte', to: 'A032_A1', weight:  getDistanceBetweenPoints('nodo_entrada_A032s_norte','A032_A1', nodosPlanta0) },

        { from: 'nodo_final_pasillo_A_norte', to: 'B033', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B033', nodosPlanta0) },
        { from: 'nodo_final_pasillo_A_norte', to: 'B034', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B034', nodosPlanta0) },
        { from: 'nodo_final_pasillo_A_norte', to: 'B036', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B036', nodosPlanta0)},
        { from: 'nodo_final_pasillo_A_norte', to: 'B037', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_norte','B037', nodosPlanta0) },
        { from: 'nodo_final_pasillo_A_norte', to: 'nodo_principio_pasillo_B', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte','nodo_principio_pasillo_B', nodosPlanta0)},

        { from: 'nodo_principio_pasillo_B', to: 'B036', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','B036', nodosPlanta0)},
        { from: 'nodo_principio_pasillo_B', to: 'B037', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B','B037', nodosPlanta0) },
        { from: 'nodo_principio_pasillo_B', to: 'B01', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','B01', nodosPlanta0)},

        { from: 'nodo_principio_pasillo_B', to: 'nodo_escalera_bloque_B_BAJADA_piso0', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','nodo_escalera_bloque_B_BAJADA_piso0', nodosPlanta0)},
      
        { from: 'nodo_principio_pasillo_B', to: 'nodo_bloque_B_subida_escalera_1_piso0', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B','nodo_bloque_B_subida_escalera_1_piso0', nodosPlanta0)},
        { from: 'nodo_bloque_B_subida_escalera_2_piso0', to: 'nodo_bloque_B_subida_escalera_1_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso0','nodo_bloque_B_subida_escalera_1_piso0', nodosPlanta0)},
        { from: 'nodo_bloque_B_subida_escalera_2_piso0', to: 'nodo_bloque_B_subida_escalera_3_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso0','nodo_bloque_B_subida_escalera_3_piso0', nodosPlanta0)},
        { from: 'nodo_bloque_B_subida_escalera_3_piso0', to: 'nodo_escalera_bloque_B_SUBIDA_piso0', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_3_piso0','nodo_escalera_bloque_B_SUBIDA_piso0', nodosPlanta0)},



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

        { from: 'nodo_final_pasillo_asociaciones', to: 'nodo_subida_escalera_bloque_B_secundaria_1_piso0', weight:  getDistanceBetweenPoints('nodo_final_pasillo_asociaciones','nodo_subida_escalera_bloque_B_secundaria_1_piso0', nodosPlanta0)},

        { from: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso0', to: 'nodo_subida_escalera_bloque_B_secundaria_1_piso0', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_SUBIDA_piso0','nodo_subida_escalera_bloque_B_secundaria_1_piso0', nodosPlanta0)},

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

todasLasPlantas.planta0 = {}
todasLasPlantas.planta0.nodes = nodosPlanta0
todasLasPlantas.planta0.edges = edgesPlanta0




const nodosPlanta1=[
    //laboratorios
    { id: 'A139_L1', latlng: [519.943627, 591.736328], name: 'Lab de medidas eléctricas I' },
    { id: 'A139_L2', latlng: [516.235802, 602.934082], name: 'Lab de medidas eléctricas II' },
    { id: 'A108_L', latlng: [167.943295, 455.095703], name: 'Lab de análisis químico I' },
    { id: 'A110_L', latlng: [168.10913, 497.125977], name: 'Lab de análisis químico II' },
    { id: 'A112_L', latlng: [168.193323, 555.095703], name: 'Lab de análisis químico III' },
    { id: 'A134_L', latlng: [434.179202, 560.444336],  name: 'Lab de informática industrial' },
    { id: 'A133_L', latlng: [428.928617, 585.444336],  name: 'Lab de automatización II' },
    { id: 'A132_L', latlng: [428.428561, 629.694336],  name: 'Lab de automatización III' },
    { id: 'A130_L', latlng: [428.928617, 670.944336],  name: 'Lab de regulación automática' },

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
    { id: 'oficina_de_practicas', latlng: [158.868937, 657.637207],  name: 'Oficina de prácticas' },
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
    { id: 'A124_S1', latlng: [308.355603, 606.788818],  name: 'Sala de ordenadores' },
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


    { id: 'nodo_bloque_A_subida_escalera_3_piso1', latlng: [487.768538, 734.208008],  name: 'nodo bloque A subida escaleras 3 piso 0' },
    { id: 'nodo_bloque_A_subida_escalera_2_piso1', latlng: [464.515949, 735.458008],  name: 'nodo bloque A subida escaleras 2 piso 0' },
    { id: 'nodo_bloque_A_subida_escalera_1_piso1', latlng: [464.631283, 726.875488],  name: 'nodo escalera bloque A subida 1 piso 0' },
    
    { id: 'nodo_bloque_B_subida_escalera_3_piso1', latlng: [689.061094, 664.0625],  name: 'nodo bloque B subida escaleras 3 piso 1' },
    { id: 'nodo_bloque_B_subida_escalera_2_piso1', latlng: [689.123601, 676.75],  name: 'nodo bloque B subida escaleras 2 piso 1' },
    { id: 'nodo_bloque_B_subida_escalera_1_piso1', latlng: [668.371291, 676.8125],  name: 'nodo escalera bloque B subida 1 piso 1' },

    { id: 'nodo_conexion_entrada_subida_escalera_3_piso1', latlng: [97.54338, 660.842773],  name: 'nodo escalera entrada subida escaleras 3 piso 1' },
    { id: 'nodo_conexion_entrada_subida_escalera_2_piso1', latlng: [97.418366, 670.967773],  name: 'nodo escalera entrada subida escaleras 2 piso 1' },
  


    { id: 'nodo_conexion_cafeteria_subida_escalera_3_piso1', latlng: [200.23654, 311.324707],  name: 'nodo esclaera cafetria subida escaleras 3 piso 1' },
    { id: 'nodo_conexion_cafeteria_subida_escalera_2_piso1', latlng: [200.309159, 335.347168],  name: 'nodo escalera cafeteria subida escaleras 2 piso 1' },
    { id: 'nodo_conexion_cafeteria_subida_escalera_1_piso1', latlng: [184.269361, 335],  name: 'nodo escalera cafeteria subida escaleras 1 piso 1' },
   

    { id: 'nodo_conexion_principal_subida_escalera_3_piso1', latlng: [272.00574, 725.628906],  name: 'nodo esclaera principal subida escaleras 3 piso 1' },
    { id: 'nodo_conexion_principal_subida_escalera_2_piso1', latlng: [272.00574, 746.128906],  name: 'nodo escalera principal subida escaleras 2 piso 1' },
    { id: 'nodo_conexion_principal_subida_escalera_1_piso1', latlng: [246.750762, 746.003906],  name: 'nodo escalera principal subida escaleras 1 piso 1' },
   


    { id: 'nodo_conexion_terraza_subida_escalera_3_piso1', latlng: [257.794412, 650.500977],  name: 'nodo escalera terraza subida 1 piso 1' },
    { id: 'nodo_conexion_terraza_subida_escalera_2_piso1', latlng: [234.916865, 651.000977],  name: 'nodo escalera terraza subida escaleras 2 piso 1' },



    { id: 'nodo_subida_escalera_bloque_B_secundaria_3_piso1', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B subida escalera secundaria 3 piso 1' },
    { id: 'nodo_subida_escalera_bloque_B_secundaria_2_piso1', latlng: [612.911046, 493.994629],  name: 'nodo escalera bloque B subida escalera secundaria 2 piso 1' },
    { id: 'nodo_subida_escalera_bloque_B_secundaria_1_piso1', latlng: [634.538454, 493.994629],  name: 'nodo escalera bloque B subida escalera secundaria 1 piso 1' },
    

    { id: 'nodo_acceso_escalera_cafeteria_piso1', latlng: [177.776215, 321.094727],  name: 'nodo escalera cafeteria piso 1' },
    { id: 'nodo_acceso_escalera_principal_piso1', latlng: [234.620728, 733.445801],  name: 'nodo escalera principal piso 1' },
    { id: 'nodo_acceso_escalera_bloque_C_piso1', latlng: [416.266639, 409.743625],  name: 'nodo escalera bloque C piso 1' },
   





    // //ascensores y/o escaleras
    


    { id: 'nodo_escalera_principal_SUBIDA_piso1', latlng: [272.00574, 725.628906],  name: 'nodo escalera principal subida piso 1' },
        { id: 'nodo_escalera_principal_BAJADA_piso1', latlng: [247.773326, 726.43457],  name: 'nodo escalera principal bajada piso 1' },
       
        { id: 'nodo_escalera_entrada_SUBIDA_piso1', latlng: [112.23204, 660.499023],  name: 'nodo escalera entrada subida piso 1' },
        { id: 'nodo_escalera_entrada_BAJADA_piso1', latlng: [107.481511, 671.249023],  name: 'nodo escalera entrada subida piso 1' },


        
        { id: 'nodo_escalera_bloque_A_SUBIDA_piso1', latlng: [487.768538, 734.208008],  name: 'nodo escalera bloque A subida piso 1' },
        { id: 'nodo_escalera_bloque_A_BAJADA_piso1', latlng: [486.768427, 718.458008],  name: 'nodo escalera bloque A subida piso 1' },



        { id: 'nodo_escalera_bloque_B_SUBIDA_piso1', latlng: [689.061094, 664.0625],  name: 'nodo escalera bloque B piso 1' },

        { id: 'nodo_escalera_bloque_B_BAJADA_piso1', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso 1' },





        { id: 'nodo_escaleras_terraza_SUBIDA_piso1', latlng: [257.41937, 641.250977], name: 'nodo escaleras terraza piso 0' },

        { id: 'nodo_escaleras_terraza_BAJADA_piso1', latlng: [234.091715, 641.816406],  name: 'nodo esclaera terraza subida escaleras 3 piso 0' },



        { id: 'nodo_escalera_cafeteria_SUBIDA_piso1', latlng: [200.23654, 311.324707],  name: 'nodo escalera cafeteria piso 1' },

        { id: 'nodo_escalera_cafeteria_BAJADA_piso1', latlng: [185.80602, 310.5],  name: 'nodo escalera cafeteria piso 1' },


       { id: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso1', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B segundaria' },
       { id: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso1', latlng: [630.404609, 484.193359],  name: 'nodo escalera bloque B segundaria' },


       { id: 'nodo_escalera_bloque_C_SUBIDA_piso1', latlng: [433.377257, 411.675781],  name: 'nodo escalera bloque C' },
       { id: 'nodo_escalera_bloque_C_BAJADA_piso1', latlng: [401.7696, 407.882324],  name: 'nodo escalera bloque C' },


    
]
 


const edgesPlanta1 = [
    { from: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso1', to: 'nodo_entrada_escalera_secundaria_piso1', weight: getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_BAJADA_piso1','nodo_entrada_escalera_secundaria_piso1', nodosPlanta1) },
    { from: 'nodo_subida_escalera_bloque_B_secundaria_1_piso1', to: 'nodo_entrada_escalera_secundaria_piso1', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_1_piso1','nodo_entrada_escalera_secundaria_piso1', nodosPlanta1) },
    { from: 'nodo_subida_escalera_bloque_B_secundaria_1_piso1', to: 'nodo_subida_escalera_bloque_B_secundaria_2_piso1', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_1_piso1','nodo_subida_escalera_bloque_B_secundaria_2_piso1', nodosPlanta1) },
    { from: 'nodo_subida_escalera_bloque_B_secundaria_3_piso1', to: 'nodo_subida_escalera_bloque_B_secundaria_2_piso1', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_3_piso1','nodo_subida_escalera_bloque_B_secundaria_2_piso1', nodosPlanta1) },
    { from: 'nodo_subida_escalera_bloque_B_secundaria_3_piso1', to: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso1', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_3_piso1','nodo_escalera_bloque_B_secundaria_SUBIDA_piso1', nodosPlanta1) },


    { from: 'nodo_escalera_entrada_BAJADA_piso1', to: 'nodo_conexion_entrada_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_escalera_entrada_BAJADA_piso1','nodo_conexion_entrada_subida_escalera_2_piso1', nodosPlanta1) },
    { from: 'nodo_conexion_entrada_subida_escalera_3_piso1', to: 'nodo_conexion_entrada_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso1','nodo_conexion_entrada_subida_escalera_2_piso1', nodosPlanta1) },
    { from: 'nodo_conexion_entrada_subida_escalera_3_piso1', to: 'nodo_escalera_entrada_SUBIDA_piso1', weight: getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso1','nodo_escalera_entrada_SUBIDA_piso1', nodosPlanta1) },


    { from: 'nodo_acceso_escalera_cafeteria_piso1', to: 'nodo_escalera_cafeteria_BAJADA_piso1', weight: getDistanceBetweenPoints('nodo_acceso_escalera_cafeteria_piso1','nodo_escalera_cafeteria_BAJADA_piso1', nodosPlanta1) },
    { from: 'nodo_acceso_escalera_cafeteria_piso1', to: 'nodo_conexion_cafeteria_subida_escalera_1_piso1', weight: getDistanceBetweenPoints('nodo_acceso_escalera_cafeteria_piso1','nodo_conexion_cafeteria_subida_escalera_1_piso1', nodosPlanta1) },
    { from: 'nodo_conexion_cafeteria_subida_escalera_2_piso1', to: 'nodo_conexion_cafeteria_subida_escalera_1_piso1', weight: getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_2_piso1','nodo_conexion_cafeteria_subida_escalera_1_piso1', nodosPlanta1) },
    { from: 'nodo_conexion_cafeteria_subida_escalera_2_piso1', to: 'nodo_conexion_cafeteria_subida_escalera_3_piso1', weight: getDistanceBetweenPoints('nodo_conexion_cafeteria_subida_escalera_2_piso1','nodo_conexion_cafeteria_subida_escalera_3_piso1', nodosPlanta1) },
    { from: 'nodo_escalera_cafeteria_SUBIDA_piso1', to: 'nodo_conexion_cafeteria_subida_escalera_3_piso1', weight: getDistanceBetweenPoints('nodo_escalera_cafeteria_SUBIDA_piso1','nodo_conexion_cafeteria_subida_escalera_3_piso1', nodosPlanta1) },


    
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


    { from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_escalera_bloque_B_BAJADA_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_escalera_bloque_B_BAJADA_piso1', nodosPlanta1)},

    { from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_bloque_B_subida_escalera_1_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_bloque_B_subida_escalera_1_piso1', nodosPlanta1)},
    { from: 'nodo_bloque_B_subida_escalera_2_piso1', to: 'nodo_bloque_B_subida_escalera_1_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso1','nodo_bloque_B_subida_escalera_1_piso1', nodosPlanta1)},
    { from: 'nodo_bloque_B_subida_escalera_2_piso1', to: 'nodo_bloque_B_subida_escalera_3_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso1','nodo_bloque_B_subida_escalera_3_piso1', nodosPlanta1)},
    { from: 'nodo_escalera_bloque_B_SUBIDA_piso1', to: 'nodo_bloque_B_subida_escalera_3_piso1', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_B_SUBIDA_piso1','nodo_bloque_B_subida_escalera_3_piso1', nodosPlanta1)},



    { from: 'nodo_salida_escalera_bloque_B_piso1', to: 'nodo_escalera_bloque_B_BAJADA_piso1', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso1','nodo_escalera_bloque_B_BAJADA_piso1', nodosPlanta1)},




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

    { from: 'A139', to: 'A139_L1', weight: getDistanceBetweenPoints('A139','A139_L1', nodosPlanta1) },
    { from: 'A139', to: 'A139_L2', weight:  getDistanceBetweenPoints('A139','A139_L2', nodosPlanta1) },
    { from: 'A139_L1', to: 'A139_L2', weight:  getDistanceBetweenPoints('A139_L1','A139_L2', nodosPlanta1)},

    { from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_escalera_bloque_A_BAJADA_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_escalera_bloque_A_BAJADA_piso1', nodosPlanta1) },
    { from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_bloque_A_subida_escalera_1_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_bloque_A_subida_escalera_1_piso1', nodosPlanta1) },
    { from: 'nodo_bloque_A_subida_escalera_2_piso1', to: 'nodo_bloque_A_subida_escalera_1_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso1','nodo_bloque_A_subida_escalera_1_piso1', nodosPlanta1) },
    { from: 'nodo_bloque_A_subida_escalera_2_piso1', to: 'nodo_bloque_A_subida_escalera_3_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso1','nodo_bloque_A_subida_escalera_3_piso1', nodosPlanta1) },
    { from: 'nodo_bloque_A_subida_escalera_3_piso1', to: 'nodo_escalera_bloque_A_SUBIDA_piso1', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_3_piso1','nodo_escalera_bloque_A_SUBIDA_piso1', nodosPlanta1) },
    
    

    { from: 'nodo_entrada_escalera_bloque_A_norte_piso1', to: 'nodo_entrada_A130_134_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso1','nodo_entrada_A130_134_piso1', nodosPlanta1)},

    { from: 'nodo_entrada_A130_134_piso1', to: 'nodo_medio_A130_134_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','nodo_medio_A130_134_piso1', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A130_L', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A130_L', nodosPlanta1)},
    { from: 'nodo_entrada_A130_134_piso1', to: 'A130_L', weight:  getDistanceBetweenPoints('nodo_entrada_A130_134_piso1','A130_L', nodosPlanta1)},


    { from: 'nodo_medio_A130_134_piso1', to: 'A132_L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A132_L', nodosPlanta1)},
    { from: 'nodo_medio_A130_134_piso1', to: 'A133_L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A133_L', nodosPlanta1) },
    { from: 'nodo_medio_A130_134_piso1', to: 'A134_L', weight:  getDistanceBetweenPoints('nodo_medio_A130_134_piso1','A134_L', nodosPlanta1)},
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
    
    { from: 'A124_S1', to: 'A124', weight:  getDistanceBetweenPoints('A124_S1','A124', nodosPlanta1)},
    
    { from: 'nodo_entrada_A124s_norte', to: 'A124_S1', weight:  getDistanceBetweenPoints('nodo_entrada_A124s_norte','A124_S1', nodosPlanta1)},
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
    { from: 'nodo_principio_pasillo_A_norte_piso1', to: 'nodo_acceso_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_norte_piso1','nodo_acceso_escalera_principal_piso1', nodosPlanta1)},


    { from: 'nodo_escalera_principal_BAJADA_piso1', to: 'nodo_acceso_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_escalera_principal_BAJADA_piso1','nodo_acceso_escalera_principal_piso1', nodosPlanta1)},

    { from: 'nodo_conexion_principal_subida_escalera_1_piso1', to: 'nodo_acceso_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_1_piso1','nodo_acceso_escalera_principal_piso1', nodosPlanta1)},

    { from: 'nodo_conexion_principal_subida_escalera_1_piso1', to: 'nodo_conexion_principal_subida_escalera_2_piso1', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_1_piso1','nodo_conexion_principal_subida_escalera_2_piso1', nodosPlanta1)},
    { from: 'nodo_conexion_principal_subida_escalera_3_piso1', to: 'nodo_conexion_principal_subida_escalera_2_piso1', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_3_piso1','nodo_conexion_principal_subida_escalera_2_piso1', nodosPlanta1)},
    { from: 'nodo_conexion_principal_subida_escalera_3_piso1', to: 'nodo_escalera_principal_SUBIDA_piso1', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_3_piso1','nodo_escalera_principal_SUBIDA_piso1', nodosPlanta1)},



    { from: 'nodo_escaleras_terraza_BAJADA_piso1', to: 'nodo_conexion_terraza_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_escaleras_terraza_BAJADA_piso1','nodo_conexion_terraza_subida_escalera_2_piso1', nodosPlanta1) },

    { from: 'nodo_conexion_terraza_subida_escalera_3_piso1', to: 'nodo_conexion_terraza_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_3_piso1','nodo_conexion_terraza_subida_escalera_2_piso1', nodosPlanta1) },

    { from: 'nodo_conexion_terraza_subida_escalera_3_piso1', to: 'nodo_escaleras_terraza_SUBIDA_piso1', weight: getDistanceBetweenPoints('nodo_conexion_terraza_subida_escalera_3_piso1','nodo_escaleras_terraza_SUBIDA_piso1', nodosPlanta1) },





    { from: 'nodo_entrada_escaleras_terraza_piso1', to: 'nodo_conexion_terraza_subida_escalera_2_piso1', weight: getDistanceBetweenPoints('nodo_entrada_escaleras_terraza_piso1','nodo_conexion_terraza_subida_escalera_2_piso1', nodosPlanta1) },
    { from: 'nodo_entrada_escaleras_terraza_piso1', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escaleras_terraza_piso1','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1) },

    { from: 'nodo_entrada_escalera_principal_piso1', to: 'nodo_secretaria', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso1','nodo_secretaria', nodosPlanta1)},
    { from: 'nodo_entrada_escalera_principal_piso1', to: 'nodo_acceso_escalera_principal_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso1','nodo_acceso_escalera_principal_piso1', nodosPlanta1)},


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

    { from: 'nodo_conserjeria', to: 'oficina_de_practicas', weight:  getDistanceBetweenPoints('nodo_conserjeria','oficina_de_practicas', nodosPlanta1)},

    { from: 'nodo_entrada_despachos_A115', to: 'nodo_principio_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','nodo_principio_pasillo_A_sur_piso1', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'A115', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A115', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'A114', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A114', nodosPlanta1) },
    { from: 'nodo_entrada_despachos_A115', to: 'A11', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A11', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'A112_L', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A112_L', nodosPlanta1) },
    { from: 'nodo_entrada_despachos_A115', to: 'A12', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','A12', nodosPlanta1)},
    { from: 'nodo_entrada_despachos_A115', to: 'nodo_mitad_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A115','nodo_mitad_pasillo_A_sur_piso1', nodosPlanta1)},

    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A114', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A114', nodosPlanta1) },
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A11', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A11', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A112_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A112_L', nodosPlanta1) },
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A12', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A12', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A13', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A13', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A110_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A110_L', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A108_L', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A108_L', nodosPlanta1) },
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A14', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A14', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'A15', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','A15', nodosPlanta1)},
    { from: 'nodo_mitad_pasillo_A_sur_piso1', to: 'nodo_final_pasillo_A_sur_piso1', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso1','nodo_final_pasillo_A_sur_piso1', nodosPlanta1)},

    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A13', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A13', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A110_L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A110_L', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A108_L', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A108_L', nodosPlanta1) },
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A14', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A14', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A15', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A15', nodosPlanta1)},
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A16', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A16', nodosPlanta1) },
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'A17', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','A17', nodosPlanta1) },
    { from: 'nodo_final_pasillo_A_sur_piso1', to: 'nodo_entrada_escalera_cafeteria_piso1', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_sur_piso1','nodo_entrada_escalera_cafeteria_piso1', nodosPlanta1) },
  
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'A16', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','A16', nodosPlanta1)},
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'A17', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','A17', nodosPlanta1) },
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'nodo_acceso_escalera_cafeteria_piso1', weight: getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','nodo_acceso_escalera_cafeteria_piso1', nodosPlanta1) },
    { from: 'nodo_entrada_escalera_cafeteria_piso1', to: 'cafeteria', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso1','cafeteria', nodosPlanta1) },

    { from: 'cafeteria', to: 'comedor', weight:  getDistanceBetweenPoints('cafeteria','comedor', nodosPlanta1)},
    { from: 'cafeteria', to: 'nodo_acceso_escalera_cafeteria_piso1', weight: getDistanceBetweenPoints('cafeteria','nodo_acceso_escalera_cafeteria_piso1', nodosPlanta1) }, 
   


    { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_escalera_bloque_C_SUBIDA_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_escalera_bloque_C_SUBIDA_piso1', nodosPlanta1)},
  
    { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_escalera_bloque_C_BAJADA_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_escalera_bloque_C_BAJADA_piso1', nodosPlanta1)},
  




    { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_bloque_C_norte_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_bloque_C_norte_piso1', nodosPlanta1)},
    { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C102', weight: getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C102', nodosPlanta1) },
    { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C103', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C103', nodosPlanta1)},
    { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C104', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C104', nodosPlanta1)},
    { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C105', weight: getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C105', nodosPlanta1) },
    { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C106', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C106', nodosPlanta1)},
    { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_bloque_C_sur_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_bloque_C_sur_piso1', nodosPlanta1)},

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
    { id: 'A239_L', latlng: [519.98622, 641.184082], name: 'Lab de química general' },
    { id: 'B241_L', latlng: [651.42291, 696.436035],  name: 'Lab de regulación de control y procesos químicos' },
    { id: 'A224_L', latlng: [292.785542, 565.447754], name: 'Lab de termodinámica y transmisión de calor' },
    { id: 'A215_L', latlng: [155.539847, 738.46936], name: 'Lab de óptica' },
    { id: 'A211_L', latlng: [157.309326, 622.9375], name: 'Lab de ampliación de física' },
    { id: 'A210_L', latlng: [156.923126, 547.334473], name: 'Lab de física I y II' },
    { id: 'A202_L', latlng: [168.643652, 314.407227], name: 'Lab de electrónica IV' },
   
   
    
    //despachos
    { id: 'A238_2', latlng: [534.286595, 714.094238], name: 'Despacho A 238-2' },
    { id: 'A238_1', latlng: [517.704865, 711.609619],  name: 'Despacho A 238-1' },
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
    { id: 'A222_1', latlng: [250.209498, 686.313721], name: 'Despacho A 222-1' },
    { id: 'A222_2', latlng: [231.16316, 685.049805],  name: 'Despacho A 222-2' },
    { id: 'A222_3', latlng: [215.036364, 685.549805],  name: 'Despacho A 222-3' },
    { id: 'A220', latlng: [155.296359, 753.510254],  name: 'Despacho A 220' },
    { id: 'A219', latlng: [143.661853, 757.507324], name: 'Despacho A 219' },
    { id: 'A218', latlng: [136.643023, 760.316162],  name: 'Despacho A 218' },
    { id: 'A217', latlng: [130.079792, 757.128662],  name: 'Despacho A 217' },
    { id: 'sala_de_juntas', latlng: [135.138353, 739.109863], name: 'Sala de juntas' },
    { id: 'A214', latlng: [184.371402, 676.971069],  name: 'Despacho A 214' },
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
    { id: 'A208_S', latlng: [167.634788, 428.62793],  name: 'Sala de informática de libre acceso' },
    { id: 'servicios_informaticos', latlng: [167.634788, 346.12793],  name: 'servicios informaticos' },
    { id: 'B21', latlng: [667.113303, 643.226318],  name: 'B21' },
    { id: 'B22', latlng: [678.051158, 562.976318],  name: 'B22' },

    // //Otros
    { id: 'salon_de_actos', latlng: [173.231738, 304.901367],  name: 'Salón de actos' },
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
    { id: 'nodo_sala_juntas_norte', latlng: [155.275226, 746.365234],  name: 'nodo sala juntas norte' },
    { id: 'nodo_sala_juntas_sur', latlng: [137.224901, 748.585938],  name: 'nodo sala juntas sur' },
    { id: 'nodo_entrada_terrza_izq', latlng: [178.488698, 431.75],  name: 'nodo entrada terr izq' },
    



    { id: 'nodo_bloque_A_subida_escalera_3_piso2', latlng: [487.768538, 734.208008],  name: 'nodo bloque A subida escaleras 3 piso 2' },
    { id: 'nodo_bloque_A_subida_escalera_2_piso2', latlng: [464.515949, 735.458008],  name: 'nodo bloque A subida escaleras 2 piso 2' },
    { id: 'nodo_bloque_A_subida_escalera_1_piso2', latlng: [464.631283, 726.875488],  name: 'nodo escalera bloque A subida 1 piso 2' },
    
    { id: 'nodo_bloque_B_subida_escalera_3_piso2', latlng: [689.061094, 664.0625],  name: 'nodo bloque B subida escaleras 3 piso 2' },
    { id: 'nodo_bloque_B_subida_escalera_2_piso2', latlng: [689.123601, 676.75],  name: 'nodo bloque B subida escaleras 2 piso 2' },
    { id: 'nodo_bloque_B_subida_escalera_1_piso2', latlng: [668.371291, 676.8125],  name: 'nodo escalera bloque B subida 1 piso 2' },

    { id: 'nodo_conexion_entrada_subida_escalera_3_piso2', latlng: [97.54338, 662.842773],  name: 'nodo esclaera entrada subida escaleras 3 piso 2' },
    { id: 'nodo_conexion_entrada_subida_escalera_2_piso2', latlng: [97.418366, 672.717773],  name: 'nodo escalera entrada subida escaleras 2 piso 2' },
    { id: 'nodo_conexion_entrada_subida_escalera_1_piso2', latlng: [105.856806, 673.124023],  name: 'nodo escalera entrada subida 1 piso 2' },


    { id: 'nodo_conexion_principal_subida_escalera_3_piso2', latlng: [272.00574, 725.628906],  name: 'nodo esclaera principal subida escaleras 3 piso 2' },
    { id: 'nodo_conexion_principal_subida_escalera_2_piso2', latlng: [272.00574, 746.128906],  name: 'nodo escalera principal subida escaleras 2 piso 2' },
    { id: 'nodo_conexion_principal_subida_escalera_1_piso2', latlng: [246.750762, 746.003906],  name: 'nodo escalera principal subida escaleras 1 piso 2' },
   




    { id: 'nodo_subida_escalera_bloque_B_secundaria_3_piso2', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B subida escalera secundaria 3 piso 2' },
    { id: 'nodo_subida_escalera_bloque_B_secundaria_2_piso2', latlng: [612.911046, 493.994629],  name: 'nodo escalera bloque B subida escalera secundaria 2 piso 2' },
    { id: 'nodo_subida_escalera_bloque_B_secundaria_1_piso2', latlng: [634.538454, 493.994629],  name: 'nodo escalera bloque B subida escalera secundaria 1 piso 2' },
    

    { id: 'nodo_acceso_escalera_entrada_piso2', latlng: [117.650747, 671.258235],  name: 'nodo escalera entrada piso 2' },
        
    

    // //ascensores y/o escaleras
    { id: 'nodo_escalera_cafeteria_piso2', latlng: [186.265582, 313.687988],  name: 'nodo escalera cafeteria piso 2' },
    { id: 'nodo_escaleras_terraza_piso2', latlng: [235.829556, 644.754883], name: 'nodo escaleras terraza piso 2' },
     { id: 'nodo_escalera_bloque_C_piso2', latlng: [417.468578, 414.744141],  name: 'nodo escalera bloque C piso 2' },
    

    { id: 'nodo_escalera_principal_SUBIDA_piso2', latlng: [272.00574, 725.628906],  name: 'nodo escalera principal subida piso 2' },
        { id: 'nodo_escalera_principal_BAJADA_piso2', latlng: [247.773326, 726.43457],  name: 'nodo escalera principal bajada piso 2' },
       
        { id: 'nodo_escalera_entrada_SUBIDA_piso2', latlng: [97.54338, 662.842773],  name: 'nodo escalera entrada subida piso 2' },
        { id: 'nodo_escalera_entrada_BAJADA_piso2', latlng: [110.607335, 663.499023],  name: 'nodo escalera entrada subida piso 2' },
        
        
        { id: 'nodo_escalera_bloque_A_SUBIDA_piso2', latlng: [487.768538, 734.208008],  name: 'nodo escalera bloque A subida piso 2' },
        { id: 'nodo_escalera_bloque_A_BAJADA_piso2', latlng: [486.768427, 718.458008],  name: 'nodo escalera bloque A subida piso 2' },


        { id: 'nodo_escalera_bloque_B_SUBIDA_piso2', latlng: [689.061094, 664.0625],  name: 'nodo escalera bloque B piso 2' },

        { id: 'nodo_escalera_bloque_B_BAJADA_piso2', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso 2' },


       { id: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso2', latlng: [614.016403, 484.71582],  name: 'nodo escalera bloque B segundaria' },
       { id: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso2', latlng: [630.404609, 484.193359],  name: 'nodo escalera bloque B segundaria' },


]
 


const edgesPlanta2 = [
    { from: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso2', to: 'nodo_entrada_escalera_secundaria_piso2', weight: getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_BAJADA_piso2','nodo_entrada_escalera_secundaria_piso2', nodosPlanta2) },


    { from: 'nodo_subida_escalera_bloque_B_secundaria_1_piso2', to: 'nodo_entrada_escalera_secundaria_piso2', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_1_piso2','nodo_entrada_escalera_secundaria_piso2', nodosPlanta2) },

    { from: 'nodo_subida_escalera_bloque_B_secundaria_1_piso2', to: 'nodo_subida_escalera_bloque_B_secundaria_2_piso2', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_1_piso2','nodo_subida_escalera_bloque_B_secundaria_2_piso2', nodosPlanta2) },

    { from: 'nodo_subida_escalera_bloque_B_secundaria_3_piso2', to: 'nodo_subida_escalera_bloque_B_secundaria_2_piso2', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_3_piso2','nodo_subida_escalera_bloque_B_secundaria_2_piso2', nodosPlanta2) },

    { from: 'nodo_subida_escalera_bloque_B_secundaria_3_piso2', to: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso2', weight: getDistanceBetweenPoints('nodo_subida_escalera_bloque_B_secundaria_3_piso2','nodo_escalera_bloque_B_secundaria_SUBIDA_piso2', nodosPlanta2) },



    { from: 'nodo_entrada_despacho_B249', to: 'nodo_entrada_escalera_secundaria_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B249','nodo_entrada_escalera_secundaria_piso2', nodosPlanta2)  },
    { from: 'nodo_entrada_despacho_B249', to: 'B249', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B249','B249', nodosPlanta2) },
    { from: 'nodo_entrada_despacho_B249', to: 'B248', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B249','B248', nodosPlanta2)},
    { from: 'nodo_entrada_despacho_B249', to: 'nodo_entrada_despacho_B248', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B249','nodo_entrada_despacho_B248', nodosPlanta2) },

    { from: 'nodo_entrada_despacho_B248', to: 'B248', weight: getDistanceBetweenPoints('nodo_entrada_despacho_B248','B248', nodosPlanta2) },
    { from: 'nodo_entrada_despacho_B248', to: 'B22', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B248','B22', nodosPlanta2) },
    { from: 'nodo_entrada_despacho_B248', to: 'nodo_pasillo_B21_B22', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B248','nodo_pasillo_B21_B22', nodosPlanta2)},
    
    { from: 'nodo_pasillo_B21_B22', to: 'B22', weight:  getDistanceBetweenPoints('nodo_pasillo_B21_B22','B22', nodosPlanta2)},
    { from: 'nodo_pasillo_B21_B22', to: 'B21', weight:  getDistanceBetweenPoints('nodo_pasillo_B21_B22','B21', nodosPlanta2) },
    { from: 'nodo_pasillo_B21_B22', to: 'nodo_B21_aseos', weight:  getDistanceBetweenPoints('nodo_pasillo_B21_B22','nodo_B21_aseos', nodosPlanta2) },
    
    { from: 'nodo_B21_aseos', to: 'B21', weight: getDistanceBetweenPoints('nodo_B21_aseos','B21', nodosPlanta2) },
    { from: 'nodo_B21_aseos', to: 'nodo_salida_escalera_bloque_B_piso2', weight:  getDistanceBetweenPoints('nodo_B21_aseos','nodo_salida_escalera_bloque_B_piso2', nodosPlanta2) },

    { from: 'nodo_salida_escalera_bloque_B_piso2', to: 'nodo_bloque_B_subida_escalera_1_piso2', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso2','nodo_bloque_B_subida_escalera_1_piso2', nodosPlanta2)},

    { from: 'nodo_bloque_B_subida_escalera_2_piso2', to: 'nodo_bloque_B_subida_escalera_1_piso2', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso2','nodo_bloque_B_subida_escalera_1_piso2', nodosPlanta2)},

    { from: 'nodo_bloque_B_subida_escalera_2_piso2', to: 'nodo_bloque_B_subida_escalera_3_piso2', weight:  getDistanceBetweenPoints('nodo_bloque_B_subida_escalera_2_piso2','nodo_bloque_B_subida_escalera_3_piso2', nodosPlanta2)},


    { from: 'nodo_escalera_bloque_B_SUBIDA_piso2', to: 'nodo_bloque_B_subida_escalera_3_piso2', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_B_SUBIDA_piso2','nodo_bloque_B_subida_escalera_3_piso2', nodosPlanta2)},


    { from: 'nodo_salida_escalera_bloque_B_piso2', to: 'nodo_escalera_bloque_B_BAJADA_piso2', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso2','nodo_escalera_bloque_B_BAJADA_piso2', nodosPlanta2)},


    { from: 'nodo_salida_escalera_bloque_B_piso2', to: 'B241_L', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso2','B241_L', nodosPlanta2)},
    { from: 'nodo_salida_escalera_bloque_B_piso2', to: 'nodo_principio_pasillo_B_piso2', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso2','nodo_principio_pasillo_B_piso2', nodosPlanta2)},

    { from: 'nodo_principio_pasillo_B_piso2', to: 'B241_L', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B_piso2','B241_L', nodosPlanta2) },
    { from: 'nodo_principio_pasillo_B_piso2', to: 'nodo_final_pasillo_A_norte_piso2', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B_piso2','nodo_final_pasillo_A_norte_piso2', nodosPlanta2) },

    { from: 'nodo_final_pasillo_A_norte_piso2', to: 'A238_2', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso2','A238_2', nodosPlanta2)},
    { from: 'nodo_final_pasillo_A_norte_piso2', to: 'A238_1', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso2','A238_1', nodosPlanta2)},
    { from: 'nodo_final_pasillo_A_norte_piso2', to: 'nodo_entrada_A239s_norte', weight: getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso2','nodo_entrada_A239s_norte', nodosPlanta2) },
    
    { from: 'nodo_entrada_A239s_norte', to: 'A238_2', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','A238_2', nodosPlanta2) },
    { from: 'nodo_entrada_A239s_norte', to: 'A238_1', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','A238_1', nodosPlanta2)},
    { from: 'nodo_entrada_A239s_norte', to: 'A238', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','A238', nodosPlanta2)},
    { from: 'nodo_entrada_A239s_norte', to: 'A239', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','A239', nodosPlanta2)},
    { from: 'nodo_entrada_A239s_norte', to: 'nodo_entrada_escalera_bloque_A_norte_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_A239s_norte','nodo_entrada_escalera_bloque_A_norte_piso2', nodosPlanta2)},

    { from: 'A239_L', to: 'A239', weight:  getDistanceBetweenPoints('A239_L','A239', nodosPlanta2)},
    

    { from: 'nodo_entrada_escalera_bloque_A_norte_piso2', to: 'nodo_escalera_bloque_A_BAJADA_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso2','nodo_escalera_bloque_A_BAJADA_piso2', nodosPlanta2) },

    { from: 'nodo_entrada_escalera_bloque_A_norte_piso2', to: 'nodo_bloque_A_subida_escalera_1_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso2','nodo_bloque_A_subida_escalera_1_piso2', nodosPlanta2) },

    { from: 'nodo_bloque_A_subida_escalera_2_piso2', to: 'nodo_bloque_A_subida_escalera_1_piso2', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso2','nodo_bloque_A_subida_escalera_1_piso2', nodosPlanta2) },

    { from: 'nodo_bloque_A_subida_escalera_2_piso2', to: 'nodo_bloque_A_subida_escalera_3_piso2', weight:  getDistanceBetweenPoints('nodo_bloque_A_subida_escalera_2_piso2','nodo_bloque_A_subida_escalera_3_piso2', nodosPlanta2) },

    { from: 'nodo_escalera_bloque_A_SUBIDA_piso2', to: 'nodo_bloque_A_subida_escalera_3_piso2', weight:  getDistanceBetweenPoints('nodo_escalera_bloque_A_SUBIDA_piso2','nodo_bloque_A_subida_escalera_3_piso2', nodosPlanta2) },






    { from: 'nodo_entrada_escalera_bloque_A_norte_piso2', to: 'A238', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso2','A238', nodosPlanta2)},
    { from: 'nodo_entrada_escalera_bloque_A_norte_piso2', to: 'nodo_entrada_A21_A22_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso2','nodo_entrada_A21_A22_piso2', nodosPlanta2)},

    { from: 'A22', to: 'A21', weight:  getDistanceBetweenPoints('A22','A21', nodosPlanta2)},

    { from: 'nodo_entrada_A21_A22_piso2', to: 'A21', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','A21', nodosPlanta2)},
    { from: 'nodo_entrada_A21_A22_piso2', to: 'A22', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','A22', nodosPlanta2)},
    { from: 'nodo_entrada_A21_A22_piso2', to: 'A233', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','A233', nodosPlanta2)},
    { from: 'nodo_entrada_A21_A22_piso2', to: 'A232', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','A232', nodosPlanta2)},
    { from: 'nodo_entrada_A21_A22_piso2', to: 'nodo_mitad_pasillo_A_norte_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_A21_A22_piso2','nodo_mitad_pasillo_A_norte_piso2', nodosPlanta2)},



    { from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A233', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A233', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A232', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A232', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A231', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A231', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A230', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A230', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A229', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A229', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A228', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A228', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'A227', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','A227', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'ADI2', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','ADI2', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_norte_piso2', to: 'nodo_entrada_A224s', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_norte_piso2','nodo_entrada_A224s', nodosPlanta2)},


    { from: 'nodo_entrada_A224s', to: 'A231', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A231', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'A230', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A230', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'A229', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A229', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'A228', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A228', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'A227', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A227', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'ADI2', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','ADI2', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'A224', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A224', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'A23', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A23', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'A225', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A225', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'A224_L', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','A224_L', nodosPlanta2)},
    { from: 'nodo_entrada_A224s', to: 'nodo_entrada_despachos_A222s', weight:  getDistanceBetweenPoints('nodo_entrada_A224s','nodo_entrada_despachos_A222s', nodosPlanta2)},

    { from: 'A224_L', to: 'A225', weight:  getDistanceBetweenPoints('A224_L','A225', nodosPlanta2)},
    { from: 'A224_L', to: 'A224', weight:  getDistanceBetweenPoints('A224_L','A224', nodosPlanta2)},

    { from: 'A224', to: 'A23', weight:  getDistanceBetweenPoints('A224','A23', nodosPlanta2)},

    { from: 'nodo_entrada_despachos_A222s', to: 'A222_1', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A222s','A222_1', nodosPlanta2)},
    { from: 'nodo_entrada_despachos_A222s', to: 'nodo_entrada_escalera_principal_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A222s','nodo_entrada_escalera_principal_piso2', nodosPlanta2)},
    { from: 'nodo_entrada_despachos_A222s', to: 'nodo_principio_pasillo_A_sur_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_despachos_A222s','nodo_principio_pasillo_A_sur_piso2', nodosPlanta2)},

    { from: 'nodo_entrada_escalera_principal_piso2', to: 'nodo_escalera_principal_BAJADA_piso2', weight: getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso2','nodo_escalera_principal_BAJADA_piso2', nodosPlanta2) },


    { from: 'nodo_entrada_escalera_principal_piso2', to: 'nodo_conexion_principal_subida_escalera_1_piso2', weight: getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso2','nodo_conexion_principal_subida_escalera_1_piso2', nodosPlanta2) },

    { from: 'nodo_conexion_principal_subida_escalera_2_piso2', to: 'nodo_conexion_principal_subida_escalera_1_piso2', weight: getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_2_piso2','nodo_conexion_principal_subida_escalera_1_piso2', nodosPlanta2) },

    { from: 'nodo_conexion_principal_subida_escalera_2_piso2', to: 'nodo_conexion_principal_subida_escalera_3_piso2', weight: getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_2_piso2','nodo_conexion_principal_subida_escalera_3_piso2', nodosPlanta2) },
    
    { from: 'nodo_escalera_principal_SUBIDA_piso2', to: 'nodo_conexion_principal_subida_escalera_3_piso2', weight: getDistanceBetweenPoints('nodo_escalera_principal_SUBIDA_piso2','nodo_conexion_principal_subida_escalera_3_piso2', nodosPlanta2) },
    
    



    { from: 'nodo_entrada_escalera_principal_piso2', to: 'nodo_entrada_juntas', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso2','nodo_entrada_juntas', nodosPlanta2) },
    { from: 'nodo_entrada_escalera_principal_piso2', to: 'nodo_principio_pasillo_A_sur_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso2','nodo_principio_pasillo_A_sur_piso2', nodosPlanta2) },

    { from: 'A222_1', to: 'A222_2', weight:  getDistanceBetweenPoints('A222_1','A222_2', nodosPlanta2)},
    { from: 'A222_2', to: 'A222_3', weight:  getDistanceBetweenPoints('A222_2','A222_3', nodosPlanta2)},

    { from: 'nodo_sala_juntas_norte', to: 'nodo_entrada_juntas', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','nodo_entrada_juntas', nodosPlanta2) },
    { from: 'nodo_sala_juntas_norte', to: 'A215_L', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','A215_L', nodosPlanta2) },
    { from: 'nodo_sala_juntas_norte', to: 'A220', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','A220', nodosPlanta2)},
    { from: 'nodo_sala_juntas_norte', to: 'sala_de_juntas', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','sala_de_juntas', nodosPlanta2)},
    { from: 'nodo_sala_juntas_norte', to: 'nodo_sala_juntas_sur', weight:  getDistanceBetweenPoints('nodo_sala_juntas_norte','nodo_sala_juntas_sur', nodosPlanta2)},


    { from: 'nodo_sala_juntas_sur', to: 'A219', weight:  getDistanceBetweenPoints('nodo_sala_juntas_sur','A219', nodosPlanta2)},
    { from: 'nodo_sala_juntas_sur', to: 'A218', weight:  getDistanceBetweenPoints('nodo_sala_juntas_sur','A218', nodosPlanta2) },
    { from: 'nodo_sala_juntas_sur', to: 'A217', weight:  getDistanceBetweenPoints('nodo_sala_juntas_sur','A217', nodosPlanta2)},
    { from: 'nodo_sala_juntas_sur', to: 'sala_de_juntas', weight:  getDistanceBetweenPoints('nodo_sala_juntas_sur','sala_de_juntas', nodosPlanta2)},

    { from: 'nodo_principio_pasillo_A_sur_piso2', to: 'nodo_entrada_juntas', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso2','nodo_entrada_juntas', nodosPlanta2) },
    { from: 'nodo_principio_pasillo_A_sur_piso2', to: 'A214', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso2','A214', nodosPlanta2)},
    { from: 'nodo_principio_pasillo_A_sur_piso2', to: 'nodo_pasillo_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso2','nodo_pasillo_escalera_entrada_piso2', nodosPlanta2)},

    { from: 'nodo_pasillo_escalera_entrada_piso2', to: 'A214', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso2','A214', nodosPlanta2)},
    { from: 'nodo_pasillo_escalera_entrada_piso2', to: 'nodo_entrada_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso2','nodo_entrada_escalera_entrada_piso2', nodosPlanta2)},
    { from: 'nodo_pasillo_escalera_entrada_piso2', to: 'nodo_entrada_A211s', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso2','nodo_entrada_A211s', nodosPlanta2) },
    { from: 'nodo_pasillo_escalera_entrada_piso2', to: 'nodo_entrada_dcha_terraza', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso2','nodo_entrada_dcha_terraza', nodosPlanta2)},

    { from: 'nodo_entrada_escalera_entrada_piso2', to: 'nodo_acceso_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_entrada_piso2','nodo_acceso_escalera_entrada_piso2', nodosPlanta2) },

    { from: 'nodo_escalera_entrada_BAJADA_piso2', to: 'nodo_acceso_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_escalera_entrada_BAJADA_piso2','nodo_acceso_escalera_entrada_piso2', nodosPlanta2) },

    { from: 'nodo_conexion_entrada_subida_escalera_1_piso2', to: 'nodo_acceso_escalera_entrada_piso2', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso2','nodo_acceso_escalera_entrada_piso2', nodosPlanta2) },

    { from: 'nodo_conexion_entrada_subida_escalera_1_piso2', to: 'nodo_conexion_entrada_subida_escalera_2_piso2', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso2','nodo_conexion_entrada_subida_escalera_2_piso2', nodosPlanta2) },

    { from: 'nodo_conexion_entrada_subida_escalera_3_piso2', to: 'nodo_conexion_entrada_subida_escalera_2_piso2', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso2','nodo_conexion_entrada_subida_escalera_2_piso2', nodosPlanta2) },

    { from: 'nodo_conexion_entrada_subida_escalera_3_piso2', to: 'nodo_escalera_entrada_SUBIDA_piso2', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso2','nodo_escalera_entrada_SUBIDA_piso2', nodosPlanta2) },





    { from: 'nodo_entrada_A211s', to: 'nodo_entrada_dcha_terraza', weight:  getDistanceBetweenPoints('nodo_entrada_A211s','nodo_entrada_dcha_terraza', nodosPlanta2) },
    { from: 'nodo_entrada_A211s', to: 'A211', weight:  getDistanceBetweenPoints('nodo_entrada_A211s','A211', nodosPlanta2)},
    { from: 'nodo_entrada_A211s', to: 'A211_L', weight:  getDistanceBetweenPoints('nodo_entrada_A211s','A211_L', nodosPlanta2)},
    { from: 'nodo_entrada_A211s', to: 'nodo_entrada_A210s', weight:  getDistanceBetweenPoints('nodo_entrada_A211s','nodo_entrada_A210s', nodosPlanta2)},

    { from: 'nodo_entrada_A210s', to: 'A210_L', weight:  getDistanceBetweenPoints('nodo_entrada_A210s','A210_L', nodosPlanta2) },
    { from: 'nodo_entrada_A210s', to: 'nodo_mitad_pasillo_A_sur_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_A210s','nodo_mitad_pasillo_A_sur_piso2', nodosPlanta2)},
    { from: 'nodo_entrada_A210s', to: 'nodo_entrada_medio_terraza', weight:  getDistanceBetweenPoints('nodo_entrada_A210s','nodo_entrada_medio_terraza', nodosPlanta2) },

    { from: 'A210', to: 'A210_L', weight:  getDistanceBetweenPoints('A210','A210_L', nodosPlanta2)},

    { from: 'nodo_mitad_pasillo_A_sur_piso2', to: 'nodo_entrada_medio_terraza', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso2','nodo_entrada_medio_terraza', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_sur_piso2', to: 'ADI1', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso2','ADI1', nodosPlanta2)},
    { from: 'nodo_mitad_pasillo_A_sur_piso2', to: 'A208_S', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso2','A208_S', nodosPlanta2) },
    { from: 'nodo_mitad_pasillo_A_sur_piso2', to: 'nodo_entrada_terrza_izq', weight:  getDistanceBetweenPoints('nodo_mitad_pasillo_A_sur_piso2','nodo_entrada_terrza_izq', nodosPlanta2)},
   
    { from: 'nodo_entrada_terrza_izq', to: 'nodo_acceso_bloque_C_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_terrza_izq','nodo_acceso_bloque_C_piso2', nodosPlanta2)},
    { from: 'nodo_entrada_terrza_izq', to: 'A208_S', weight:  getDistanceBetweenPoints('nodo_entrada_terrza_izq','A208_S', nodosPlanta2)},
    { from: 'nodo_entrada_terrza_izq', to: 'nodo_entrada_izq_terraza', weight:  getDistanceBetweenPoints('nodo_entrada_terrza_izq','nodo_entrada_izq_terraza', nodosPlanta2)},
    { from: 'nodo_entrada_terrza_izq', to: 'ADI1', weight:  getDistanceBetweenPoints('nodo_entrada_terrza_izq','ADI1', nodosPlanta2)},

    { from: 'nodo_acceso_bloque_C_piso2', to: 'A206', weight:  getDistanceBetweenPoints('nodo_acceso_bloque_C_piso2','A206', nodosPlanta2) },
    { from: 'nodo_acceso_bloque_C_piso2', to: 'servicios_informaticos', weight:  getDistanceBetweenPoints('nodo_acceso_bloque_C_piso2','servicios_informaticos', nodosPlanta2)},
    { from: 'nodo_acceso_bloque_C_piso2', to: 'nodo_entrada_escalera_cafeteria_piso2', weight:  getDistanceBetweenPoints('nodo_acceso_bloque_C_piso2','nodo_entrada_escalera_cafeteria_piso2', nodosPlanta2)},

    { from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'A202_L', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','A202_L', nodosPlanta2) },
    { from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'salon_de_actos', weight: getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','salon_de_actos', nodosPlanta2) },
    { from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'nodo_escalera_cafeteria_piso2', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','nodo_escalera_cafeteria_piso2', nodosPlanta2) },
    { from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'servicios_informaticos', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','servicios_informaticos', nodosPlanta2) },
    { from: 'nodo_entrada_escalera_cafeteria_piso2', to: 'A206', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_cafeteria_piso2','A206', nodosPlanta2) },
  

    { from: 'terraza', to: 'nodo_terraza_dcha', weight:  getDistanceBetweenPoints('terraza','nodo_terraza_dcha', nodosPlanta2)},
    { from: 'terraza', to: 'nodo_entrada_dcha_terraza', weight:  getDistanceBetweenPoints('terraza','nodo_entrada_dcha_terraza', nodosPlanta2) },
    { from: 'terraza', to: 'nodo_entrada_medio_terraza', weight: getDistanceBetweenPoints('terraza','nodo_entrada_medio_terraza', nodosPlanta2) },
    { from: 'terraza', to: 'nodo_entrada_izq_terraza', weight:  getDistanceBetweenPoints('terraza','nodo_entrada_izq_terraza', nodosPlanta2) },

    { from: 'nodo_terraza_dcha', to: 'nodo_escaleras_terraza_piso2', weight:  getDistanceBetweenPoints('nodo_terraza_dcha','nodo_escaleras_terraza_piso2', nodosPlanta2)},
    { from: 'nodo_terraza_dcha', to: 'nodo_entrada_dcha_terraza', weight: getDistanceBetweenPoints('nodo_terraza_dcha','nodo_entrada_dcha_terraza', nodosPlanta2) }, 
   
    { from: 'nodo_acceso_bloque_C_piso2', to: 'nodo_pasillo_acceso_bloque_C_piso2', weight: getDistanceBetweenPoints('nodo_acceso_bloque_C_piso2','nodo_pasillo_acceso_bloque_C_piso2', nodosPlanta2) }, 

    { from: 'nodo_entrada_bloque_C_piso2', to: 'nodo_pasillo_acceso_bloque_C_piso2', weight: getDistanceBetweenPoints('nodo_entrada_bloque_C_piso2','nodo_pasillo_acceso_bloque_C_piso2', nodosPlanta2) }, 
    { from: 'nodo_entrada_bloque_C_piso2', to: 'nodo_escalera_bloque_C_piso2', weight: getDistanceBetweenPoints('nodo_entrada_bloque_C_piso2','nodo_escalera_bloque_C_piso2', nodosPlanta2) }, 


   
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_bloque_C_norte_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_bloque_C_norte_piso1', nodosPlanta2)},
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C102', weight: getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C102', nodosPlanta2) },
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C103', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C103', nodosPlanta2)},
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C104', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C104', nodosPlanta2)},
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C105', weight: getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C105', nodosPlanta2) },
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'C106', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','C106', nodosPlanta2)},
//     { from: 'nodo_acceso_escalera_bloque_C_piso1', to: 'nodo_bloque_C_sur_piso1', weight:  getDistanceBetweenPoints('nodo_acceso_escalera_bloque_C_piso1','nodo_bloque_C_sur_piso1', nodosPlanta2)},

//     { from: 'nodo_bloque_C_sur_piso1', to: 'C106', weight: getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C106', nodosPlanta2) },
//     { from: 'nodo_bloque_C_sur_piso1', to: 'C107', weight:  getDistanceBetweenPoints('nodo_bloque_C_sur_piso1','C107', nodosPlanta2)},

]



todasLasPlantas.planta2 = {}
todasLasPlantas.planta2.nodes = nodosPlanta2
todasLasPlantas.planta2.edges = edgesPlanta2


const nodosPlanta3=[
    //laboratorios
    { id: 'A324_L', latlng: [518.278894, 630.256348], name: 'Lab de teoría de mécanismos síntesis y simulación de mecanismos diseño de máquinas' },
    { id: 'EG1_EG2', latlng: [304.180516, 700.112305],  name: 'EG1 y EG2' },
    { id: 'EG3', latlng: [398.359364, 623.891602],  name: 'EG3' },
    { id: 'EG4', latlng: [399.359475, 690.891602],  name: 'EG4' },
    { id: 'A309_L', latlng: [233.663438, 700.424805], name: 'Lab de fabricación aditiva y digitalización industrial' },
    { id: 'A305_L', latlng: [182.020584, 744.163086], name: 'Ecolab' },
    { id: 'A303_L', latlng: [166.41582, 691.514648], name: 'Lab de ampliación de física' },
    { id: 'ADIpi', latlng: [165.915764, 737.014648], name: 'ADI π' },

    //despachos
    { id: 'B335', latlng: [669.466776, 499.614746], name: 'Despacho B 335' },
    { id: 'B336', latlng: [642.088727, 507.364746],  name: 'Despacho B 336' },
    { id: 'B328_S', latlng: [651.42291, 696.436035],  name: 'Sala polivalente' },
    { id: 'A326', latlng: [517.704865, 711.609619],  name: 'Despacho A 326' },
    { id: 'A325', latlng: [501.140521, 711.797119],  name: 'Despacho A 325' },
    { id: 'A324', latlng: [519.534953, 686.983398],  name: 'Despacho A 324' },
    { id: 'A324_S', latlng: [523.343417, 669.117676],  name: 'Sala de reuniones' },
    { id: 'A320', latlng: [392.693092, 713.761475],  name: 'Despacho A 320' },
    { id: 'A318', latlng: [398.376037, 638.788574],  name: 'Sala de control' },
    { id: 'A317', latlng: [377.884803, 711.979736],  name: 'Despacho A 317' },
    { id: 'A316', latlng: [345.974512, 711.861328],  name: 'Despacho A 316' },
    { id: 'A315', latlng: [328.777285, 711.959229],  name: 'Despacho A 315' },
    { id: 'A314', latlng: [296.071739, 711.7146],  name: 'Despacho A 314' },
    { id: 'A311_1', latlng: [296.408532, 611.268555],  name: 'Despacho A 311-1' },
    { id: 'A311_2', latlng: [296.408532, 611.268555],  name: 'Despacho A 311-2' },
    { id: 'A308', latlng: [213.536197, 700.174805],  name: 'Despacho A 308' },
    { id: 'A308_1', latlng: [213.536197, 700.174805],  name: 'Despacho A 308-1' },
    { id: 'A302_1', latlng: [192.872349, 699.971069],  name: 'Despacho A 302-1' },
    { id: 'A307', latlng: [225.401879, 744.870605], name: 'Despacho A 307' },
    { id: 'A305', latlng: [174.144707, 752.788086],  name: 'Despacho A 305' },
  
    // //Aulas
    
    { id: 'A31', latlng: [288.657669, 603.268555],  name: 'A31' },
    { id: 'A32', latlng: [392.858752, 581.141602],  name: 'A32' },
    { id: 'A301_S3', latlng: [168.10913, 497.125977],  name: 'Sala de trabajo 2.2' },
    { id: 'A301_S2', latlng: [168.10913, 497.125977],  name: 'Sala de trabajo 2.1' },
    { id: 'A301_S1', latlng: [163.518209, 524.220459],  name: 'Sala de trabajo 1' },
    { id: 'A301_S4', latlng: [167.634788, 428.62793],  name: 'Biblioteca' },
    { id: 'B31', latlng: [667.113303, 643.226318],  name: 'B31' },
    { id: 'B32', latlng: [678.051158, 562.976318],  name: 'B32' },

    // //Otros
  
    // //Nodos
    { id: 'nodo_entrada_escalera_secundaria_piso3', latlng: [650.992433, 487.772461],  name: 'nodo entrada escalera secundaria piso 3 ' },
    { id: 'nodo_entrada_despacho_B336', latlng: [653.242683, 507.272461],  name: 'nodo entrada despacho B336' },
    { id: 'nodo_principio_pasillo_A_sur_piso3', latlng: [175.378103, 706.06311],  name: 'nodo principio pasillo A sur piso 3' },
    { id: 'nodo_adipi_piso3', latlng: [174.966412, 729.085938], name: 'nodo adi π piso 3' },
    { id: 'nodo_entrada_escalera_principal_piso3', latlng: [233.078609, 727.004883],  name: 'nodo entrada escalera principal piso 3' },
    { id: 'nodo_final_pasilloA_piso3', latlng: [250.601713, 706.594727],  name: 'nodo final pasillo A piso 3' },
    { id: 'nodo_entrada_despacho_B335', latlng: [681.745857, 510.022461], name: 'nodo entrada despacho B335' },
    { id: 'nodo_pasillo_B31_B32', latlng: [684.496163, 648.272461], name: 'nodo pasillo B31 B32' },
    { id: 'nodo_B31_aseos', latlng: [639.057313, 649.706055],  name: 'nodo B31 aseos' },
    { id: 'nodo_salida_escalera_bloque_B_piso3', latlng: [639.807396, 668.706055],  name: 'nodo salida escalera bloque B piso 3' },
    { id: 'nodo_principio_pasillo_B_piso3', latlng: [628.056088, 704.956055],  name: 'nodo pricnipio pasillo B piso 3' },
    { id: 'nodo_final_pasillo_A_norte_piso3', latlng: [534.823197, 703.054688], name: 'nodo final pasillo A Norte piso 3' },
    { id: 'nodo_entrada_A324s_norte', latlng: [518.32136, 702.804688],  name: 'nodo entrada A 324s norte' },
    { id: 'nodo_entrada_escalera_bloque_A_norte_piso3', latlng: [473.956068, 706.341797],  name: 'nodo entrada escalera bloque A norte piso 3' },
    { id: 'nodo_zona_hall_piso3', latlng: [208.049683, 716.562988],  name: 'nodo zona hall piso 3' },
    { id: 'nodo_entrada_escalera_entrada_piso3', latlng: [125.480086, 673.546875], name: 'nodo entrada escalera entrada piso 3' },
    { id: 'nodo_pasillo_escalera_entrada_piso3', latlng: [172.48532, 673.796875],  name: 'nodo pasillo escalera entrada piso 3' },
    { id: 'nodo_entrada_sala_trabajo1', latlng: [175.937857, 524.360352],  name: 'nodo entrada sala de trabajo 1 piso 3' },
    { id: 'nodo_entrada_sala_trabajo2', latlng: [176.860104, 497.125977],  name: 'nodo entrada sala de trabajo 2 piso 3' },
    { id: 'nodo_entrada_biblioteca', latlng: [174.427081, 429.333984],  name: 'nodo entrada biblio piso 3' },
    { id: 'nodo_entrada_A311s', latlng: [292.264186, 702.45166],  name: 'nodo entrada A311s' },
    { id: 'nodo_entrada_eg3_4', latlng: [395.017406, 705.779297],  name: 'nodo entrada eg 3 4' },
    { id: 'nodo_pasilloA_piso3', latlng: [318.368344, 706.666992],  name: 'nodo pasillo A piso 3' },
    { id: 'nodo_hall2_piso3', latlng: [232.740978, 711.830566],  name: 'nodo hall 2 piso 3' },



    { id: 'nodo_conexion_entrada_subida_escalera_3_piso3', latlng: [97.54338, 662.842773],  name: 'nodo esclaera entrada subida escaleras 3 piso 3' },
    { id: 'nodo_conexion_entrada_subida_escalera_2_piso3', latlng: [97.418366, 672.717773],  name: 'nodo escalera entrada subida escaleras 2 piso 3' },
    { id: 'nodo_conexion_entrada_subida_escalera_1_piso3', latlng: [105.856806, 673.124023],  name: 'nodo escalera entrada subida 1 piso 3' },


    { id: 'nodo_conexion_principal_subida_escalera_3_piso3', latlng: [272.00574, 725.628906],  name: 'nodo esclaera principal subida escaleras 3 piso 3' },
    { id: 'nodo_conexion_principal_subida_escalera_2_piso3', latlng: [272.00574, 746.128906],  name: 'nodo escalera principal subida escaleras 2 piso 3' },
    { id: 'nodo_conexion_principal_subida_escalera_1_piso3', latlng: [246.750762, 746.003906],  name: 'nodo escalera principal subida escaleras 1 piso 3' },
   
    { id: 'nodo_acceso_escalera_entrada_piso3', latlng: [116.587231, 670.947353],  name: 'nodo escalera entrada piso 3' },



    // //ascensores y/o escaleras
 
    { id: 'nodo_escalera_bloque_A_piso3', latlng: [486.018279, 724.333008],  name: 'nodo escalera bloque A subida piso 3' },
    { id: 'nodo_escalera_bloque_B_piso3', latlng: [678.497418, 664.4375],  name: 'nodo escalera bloque B piso 3' },
    { id: 'nodo_escalera_bloque_B_secundaria_piso3', latlng: [630.404609, 484.193359],  name: 'nodo escalera bloque B secundaria piso 3' },

    

    { id: 'nodo_escalera_principal_SUBIDA_piso3', latlng: [272.00574, 725.628906],  name: 'nodo escalera principal subida piso 3' },
        { id: 'nodo_escalera_principal_BAJADA_piso3', latlng: [247.773326, 726.43457],  name: 'nodo escalera principal bajada piso 3' },
       

        { id: 'nodo_escalera_entrada_SUBIDA_piso3', latlng: [97.54338, 662.842773],  name: 'nodo escalera entrada subida piso 2' },
        { id: 'nodo_escalera_entrada_BAJADA_piso3', latlng: [110.607335, 663.499023],  name: 'nodo escalera entrada subida piso 2' },
        
      
]
 


const edgesPlanta3 = [
    { from: 'nodo_escalera_bloque_B_secundaria_piso3', to: 'nodo_entrada_escalera_secundaria_piso3', weight: getDistanceBetweenPoints('nodo_escalera_bloque_B_secundaria_piso3','nodo_entrada_escalera_secundaria_piso3', nodosPlanta3) },

    { from: 'nodo_entrada_despacho_B336', to: 'nodo_entrada_escalera_secundaria_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B336','nodo_entrada_escalera_secundaria_piso3', nodosPlanta3)  },
    { from: 'nodo_entrada_despacho_B336', to: 'B336', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B336','B336', nodosPlanta3) },
    { from: 'nodo_entrada_despacho_B336', to: 'B335', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B336','B335', nodosPlanta3)},
    { from: 'nodo_entrada_despacho_B336', to: 'nodo_entrada_despacho_B335', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B336','nodo_entrada_despacho_B335', nodosPlanta3) },

    { from: 'nodo_entrada_despacho_B335', to: 'B335', weight: getDistanceBetweenPoints('nodo_entrada_despacho_B335','B335', nodosPlanta3) },
    { from: 'nodo_entrada_despacho_B335', to: 'B32', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B335','B32', nodosPlanta3) },
    { from: 'nodo_entrada_despacho_B335', to: 'nodo_pasillo_B31_B32', weight:  getDistanceBetweenPoints('nodo_entrada_despacho_B335','nodo_pasillo_B31_B32', nodosPlanta3)},
    
    { from: 'nodo_pasillo_B31_B32', to: 'B32', weight:  getDistanceBetweenPoints('nodo_pasillo_B31_B32','B32', nodosPlanta3) },
    { from: 'nodo_pasillo_B31_B32', to: 'B31', weight:  getDistanceBetweenPoints('nodo_pasillo_B31_B32','B31', nodosPlanta3)},
    { from: 'nodo_pasillo_B31_B32', to: 'nodo_B31_aseos', weight:  getDistanceBetweenPoints('nodo_pasillo_B31_B32','nodo_B31_aseos', nodosPlanta3) },
    
    { from: 'nodo_B31_aseos', to: 'B31', weight: getDistanceBetweenPoints('nodo_B31_aseos','B31', nodosPlanta3) },
    { from: 'nodo_B31_aseos', to: 'nodo_salida_escalera_bloque_B_piso3', weight:  getDistanceBetweenPoints('nodo_B31_aseos','nodo_salida_escalera_bloque_B_piso3', nodosPlanta3) },

    { from: 'nodo_salida_escalera_bloque_B_piso3', to: 'nodo_escalera_bloque_B_piso3', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso3','nodo_escalera_bloque_B_piso3', nodosPlanta3)},
    { from: 'nodo_salida_escalera_bloque_B_piso3', to: 'B328_S', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso3','B328_S', nodosPlanta3)},
    { from: 'nodo_salida_escalera_bloque_B_piso3', to: 'nodo_principio_pasillo_B_piso3', weight:  getDistanceBetweenPoints('nodo_salida_escalera_bloque_B_piso3','nodo_principio_pasillo_B_piso3', nodosPlanta3)},

    { from: 'nodo_principio_pasillo_B_piso3', to: 'B328_S', weight: getDistanceBetweenPoints('nodo_principio_pasillo_B_piso3','B328_S', nodosPlanta3) },
    { from: 'nodo_principio_pasillo_B_piso3', to: 'nodo_final_pasillo_A_norte_piso3', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_B_piso3','nodo_final_pasillo_A_norte_piso3', nodosPlanta3) },

    { from: 'nodo_final_pasillo_A_norte_piso3', to: 'A326', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso3','A326', nodosPlanta3)},
    { from: 'nodo_final_pasillo_A_norte_piso3', to: 'nodo_entrada_A324s_norte', weight:  getDistanceBetweenPoints('nodo_final_pasillo_A_norte_piso3','nodo_entrada_A324s_norte', nodosPlanta3)},
    
    { from: 'nodo_entrada_A324s_norte', to: 'A324', weight:  getDistanceBetweenPoints('nodo_entrada_A324s_norte','A324', nodosPlanta3) },
    { from: 'nodo_entrada_A324s_norte', to: 'A326', weight:  getDistanceBetweenPoints('nodo_entrada_A324s_norte','A326', nodosPlanta3)},
    { from: 'nodo_entrada_A324s_norte', to: 'A325', weight:  getDistanceBetweenPoints('nodo_entrada_A324s_norte','A325', nodosPlanta3)},
    { from: 'nodo_entrada_A324s_norte', to: 'nodo_entrada_escalera_bloque_A_norte_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_A324s_norte','nodo_entrada_escalera_bloque_A_norte_piso3', nodosPlanta3)},
   
    { from: 'A324_S', to: 'A324', weight:  getDistanceBetweenPoints('A324_S','A324', nodosPlanta3)},
    { from: 'A324_L', to: 'A324', weight:  getDistanceBetweenPoints('A324_L','A324', nodosPlanta3)},
    

    { from: 'nodo_entrada_escalera_bloque_A_norte_piso3', to: 'nodo_escalera_bloque_A_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso3','nodo_escalera_bloque_A_piso3', nodosPlanta3) },
    { from: 'nodo_entrada_escalera_bloque_A_norte_piso3', to: 'A325', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso3','A325', nodosPlanta3)},
    { from: 'nodo_entrada_escalera_bloque_A_norte_piso3', to: 'nodo_entrada_eg3_4', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_bloque_A_norte_piso3','nodo_entrada_eg3_4', nodosPlanta3)},


    { from: 'nodo_entrada_eg3_4', to: 'EG4', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','EG4', nodosPlanta3)},
    { from: 'nodo_entrada_eg3_4', to: 'A318', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A318', nodosPlanta3)},
    { from: 'nodo_entrada_eg3_4', to: 'EG3', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','EG3', nodosPlanta3)},
    { from: 'nodo_entrada_eg3_4', to: 'A32', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A32', nodosPlanta3)},
    { from: 'nodo_entrada_eg3_4', to: 'A320', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A320', nodosPlanta3)},
    { from: 'nodo_entrada_eg3_4', to: 'A317', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A317', nodosPlanta3)},
    { from: 'nodo_entrada_eg3_4', to: 'A316', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A316', nodosPlanta3)},
    { from: 'nodo_entrada_eg3_4', to: 'A315', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','A315', nodosPlanta3)},
    { from: 'nodo_entrada_eg3_4', to: 'nodo_pasilloA_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_eg3_4','nodo_pasilloA_piso3', nodosPlanta3)},


    { from: 'nodo_pasilloA_piso3', to: 'A317', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','A317', nodosPlanta3)},
    { from: 'nodo_pasilloA_piso3', to: 'A316', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','A316', nodosPlanta3)},
    { from: 'nodo_pasilloA_piso3', to: 'A315', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','A315', nodosPlanta3)},
    { from: 'nodo_pasilloA_piso3', to: 'A314', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','A314', nodosPlanta3)},
    { from: 'nodo_pasilloA_piso3', to: 'EG1_EG2', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','EG1_EG2', nodosPlanta3)},
    { from: 'nodo_pasilloA_piso3', to: 'nodo_entrada_A311s', weight:  getDistanceBetweenPoints('nodo_pasilloA_piso3','nodo_entrada_A311s', nodosPlanta3)},

    { from: 'nodo_entrada_A311s', to: 'A314', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','A314', nodosPlanta3)},
    { from: 'nodo_entrada_A311s', to: 'EG1_EG2', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','EG1_EG2', nodosPlanta3)},
    { from: 'nodo_entrada_A311s', to: 'A311_2', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','A311_2', nodosPlanta3)},
    { from: 'nodo_entrada_A311s', to: 'A311_1', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','A311_1', nodosPlanta3)},
    { from: 'nodo_entrada_A311s', to: 'A31', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','A31', nodosPlanta3)},
    { from: 'nodo_entrada_A311s', to: 'nodo_final_pasilloA_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_A311s','nodo_final_pasilloA_piso3', nodosPlanta3)},
   

    { from: 'nodo_final_pasilloA_piso3', to: 'A309_L', weight:  getDistanceBetweenPoints('nodo_final_pasilloA_piso3','A309_L', nodosPlanta3)},
    { from: 'nodo_final_pasilloA_piso3', to: 'nodo_hall2_piso3', weight:  getDistanceBetweenPoints('nodo_final_pasilloA_piso3','nodo_hall2_piso3', nodosPlanta3)},

    { from: 'nodo_hall2_piso3', to: 'A309_L', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','A309_L', nodosPlanta3)},
    { from: 'nodo_hall2_piso3', to: 'nodo_entrada_escalera_principal_piso3', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','nodo_entrada_escalera_principal_piso3', nodosPlanta3)},
    { from: 'nodo_hall2_piso3', to: 'A308_1', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','A308_1', nodosPlanta3)},
    { from: 'nodo_hall2_piso3', to: 'A308', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','A308', nodosPlanta3)},
    { from: 'nodo_hall2_piso3', to: 'nodo_zona_hall_piso3', weight:  getDistanceBetweenPoints('nodo_hall2_piso3','nodo_zona_hall_piso3', nodosPlanta3)},

    { from: 'nodo_entrada_escalera_principal_piso3', to: 'A307', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso3','A307', nodosPlanta3)},


    { from: 'nodo_entrada_escalera_principal_piso3', to: 'nodo_escalera_principal_BAJADA_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso3','nodo_escalera_principal_BAJADA_piso3', nodosPlanta3)},
    { from: 'nodo_entrada_escalera_principal_piso3', to: 'nodo_conexion_principal_subida_escalera_1_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso3','nodo_conexion_principal_subida_escalera_1_piso3', nodosPlanta3)},
    { from: 'nodo_conexion_principal_subida_escalera_2_piso3', to: 'nodo_conexion_principal_subida_escalera_1_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_2_piso3','nodo_conexion_principal_subida_escalera_1_piso3', nodosPlanta3)},
    { from: 'nodo_conexion_principal_subida_escalera_2_piso3', to: 'nodo_conexion_principal_subida_escalera_3_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_principal_subida_escalera_2_piso3','nodo_conexion_principal_subida_escalera_3_piso3', nodosPlanta3)},
    { from: 'nodo_escalera_principal_SUBIDA_piso3', to: 'nodo_conexion_principal_subida_escalera_3_piso3', weight:  getDistanceBetweenPoints('nodo_escalera_principal_SUBIDA_piso3','nodo_conexion_principal_subida_escalera_3_piso3', nodosPlanta3)},




    { from: 'nodo_entrada_escalera_principal_piso3', to: 'nodo_zona_hall_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_principal_piso3','nodo_zona_hall_piso3', nodosPlanta3)},


    { from: 'nodo_zona_hall_piso3', to: 'A308_1', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','A308_1', nodosPlanta3)},
    { from: 'nodo_zona_hall_piso3', to: 'A308', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','A308', nodosPlanta3)},
    { from: 'nodo_zona_hall_piso3', to: 'A302_1', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','A302_1', nodosPlanta3)},
    { from: 'nodo_zona_hall_piso3', to: 'nodo_adipi_piso3', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','nodo_adipi_piso3', nodosPlanta3)},
    { from: 'nodo_zona_hall_piso3', to: 'nodo_principio_pasillo_A_sur_piso3', weight:  getDistanceBetweenPoints('nodo_zona_hall_piso3','nodo_principio_pasillo_A_sur_piso3', nodosPlanta3)},

    { from: 'nodo_adipi_piso3', to: 'A305_L', weight:  getDistanceBetweenPoints('nodo_adipi_piso3','A305_L', nodosPlanta3)},
    { from: 'nodo_adipi_piso3', to: 'A305', weight:  getDistanceBetweenPoints('nodo_adipi_piso3','A305', nodosPlanta3)},
    { from: 'nodo_adipi_piso3', to: 'ADIpi', weight:  getDistanceBetweenPoints('nodo_adipi_piso3','ADIpi', nodosPlanta3)},
    { from: 'nodo_adipi_piso3', to: 'nodo_principio_pasillo_A_sur_piso3', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso3','nodo_adipi_piso3', nodosPlanta3)},

    { from: 'nodo_principio_pasillo_A_sur_piso3', to: 'A302_1', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso3','A302_1', nodosPlanta3)},
    { from: 'nodo_principio_pasillo_A_sur_piso3', to: 'A303_L', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso3','A303_L', nodosPlanta3)},
    { from: 'nodo_principio_pasillo_A_sur_piso3', to: 'nodo_pasillo_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_principio_pasillo_A_sur_piso3','nodo_pasillo_escalera_entrada_piso3', nodosPlanta3)},

    { from: 'nodo_pasillo_escalera_entrada_piso3', to: 'nodo_entrada_sala_trabajo1', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso3','nodo_entrada_sala_trabajo1', nodosPlanta3)},
    { from: 'nodo_pasillo_escalera_entrada_piso3', to: 'nodo_entrada_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso3','nodo_entrada_escalera_entrada_piso3', nodosPlanta3)},
    { from: 'nodo_pasillo_escalera_entrada_piso3', to: 'A303_L', weight:  getDistanceBetweenPoints('nodo_pasillo_escalera_entrada_piso3','A303_L', nodosPlanta3)},

    { from: 'nodo_entrada_escalera_entrada_piso3', to: 'nodo_acceso_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_entrada_escalera_entrada_piso3','nodo_acceso_escalera_entrada_piso3', nodosPlanta3)},

    { from: 'nodo_escalera_entrada_BAJADA_piso3', to: 'nodo_acceso_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_escalera_entrada_BAJADA_piso3','nodo_acceso_escalera_entrada_piso3', nodosPlanta3)},

    { from: 'nodo_conexion_entrada_subida_escalera_1_piso3', to: 'nodo_acceso_escalera_entrada_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso3','nodo_acceso_escalera_entrada_piso3', nodosPlanta3)},
    { from: 'nodo_conexion_entrada_subida_escalera_1_piso3', to: 'nodo_conexion_entrada_subida_escalera_2_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_1_piso3','nodo_conexion_entrada_subida_escalera_2_piso3', nodosPlanta3)},
    { from: 'nodo_conexion_entrada_subida_escalera_3_piso3', to: 'nodo_conexion_entrada_subida_escalera_2_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso3','nodo_conexion_entrada_subida_escalera_2_piso3', nodosPlanta3)},
    { from: 'nodo_conexion_entrada_subida_escalera_3_piso3', to: 'nodo_escalera_entrada_SUBIDA_piso3', weight:  getDistanceBetweenPoints('nodo_conexion_entrada_subida_escalera_3_piso3','nodo_escalera_entrada_SUBIDA_piso3', nodosPlanta3)},



    { from: 'nodo_entrada_sala_trabajo1', to: 'A301_S1', weight:  getDistanceBetweenPoints('nodo_entrada_sala_trabajo1','A301_S1', nodosPlanta3)},
    { from: 'nodo_entrada_sala_trabajo1', to: 'nodo_entrada_sala_trabajo2', weight:  getDistanceBetweenPoints('nodo_entrada_sala_trabajo1','nodo_entrada_sala_trabajo2', nodosPlanta3)},


    { from: 'nodo_entrada_sala_trabajo2', to: 'A301_S2', weight: getDistanceBetweenPoints('nodo_entrada_sala_trabajo2','A301_S2', nodosPlanta3) },
    { from: 'nodo_entrada_sala_trabajo2', to: 'A301_S3', weight:  getDistanceBetweenPoints('nodo_entrada_sala_trabajo2','A301_S3', nodosPlanta3) },
    { from: 'nodo_entrada_sala_trabajo2', to: 'nodo_entrada_biblioteca', weight:  getDistanceBetweenPoints('nodo_entrada_sala_trabajo2','nodo_entrada_biblioteca', nodosPlanta3) },

    { from: 'nodo_entrada_biblioteca', to: 'A301_S4', weight:  getDistanceBetweenPoints('nodo_entrada_biblioteca','A301_S4', nodosPlanta3) },

]

todasLasPlantas.planta3 = {}
todasLasPlantas.planta3.nodes = nodosPlanta3
todasLasPlantas.planta3.edges = edgesPlanta3



const nodosPlanta4=[
    //laboratorios
    { id: 'A404_L', latlng: [250.601713, 706.594727],  name: 'Lab de energía solar fotovoltaica' },
   { id: 'A402_L', latlng: [123.141036, 682.261719],  name: 'Lab de energía solar térmica' },
    { id: 'A401_L', latlng: [117.640424, 679.324219],  name: 'Lab de proyectos 2' },
    
    //despachos
    
    // //Aulas
    { id: 'A403_A', latlng: [129.64176, 678.324219],  name: 'Aula de energía solar térmica' },
   
    // //Otros
  
    // //Nodos
    { id: 'nodo_piso4', latlng: [124.614572, 672.8125],  name: 'nodo piso 4 ' },
   
    // //ascensores y/o escaleras
 
    { id: 'nodo_escalera_principal_piso4', latlng: [258.707521, 724.629883],  name: 'nodo escalera principal piso 4' },
    { id: 'nodo_escalera_entrada_piso4', latlng: [111.857581, 660.811523],  name: 'nodo escalera entrada piso 4' },
        
]
 


const edgesPlanta4 = [
    { from: 'nodo_escalera_principal_piso4', to: 'A404_L', weight: getDistanceBetweenPoints('nodo_escalera_principal_piso4','A404_L', nodosPlanta4) },

    { from: 'nodo_escalera_entrada_piso4', to: 'nodo_piso4', weight:  getDistanceBetweenPoints('nodo_escalera_entrada_piso4','nodo_piso4', nodosPlanta4)  },

    { from: 'nodo_piso4', to: 'A403_A', weight:  getDistanceBetweenPoints('nodo_piso4','A403_A', nodosPlanta4) },
    { from: 'nodo_piso4', to: 'A402_L', weight:  getDistanceBetweenPoints('nodo_piso4','A402_L', nodosPlanta4)},
    { from: 'nodo_piso4', to: 'A401_L', weight:  getDistanceBetweenPoints('nodo_piso4','A401_L', nodosPlanta4) },

]


todasLasPlantas.planta4 = {}
todasLasPlantas.planta4.nodes = nodosPlanta4
todasLasPlantas.planta4.edges = edgesPlanta4


const ascensores = [
    //escalera terraza
    { from: 'nodo_escaleras_terraza_SUBIDA_pisoBAJO', to: 'nodo_escaleras_terraza_BAJADA_piso0', weight:  10}, 
    { from: 'nodo_escaleras_terraza_SUBIDA_piso0', to: 'nodo_escaleras_terraza_BAJADA_piso1', weight:  10}, 
    { from: 'nodo_escaleras_terraza_SUBIDA_piso1', to: 'nodo_escaleras_terraza_piso2', weight:  10}, 
    
    //escalera principal
    { from: 'nodo_escalera_principal_pisoBAJO', to: 'nodo_escalera_principal_BAJADA_piso0', weight: 10},
    { from: 'nodo_escalera_principal_SUBIDA_piso0', to: 'nodo_escalera_principal_BAJADA_piso1', weight: 10},
    { from: 'nodo_escalera_principal_SUBIDA_piso1', to: 'nodo_escalera_principal_BAJADA_piso2', weight: 10},
    { from: 'nodo_escalera_principal_SUBIDA_piso2', to: 'nodo_escalera_principal_BAJADA_piso3', weight: 10},
    { from: 'nodo_escalera_principal_SUBIDA_piso3', to: 'nodo_escalera_principal_piso4', weight: 10},

    //escalera bloque A
    { from: 'nodo_escalera_bloque_A_SUBIDA_pisoBAJO', to: 'nodo_escalera_bloque_A_BAJADA_piso0', weight: 10},
    { from: 'nodo_escalera_bloque_A_SUBIDA_piso0', to: 'nodo_escalera_bloque_A_BAJADA_piso1', weight: 10},
    { from: 'nodo_escalera_bloque_A_SUBIDA_piso1', to: 'nodo_escalera_bloque_A_BAJADA_piso2', weight: 10},
    { from: 'nodo_escalera_bloque_A_SUBIDA_piso2', to: 'nodo_escalera_bloque_A_piso3', weight: 10},

    //escalera bloque B
    { from: 'nodo_escalera_bloque_B_SUBIDA_pisoBAJO', to: 'nodo_escalera_bloque_B_BAJADA_piso0', weight:  10},
    { from: 'nodo_escalera_bloque_B_SUBIDA_piso0', to: 'nodo_escalera_bloque_B_BAJADA_piso1', weight:  10}, 
    { from: 'nodo_escalera_bloque_B_SUBIDA_piso1', to: 'nodo_escalera_bloque_B_BAJADA_piso2', weight:  10}, 
    { from: 'nodo_escalera_bloque_B_SUBIDA_piso2', to: 'nodo_escalera_bloque_B_piso3', weight:  10}, 
  
    //escalera bloque B secundaria
    { from: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso0', to: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso1', weight: 10},
    { from: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso1', to: 'nodo_escalera_bloque_B_secundaria_BAJADA_piso2', weight: 10},
    { from: 'nodo_escalera_bloque_B_secundaria_SUBIDA_piso2', to: 'nodo_escalera_bloque_B_secundaria_piso3', weight: 10},


    //escalera bloque C
    { from: 'nodo_escalera_bloque_C', to: 'nodo_escalera_bloque_C_BAJADA_piso1', weight: 10},
    { from: 'nodo_escalera_bloque_C_SUBIDA_piso1', to: 'nodo_escalera_bloque_C_piso2', weight: 10},

    //escalera Cafeteria
    { from: 'nodo_escalera_cafeteria_SUBIDA_pisoBAJO', to: 'nodo_escalera_cafeteria_BAJADA_piso0', weight:  10}, 
    { from: 'nodo_escalera_cafeteria_SUBIDA_piso0', to: 'nodo_escalera_cafeteria_BAJADA_piso1', weight:  10},
    { from: 'nodo_escalera_cafeteria_SUBIDA_piso1', to: 'nodo_escalera_cafeteria_piso2', weight:  10}, 

    //escalera Entrada
    
    { from: 'nodo_escalera_entrada_SUBIDA_pisoBAJO', to: 'nodo_escalera_entrada_BAJADA_piso0', weight:  10},
    { from: 'nodo_escalera_entrada_SUBIDA_piso0', to: 'nodo_escalera_entrada_BAJADA_piso1', weight:  10}, 
    { from: 'nodo_escalera_entrada_SUBIDA_piso1', to: 'nodo_escalera_entrada_BAJADA_piso2', weight:  10}, 
    { from: 'nodo_escalera_entrada_SUBIDA_piso2', to: 'nodo_escalera_entrada_BAJADA_piso3', weight:  10},
    { from: 'nodo_escalera_entrada_SUBIDA_piso3', to: 'nodo_escalera_entrada_piso4', weight:  10}, 

    //escalera Pista Deportiva
    { from: 'nodo_escalera_pista_deportiva_pisoBAJO', to: 'nodo_escalera_pista_deportiva_BAJADA_piso0', weight:  10}, 
 ]

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

// nodosPlanta3.forEach(node => {
//     markers[node.id] = L.marker(node.latlng).addTo(map);
//     markers[node.id].bindPopup(node.id); // Optional: bind popup with node id
// });


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

// const geojsonFeatures = edgesPlanta3.map(edge => ({
//     type: 'Feature',
//     geometry: {
//         type: 'LineString',
//         coordinates: [
//             [nodosPlanta3.find(node => node.id === edge.from).latlng[1], nodosPlanta3.find(node => node.id === edge.from).latlng[0]],
//             [nodosPlanta3.find(node => node.id === edge.to).latlng[1], nodosPlanta3.find(node => node.id === edge.to).latlng[0]]
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

//GET COORDINATES ON CLICKING MARKER
map.on('layeradd', function(event) {
    if (event.layer instanceof L.Marker) {
        const marker = event.layer;
        marker.on('click', function() {
            console.log(`Marker clicked. Coordinates: ${marker.getLatLng().toString()}`);
    
        });
    }
    });
    
    // if (event.layer instanceof L.Polygon) {
    //     const layer = event.layer;
    //     layer.on('click', function() {
    //         console.log(`${JSON.stringify(layer.getLatLngs())}`)
    //     });
    // }
// GET POLYGONE COORDINATES INFO
function getInfoXY(e) {
    var layer = e.target
    if (layer instanceof L.Polygon) {
       console.log(JSON.stringify(layer.getLatLngs()), 'layer info')

    }
}

//PLANTA -1 AULAS CLICKABLES
const B_150_L2 = L.polygon([[{"lat":688.6555661594709,"lng":535.8125},{"lat":628.1205642776494,"lng":535.71875},{"lat":628.1203917773357,"lng":585.5},{"lat":690.4359351757263,"lng":585.5}]]);

const B_150_L1 = L.polygon([[{"lat":650.4341054402566,"lng":587.125},{"lat":650.4651398148646,"lng":629.40625},{"lat":628.1513583839633,"lng":629.4375},{"lat":628.1512906159829,"lng":587.125}]]);

const B_150b = L.polygon([[{"lat":690.5613972301378,"lng":587.25},{"lat":691.7346945176264,"lng":621.027099609375},{"lat":664.8543962937075,"lng":621.089599609375},{"lat":664.8088713326881,"lng":587.25}]]);


const B_150_2 = L.polygon([[{"lat":691.6752591985232,"lng":623.00927734375},{"lat":692.4254070559349,"lng":639.13427734375},{"lat":664.7949609746044,"lng":639.13427734375},{"lat":664.6699363317024,"lng":623.07177734375}]]);

const B_150_1 = L.polygon([[{"lat":692.4254070559349,"lng":641.50927734375},{"lat":693.1130425918956,"lng":657.13427734375},{"lat":653.4353000609352,"lng":657.0224609375},{"lat":653.5603247038371,"lng":641.5224609375}]]);

const B_148 = L.polygon([[{"lat":693.9965847178164,"lng":684.033935546875},{"lat":694.3716586465222,"lng":693.971435546875},{"lat":681.5566327490725,"lng":708.596435546875},{"lat":653.5511127390362,"lng":712.846435546875},{"lat":653.4886004175852,"lng":684.158935546875}]]);

const A_146_L = L.polygon([[{"lat":594.4299962363568,"lng":515.8125},{"lat":594.4295896284747,"lng":597.3125},{"lat":549.8591053282435,"lng":597.25},{"lat":549.6090560424395,"lng":516}]]);

const A_146 = L.polygon([[{"lat":594.4552042448519,"lng":598.8258056640625},{"lat":549.6077695709447,"lng":598.826171875},{"lat":549.663526936932,"lng":661.6319580078125},{"lat":567.9563417388032,"lng":661.638916015625},{"lat":568.1438787031561,"lng":687.076416015625},{"lat":579.2085595999785,"lng":687.076416015625},{"lat":579.1840623151783,"lng":661.625},{"lat":594.4287663315232,"lng":661.643798828125}]]);

const taller2 = L.polygon([[{"lat":594.3324741921608,"lng":679.93359375},{"lat":594.4574988350628,"lng":695.24609375},{"lat":581.0798620445544,"lng":695.24609375},{"lat":581.0173497231034,"lng":679.99609375}]]);

const taller1 = L.polygon([[{"lat":565.0928712565192,"lng":680.02783203125},{"lat":565.1553835779702,"lng":695.21533203125},{"lat":549.5909614316182,"lng":695.27783203125},{"lat":549.5909614316182,"lng":680.15283203125}]]);

const A_144 = L.polygon([[{"lat":544.8783447138735,"lng":533.751953125},{"lat":545.0033693567755,"lng":581.751953125},{"lat":496.49380791081956,"lng":581.626953125},{"lat":496.375,"lng":533.77978515625}]]);

const A_144_L2 = L.polygon([[{"lat":544.9696231428213,"lng":583.90673828125},{"lat":545.0016863585856,"lng":627.90673828125},{"lat":496.6093159130419,"lng":627.91162109375},{"lat":496.49609129971145,"lng":583.8841552734375}]]);

const A_144_L1 = L.polygon([[{"lat":527.7793681783967,"lng":630.2279052734375},{"lat":496.46465031722136,"lng":630.2279052734375},{"lat":496.4880913176336,"lng":676.5758056640625},{"lat":527.9075835170349,"lng":676.4854736328125}]]);

const A_140_L2 = L.polygon([[{"lat":491.93306427764935,"lng":534.5},{"lat":491.93471759234365,"lng":632.48291015625},{"lat":480.213657320286,"lng":632.48291015625},{"lat":480.3074258024625,"lng":641.23291015625},{"lat":471.9709224958331,"lng":641.25830078125},{"lat":471.9914343513092,"lng":677.342529296875},{"lat":461.05177809738876,"lng":677.280029296875},{"lat":461.05177809738876,"lng":619.092529296875},{"lat":443.5080369464308,"lng":618.959228515625},{"lat":443.36731141459217,"lng":539.0625},{"lat":460.49568749215905,"lng":538.9375},{"lat":460.55819981361003,"lng":534.625}]]);

const A_140_L1 = L.polygon([[{"lat":491.94580241769273,"lng":634.3404541015625},{"lat":482.2637501792211,"lng":634.4100341796875},{"lat":482.20123785777014,"lng":643.3787841796875},{"lat":474.0581533281359,"lng":643.4100341796875},{"lat":474.01584762621644,"lng":677.312744140625},{"lat":491.9665338190225,"lng":677.3218994140625}]]);

const A_140_A = L.polygon([[{"lat":459.1195785615714,"lng":677.25},{"lat":443.36647355592595,"lng":677.3125},{"lat":443.36633801996527,"lng":644.0625},{"lat":459.05693070415975,"lng":643.9375}]]);

const A_140 = L.polygon([[{"lat":491.9264554993996,"lng":678.8155517578125},{"lat":491.9577116601251,"lng":695.9718017578125},{"lat":474.01667540369556,"lng":696.0030517578125},{"lat":474.01667540369556,"lng":678.8780517578125}],[{"lat":457.5032775059591,"lng":678.555908203125},{"lat":457.5032775059591,"lng":695.930908203125},{"lat":443.312980536588,"lng":695.930908203125},{"lat":443.4380051794899,"lng":678.618408203125}]]);

const A_139 = L.polygon([[{"lat":456.83259740667063,"lng":717.0068359375},{"lat":456.7641752692797,"lng":742.575439453125},{"lat":443.2884787712601,"lng":744.861328125},{"lat":443.2884787712601,"lng":716.986328125}]]);

const A_138_L = L.polygon([[{"lat":441.01589691202037,"lng":716.90625},{"lat":441.03803519902505,"lng":745.111328125},{"lat":423.2845359069484,"lng":747.798828125},{"lat":423.2845359069484,"lng":717.048828125}]]);


const A_137_L = L.polygon([[{"lat":438.6639279441547,"lng":516.473388671875},{"lat":438.80648713192465,"lng":690.75},{"lat":429.9922498073373,"lng":690.75},{"lat":430.0547621287883,"lng":661.5625},{"lat":390.2639378013155,"lng":661.623779296875},{"lat":390.3048483789451,"lng":516.625}]]);


const A_134_L = L.polygon([[{"lat":426.8710817785902,"lng":696},{"lat":416.30649945337564,"lng":696},{"lat":416.3690117748266,"lng":692.8125},{"lat":405.67940480671007,"lng":692.875},{"lat":405.67940480671007,"lng":695.875},{"lat":372.3677353845189,"lng":696.019287109375},{"lat":372.339714724806,"lng":664.65625},{"lat":426.87231392368767,"lng":664.625}]]);

const A_133_L = L.polygon([[{"lat":384.89959249601236,"lng":661.48291015625},{"lat":368.45885195440616,"lng":661.67041015625},{"lat":368.4920156997688,"lng":685.5625},{"lat":358.74009355341684,"lng":685.5},{"lat":358.67758123196586,"lng":661.5},{"lat":337.1621099700701,"lng":661.555908203125},{"lat":337.17889962722006,"lng":516.625},{"lat":384.9963528505117,"lng":516.6875}]]);

const A_132_L = L.polygon([[{"lat":396.9962049931,"lng":718.6875},{"lat":396.9962049931,"lng":751.6875},{"lat":287.8042815922003,"lng":768.375},{"lat":285.3663010556123,"lng":756.625},{"lat":285.4288133770633,"lng":718.625}]]);

const A_131_L1 = L.polygon([{"lat":316.12326267541266,"lng":675.75},{"lat":316.18577499686364,"lng":691.75},{"lat":303.05818749215905,"lng":691.875},{"lat":302.99567517070807,"lng":675.6875},{"lat":285.1796635571805,"lng":675.8125},{"lat":285.11695409251394,"lng":565.0625},{"lat":333.1184696309838,"lng":565.125},{"lat":333.2153061544527,"lng":675.75}]);

const A_131_L2 = L.polygon([[{"lat":333.11923356094417,"lng":562.1875},{"lat":333.1811298098464,"lng":516.25},{"lat":284.74037694678924,"lng":516.1875},{"lat":284.8654015896912,"lng":562.1875}]]);

const A_129_S1 = L.polygon([[{"lat":333.3057108805133,"lng":677.75},{"lat":333.43073552341525,"lng":695.375},{"lat":318.4902906966324,"lng":695.5625},{"lat":318.4902906966324,"lng":677.75}]]);

const A_129_S2 = L.polygon([[{"lat":301.18281784862984,"lng":677.625},{"lat":301.12030552717886,"lng":695.375},{"lat":285.1171512357295,"lng":695.4375},{"lat":285.1171512357295,"lng":677.625}]]);

const club_deportivo = L.polygon([[{"lat":278.99754803125614,"lng":735.5},{"lat":279.1225726741581,"lng":754.3125},{"lat":261.43158570353245,"lng":754.3125},{"lat":261.36907338208147,"lng":735.4375}]]);

const A_125_L = L.polygon([[{"lat":219.745712135061,"lng":718.625},{"lat":219.745712135061,"lng":741.5625},{"lat":186.10468416760756,"lng":741.70361328125},{"lat":185.97965952470562,"lng":718.64111328125}]]);

const A_113_L = L.polygon([[{"lat":169.61469926698567,"lng":679},{"lat":169.61469926698567,"lng":733.75},{"lat":129.60681353836227,"lng":733.75},{"lat":129.48178889546034,"lng":679.125}]]);

const A_111_L = L.polygon([[{"lat":225.15210719214295,"lng":586.54052734375},{"lat":225.27713183504488,"lng":632.41552734375},{"lat":188.3948621789702,"lng":632.41552734375},{"lat":188.51988682187215,"lng":586.54052734375}]]);

const A_109_S = L.polygon([[{"lat":225.6150689105149,"lng":523.625},{"lat":225.74009355341684,"lng":582.875},{"lat":188.35772532573435,"lng":583.125},{"lat":188.35772532573435,"lng":523.5}]]);

const A_108 = L.polygon([[{"lat":225.92264145025717,"lng":503.80126953125},{"lat":225.84892108894744,"lng":519.603515625},{"lat":188.48277461153825,"lng":519.375},{"lat":188.2539316629926,"lng":503.6728515625}]]);

const A_106_S = L.polygon([[{"lat":226.1143049805545,"lng":440.875},{"lat":226.1143049805545,"lng":500.125},{"lat":188.60691210997007,"lng":500},{"lat":188.2318381812642,"lng":440.875}]]);

const A_105 = L.polygon([[{"lat":211.9030649049232,"lng":405.96875},{"lat":211.9030649049232,"lng":436.5},{"lat":184.5968544455795,"lng":436.503662109375},{"lat":184.58993035019805,"lng":406}]]);

const A_105_1 = L.polygon([[{"lat":226.96634731706007,"lng":405.96875},{"lat":226.99760347778556,"lng":420.78125},{"lat":214.5263953483162,"lng":420.71875},{"lat":214.5263953483162,"lng":406}]]);

const A_105_2 = L.polygon([[{"lat":226.4326083839633,"lng":422.3125},{"lat":226.4537508737029,"lng":436.486083984375},{"lat":214.55526730827822,"lng":436.4375},{"lat":214.52474819434735,"lng":422.3480224609375}]]);

const A_101 = L.polygon([[{"lat":179.26499408570353,"lng":308.670166015625},{"lat":179.2739551409574,"lng":328.625},{"lat":166.54558936860406,"lng":328.890869140625},{"lat":166.56441654569244,"lng":308.625}]]);

B_150_L2.options.name = "B_150_L2";
B_150_L1.options.name = "B_150_L1";
B_150b.options.name = "B_150b";
B_150_2.options.name = "B_150_2";
B_150_1.options.name = "B_150_1";
B_148.options.name = "B_148";
A_146_L.options.name = "A_146_L";
A_146.options.name = "A_146";
taller2.options.name = "taller2";
taller1.options.name = "taller1";
A_144.options.name = "A_144";
A_144_L2.options.name = "A_144_L2";
A_144_L1.options.name = "A_144_L1";
A_140_L2.options.name = "A_140_L2";
A_140_L1.options.name = "A_140_L1";
A_140_A.options.name = "A_140_A";
A_140.options.name = "A_140";
A_139.options.name = "A_139";
A_138_L.options.name = "A_138_L";
A_137_L.options.name = "A_137_L";
A_134_L.options.name = "A_134_L";
A_133_L.options.name = "A_133_L";
A_132_L.options.name = "A_132_L";
A_131_L1.options.name = "A_131_L1";
A_131_L2.options.name = "A_131_L2";
A_129_S1.options.name = "A_129_S1";
A_129_S2.options.name = "A_129_S2";
club_deportivo.options.name = "club_deportivo";
A_125_L.options.name = "A_125_L";
A_113_L.options.name = "A_113_L";
A_111_L.options.name = "A_111_L";
A_109_S.options.name = "A_109_S";
A_108.options.name = "A_108";
A_106_S.options.name = "A_106_S";
A_105.options.name = "A_105";
A_105_1.options.name = "A_105_1";
A_105_2.options.name = "A_105_2";
A_101.options.name = "A_101";


const layerGroupPlanta5 = L.layerGroup([
    B_150_L2,
    B_150_L1,
    B_150b,
    B_150_2,
    B_150_1,
    B_148,
    A_146_L,
    A_146,
    taller2,
    taller1,
    A_144,
    A_144_L2,
    A_144_L1,
    A_140_L2,
    A_140_L1,
    A_140_A,
    A_140,
    A_139,
    A_138_L,
    A_137_L,
    A_134_L,
    A_133_L,
    A_132_L,
    A_131_L1,
    A_131_L2,
    A_129_S1,
    A_129_S2,
    club_deportivo,
    A_125_L,
    A_113_L,
    A_111_L,
    A_109_S,
    A_108,
    A_106_S,
    A_105,
    A_105_1,
    A_105_2,
    A_101
])

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

    const C001 = L.polygon([[{"lat":475.0012265444378,"lng":425.19189453125},{"lat":472.313196722046,"lng":448.25439453125},{"lat":457.81033814541996,"lng":446.69189453125},{"lat":460.4983679678119,"lng":423.37939453125}]]);

    const C002 = L.polygon([[{"lat":458.37206749466816,"lng":423.1875},{"lat":455.6840376722763,"lng":446.625},{"lat":441.4312283814542,"lng":444.875},{"lat":444.0567458823951,"lng":421.625}]]);

    const C003 = L.polygon([[{"lat":441.4934013029374,"lng":421.242919921875},{"lat":438.80537148054555,"lng":444.367919921875},{"lat":424.17748826101763,"lng":442.680419921875},{"lat":426.99054272631145,"lng":419.555419921875}]]);


    const C004 = L.polygon([[{"lat":424.8521817929279,"lng":419.4287109375},{"lat":422.0391273276341,"lng":442.6162109375},{"lat":407.66129339391006,"lng":440.9287109375},{"lat":410.34932321630197,"lng":417.7412109375}]]);


    const C005 = L.polygon([[{"lat":407.9228486746599,"lng":417.30078125},{"lat":405.3954659300679,"lng":440.6162109375},{"lat":391.2676812821478,"lng":438.9912109375},{"lat":394.0842451207054,"lng":415.63427734375}]]);


    const C006 = L.polygon([[{"lat":391.5481051848666,"lng":415.40283203125},{"lat":388.87185018907826,"lng":438.612548828125},{"lat":374.1369775704787,"lng":436.925048828125},{"lat":376.8381521407961,"lng":413.579833984375}]]);


    const C007 = L.polygon([[{"lat":359.77503326791765,"lng":413.7086181640625},{"lat":357.3057965706042,"lng":434.7711181640625},{"lat":372.06908245514995,"lng":436.4898681640625},{"lat":374.5010831675539,"lng":415.3980712890625}]]);


    const C008 = L.polygon([[{"lat":357.43661285552986,"lng":413.375},{"lat":355.02988847966736,"lng":434.5},{"lat":340.5278061544528,"lng":432.8125},{"lat":343.02829901249174,"lng":411.78125}]]);


    const C009 = L.polygon([[{"lat":340.60948729322365,"lng":411.3282470703125},{"lat":338.17150675663567,"lng":432.3594970703125},{"lat":319.9553918669463,"lng":430.3546142578125},{"lat":317.0173127587505,"lng":430.0108642578125},{"lat":314.95440615086835,"lng":429.3858642578125},{"lat":312.78820769933867,"lng":428.2779541015625},{"lat":311.0378626987114,"lng":427.0592041015625},{"lat":309.6938477875155,"lng":425.6842041015625},{"lat":308.4748575192215,"lng":424.0904541015625},{"lat":307.4434042152804,"lng":422.2779541015625},{"lat":306.56823171496677,"lng":419.6529541015625},{"lat":306.3494385898884,"lng":417.1529541015625},{"lat":306.3806947506138,"lng":415.2154541015625},{"lat":306.69325635786873,"lng":412.4967041015625},{"lat":309.0283975840995,"lng":393.1875},{"lat":330.0856486459846,"lng":395.6820068359375},{"lat":328.92917069914154,"lng":405.3695068359375},{"lat":328.83540221696506,"lng":406.7132568359375},{"lat":329.05419534204344,"lng":407.6820068359375},{"lat":329.4605254314748,"lng":408.4945068359375},{"lat":329.9606240030826,"lng":409.2757568359375},{"lat":330.77328418194526,"lng":409.8382568359375},{"lat":331.6172005215334,"lng":410.2757568359375},{"lat":332.617397664749,"lng":410.4632568359375}]]);

    B01.options.name = "B01";
    B02.options.name = "B02";
    B042.options.name = "B042";
    B041.options.name = "B041";
    B037.options.name = "B037";
    B036.options.name = "B036";
    B034.options.name = "B034";
    B033.options.name = "B033";
    A031.options.name = "A031";
    A032.options.name = "A032";
    A032_L1.options.name = "A032_L1";
    A032_L2.options.name = "A032_L2";
    A032_L3.options.name = "A032_L3";
    A032_L4.options.name = "A032_L4";
    A032_L5.options.name = "A032_L5";
    A032_L6.options.name = "A032_L6";
    A032_L7.options.name = "A032_L7";
    A032_A1.options.name = "A032_A1";
    A030.options.name = "A030";
    A029.options.name = "A029";
    A029_L1.options.name = "A029_L1";
    A029_L2.options.name = "A029_L2";
    A029_A.options.name = "A029_A";
    A028_3.options.name = "A028_3";
    A028_2.options.name = "A028_2";
    A028_1.options.name = "A028_1";
    A026.options.name = "A026";
    A025.options.name = "A025";
    A023.options.name = "A023";
    A022_L.options.name = "A022_L";
    A024.options.name = "A024";
    A024_LP.options.name = "A024_LP";
    A024_L1.options.name = "A024_L1";
    A024_L2.options.name = "A024_L2";
    A024_L3.options.name = "A024_L3";
    A021.options.name = "A021";
    A021_L1.options.name = "A021_L1";
    A021_L2.options.name = "A021_L2";
    A021_L3.options.name = "A021_L3";
    enfermeria.options.name = "enfermeria";
    A019.options.name = "A019";
    hall_entrada.options.name = "hall_entrada";
    A01.options.name = "A01";
    A02.options.name = "A02";
    A03.options.name = "A03";
    A04.options.name = "A04";
    A05.options.name = "A05";
    A06.options.name = "A06";
    A07.options.name = "A07";
    A08.options.name = "A08";
    pista_deportiva.options.name = "pista_deportiva";
    A015_L.options.name = "A015_L";
    A012_L.options.name = "A012_L";
    A008_L.options.name = "A008_L";
    A007_L.options.name = "A007_L";
    A006_L.options.name = "A006_L";
    A005_L.options.name = "A005_L";
    A004_L.options.name = "A004_L";
    A002_L.options.name = "A002_L";
    Fablab.options.name = "Fablab";
    A006.options.name = "A006";
    A007.options.name = "A007";
    A002.options.name = "A002";
    C009.options.name = "C009";
    C008.options.name = "C008";
    C007.options.name = "C007";
    C006.options.name = "C006";
    C005.options.name = "C005";
    C004.options.name = "C004";
    C003.options.name = "C003";
    C002.options.name = "C002";
    C001.options.name = "C001";
    
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
        A002,
        C009,
        C008,
        C007,
        C006,
        C005,
        C004,
        C003,
        C002,
        C001
    ])


//PLANTA 1 AULAS CLICKABLES


const B149 = L.polygon([[{"lat":688.4133163521336,"lng":484.2767333984375},{"lat":688.7883902808395,"lng":497.7454833984375},{"lat":665.994979008728,"lng":497.7767333984375},{"lat":665.994979008728,"lng":480.9954833984375}]]);

const B150 = L.polygon([[{"lat":640.3355209509472,"lng":500.1875},{"lat":640.3355209509472,"lng":515.0625},{"lat":609.7044834399699,"lng":515},{"lat":609.7044834399699,"lng":500.3125}]]);

const B12 = L.polygon([[{"lat":675.1213774934137,"lng":518.4375},{"lat":675.2464021363156,"lng":574.125},{"lat":601.9320662401204,"lng":574.1875},{"lat":601.8064255246697,"lng":518.4375}]]);

const B11 = L.polygon([[{"lat":674.9908081975733,"lng":577.25},{"lat":675.2408574833772,"lng":640.125},{"lat":601.9788586303923,"lng":640.38623046875},{"lat":601.8538339874904,"lng":577.38623046875}]]);

const B142 = L.polygon([[{"lat":695.1830149918454,"lng":681.3125},{"lat":695.3705519561984,"lng":686.1875},{"lat":689.2443444540029,"lng":698.9375},{"lat":675.6166583776906,"lng":708.0625},{"lat":653.9514994085704,"lng":710.769775390625},{"lat":653.8264747656684,"lng":681.394775390625}]]);

const A139_L1 = L.polygon([[{"lat":545.5185163404842,"lng":515.7725830078125},{"lat":545.5161164578741,"lng":591.66796875},{"lat":494.84855816620967,"lng":591.62841796875},{"lat":494.59850888040575,"lng":515.75341796875}]]);

const A139_L2 = L.polygon([[{"lat":515.9941965965912,"lng":594.125},{"lat":516.0567089180422,"lng":642},{"lat":494.48995801745616,"lng":642.0625},{"lat":494.55247033890714,"lng":594.1875}]]);

const A139 = L.polygon([[{"lat":516.0745257361507,"lng":643.681640625},{"lat":516.0120134146997,"lng":659.306640625},{"lat":494.78126624191265,"lng":659.404541015625},{"lat":494.78126624191265,"lng":643.779541015625}],[{"lat":513.9106941233399,"lng":661.55078125},{"lat":513.9106941233399,"lng":676.23828125},{"lat":494.69181810850046,"lng":676.281494140625},{"lat":494.7855865906769,"lng":661.625244140625}],[{"lat":514.0357187662419,"lng":678.67578125},{"lat":514.0903498395971,"lng":693.921875},{"lat":494.68795141315843,"lng":693.8662109375},{"lat":494.9106112335789,"lng":678.750244140625}],[{"lat":545.59375,"lng":593.9150390625},{"lat":545.5013368774307,"lng":608.6009521484375},{"lat":525.5236823888381,"lng":608.5880126953125},{"lat":525.4111113724753,"lng":593.924072265625}],[{"lat":545.531237678549,"lng":610.7275390625},{"lat":545.4388245559797,"lng":625.4134521484375},{"lat":525.4611700673871,"lng":625.4005126953125},{"lat":525.3485990510243,"lng":610.736572265625}],[{"lat":545.59375,"lng":627.6650390625},{"lat":545.5013368774307,"lng":642.3509521484375},{"lat":525.5931518495618,"lng":642.3851318359375},{"lat":525.6042870808467,"lng":627.710205078125}],[{"lat":545.59375,"lng":644.3525390625},{"lat":545.4851044859042,"lng":660.1475830078125},{"lat":525.5847150160403,"lng":660.1240234375},{"lat":525.6042870808467,"lng":644.397705078125}],[{"lat":545.4411314676416,"lng":662.375732421875},{"lat":545.3786191461907,"lng":677.063232421875},{"lat":527.1250212825062,"lng":677.188232421875},{"lat":527.1875336039573,"lng":662.313232421875}],[{"lat":545.3786191461908,"lng":679.188232421875},{"lat":545.3161068247398,"lng":693.875732421875},{"lat":527.0625089610553,"lng":694.000732421875},{"lat":527.1250212825064,"lng":679.125732421875}]]);

const A140 = L.polygon([[{"lat":545.4327069555711,"lng":716.6875},{"lat":545.4952192770221,"lng":727.3125},{"lat":528.5543801638081,"lng":730},{"lat":528.5,"lng":716.681884765625}]]);

const A138 = L.polygon([[{"lat":526.3190180475652,"lng":715},{"lat":526.3815303690162,"lng":730.34375},{"lat":511.7063966252666,"lng":732.6004638671875},{"lat":511.61262814309015,"lng":714.9754638671875}]]);

const A137 = L.polygon([[{"lat":509.32970746635124,"lng":714.9879150390625},{"lat":495.3582036220585,"lng":714.9566650390625},{"lat":495.326947461333,"lng":735.0191650390625},{"lat":509.29845130562575,"lng":732.8629150390625}]]);

const proyecto_mentor = L.polygon([[{"lat":416.5467397440722,"lng":713.923095703125},{"lat":416.6092520655232,"lng":732.298095703125},{"lat":405.48205884724985,"lng":732.360595703125},{"lat":405.5445711687008,"lng":713.985595703125}]]);

const A129 = L.polygon([[{"lat":403.2970248176425,"lng":713.913818359375},{"lat":403.2313710862591,"lng":732.3525390625},{"lat":388.4784632238292,"lng":732.2900390625},{"lat":388.44357391526427,"lng":713.970947265625}]]);

const A128 = L.polygon([[{"lat":386.1456524320304,"lng":713.883056640625},{"lat":386.0871227395738,"lng":732.32421875},{"lat":371.209190234242,"lng":732.32421875},{"lat":371.209190234242,"lng":713.94921875}]]);

const A127 = L.polygon([[{"lat":368.68144176658245,"lng":714.0504150390625},{"lat":368.7126979273079,"lng":732.3004150390625},{"lat":355.2725488153485,"lng":732.3316650390625},{"lat":355.21272257020985,"lng":714.123291015625}]]);

const A126 = L.polygon([[{"lat":353.24765276358943,"lng":714.03125},{"lat":353.3101650850404,"lng":732.25},{"lat":339.2761489192967,"lng":732.28125},{"lat":339.2761489192967,"lng":714.0625}]]);

const A125 = L.polygon([[{"lat":337.03046702779716,"lng":714.0478515625},{"lat":337.1242355099737,"lng":732.2353515625},{"lat":322.40258380826924,"lng":732.2978515625},{"lat":322.4639384733946,"lng":714.0625}]]);

const A123 = L.polygon([[{"lat":320.08602837070094,"lng":713.9190673828125},{"lat":306.739647740918,"lng":713.8878173828125},{"lat":306.77090390164346,"lng":732.2940673828125},{"lat":320.11728453142644,"lng":732.2940673828125}]]);

const A122 = L.polygon([[{"lat":304.4106974837357,"lng":713.80224609375},{"lat":304.37944132301016,"lng":732.27099609375},{"lat":286.3172874437694,"lng":732.294921875},{"lat":286.3172874437694,"lng":713.857421875}]]);

const A124_S1 = L.polygon([[{"lat":306.0538817051096,"lng":694.017822265625},{"lat":286.1836064214922,"lng":693.96875},{"lat":286.15246115382547,"lng":594.51318359375},{"lat":306.09073740523684,"lng":594.53125}]]);

const A124_S2 = L.polygon([[{"lat":337.59193874670683,"lng":648.625},{"lat":337.5919079430794,"lng":693.96875},{"lat":317.6409540387476,"lng":693.96875},{"lat":317.55891445776655,"lng":648.71875}]]);

const A124 = L.polygon([[{"lat":337.2170619612166,"lng":632.25},{"lat":337.18580580049104,"lng":646.8125},{"lat":317.21653773948424,"lng":646.875},{"lat":317.21653773948424,"lng":632.21875}],[{"lat":337.2393542663584,"lng":615.420654296875},{"lat":337.17684194490744,"lng":630.045654296875},{"lat":317.26117331576967,"lng":630.076904296875},{"lat":317.1674048335932,"lng":615.420654296875}],[{"lat":337.21749937272614,"lng":598.90625},{"lat":337.21749937272614,"lng":613.625},{"lat":317.18230034768897,"lng":613.625},{"lat":317.2135565084144,"lng":598.90625}],[{"lat":337.2446900146962,"lng":581.9688720703125},{"lat":337.2134338539706,"lng":596.6876220703125},{"lat":317.2025316101224,"lng":596.6829833984375},{"lat":317.26504393157336,"lng":581.9329833984375}],[{"lat":337.3105470500206,"lng":565.46875},{"lat":337.2792908892951,"lng":579.8125},{"lat":317.22003927182465,"lng":579.8048095703125},{"lat":317.2825515932756,"lng":565.4298095703125}],[{"lat":337.32018802534185,"lng":548.8839111328125},{"lat":337.32018802534185,"lng":563.4464111328125},{"lat":317.2339535503701,"lng":563.4464111328125},{"lat":317.1714412289191,"lng":548.9151611328125}],[{"lat":337.1737940659892,"lng":534.135498046875},{"lat":337.2363063874402,"lng":547.260498046875},{"lat":317.35738816603043,"lng":547.260498046875},{"lat":317.23236352312847,"lng":534.197998046875}],[{"lat":337.2363063874402,"lng":515.822998046875},{"lat":337.2363063874402,"lng":531.885498046875},{"lat":317.29487584457945,"lng":531.947998046875},{"lat":317.29487584457945,"lng":515.822998046875}],[{"lat":305.22428121135545,"lng":515.93505859375},{"lat":305.22428121135545,"lng":532.15380859375},{"lat":286.45312528003296,"lng":532.15380859375},{"lat":286.45312528003296,"lng":515.90380859375}],[{"lat":305.68677135419466,"lng":548.858154296875},{"lat":305.6242590327437,"lng":534.420654296875},{"lat":286.337864826962,"lng":534.3612060546875},{"lat":286.400377148413,"lng":548.9237060546875}],[{"lat":305.68494945964835,"lng":551.03125},{"lat":305.71620562037384,"lng":565.375},{"lat":286.4338713326881,"lng":565.375},{"lat":286.4338713326881,"lng":551.15625}],[{"lat":306.0284776735308,"lng":578.15625},{"lat":306.12224615570733,"lng":592.28125},{"lat":286.14443148825205,"lng":592.3765869140625},{"lat":286.20694380970303,"lng":578.2203369140625}]]);

const A121 = L.polygon([[{"lat":280.9052760453071,"lng":662.185546875},{"lat":281.030300688209,"lng":693.373046875},{"lat":245.0581225245085,"lng":693.177734375},{"lat":245.18314716741043,"lng":657.490234375},{"lat":261.18660837500227,"lng":657.452392578125},{"lat":261.2488137803108,"lng":662.177734375}]]);

const A120 = L.polygon([[{"lat":184.64999014283921,"lng":755.1357421875},{"lat":184.64999014283921,"lng":781.7607421875},{"lat":109.26013047296448,"lng":793.6357421875},{"lat":94.88229653924046,"lng":781.5107421875},{"lat":94.63224725343656,"lng":755.2607421875},{"lat":128.03137825510333,"lng":755.2197265625},{"lat":127.92798895997993,"lng":735.7423095703125},{"lat":140.77018869742102,"lng":735.8349609375},{"lat":140.81985646629747,"lng":755.139892578125}]]);

const A118 = L.polygon([[{"lat":144.79447931788448,"lng":695.781005859375},{"lat":144.70249968636307,"lng":730.85302734375},{"lat":105.22108491495959,"lng":730.87060546875},{"lat":105.22108491495959,"lng":695.74560546875}]]);

const direccion = L.polygon([[{"lat":144.80257675143824,"lng":676.310302734375},{"lat":144.80257675143824,"lng":693.185302734375},{"lat":104.9553672240443,"lng":693.247802734375},{"lat":105.01787954549528,"lng":676.372802734375}]]);

const A117 = L.polygon([[{"lat":144.74661160098213,"lng":657.3125},{"lat":144.68409927953115,"lng":674.0625},{"lat":129.18104355968958,"lng":674.125},{"lat":129.11853123823863,"lng":657.375}]]);

const oficina_de_practicas = L.polygon([[{"lat":164.61039011954048,"lng":638.76953125},{"lat":164.61039011954048,"lng":654.20703125},{"lat":115.95602474147356,"lng":654.2275390625},{"lat":115.89351242002257,"lng":638.9150390625}]]);

const A114 = L.polygon([[{"lat":227.7936336182949,"lng":599.72509765625},{"lat":227.91865826119684,"lng":653.60009765625},{"lat":188.41087110418124,"lng":653.35009765625},{"lat":188.28584646127928,"lng":599.60009765625}]]);

const A115 = L.polygon([[{"lat":164.4470911294514,"lng":596.283935546875},{"lat":164.55206765148665,"lng":622.5274658203125},{"lat":147.59811011344695,"lng":622.60888671875},{"lat":147.7231347563489,"lng":596.35888671875}],[{"lat":137.91416429198702,"lng":620.41943359375},{"lat":138.03918893488895,"lng":635.23193359375},{"lat":115.95915326988906,"lng":635.248046875},{"lat":115.89664094843809,"lng":620.498046875}],[{"lat":137.93374195745292,"lng":602.9375},{"lat":137.99625427890388,"lng":618.6875},{"lat":116.11694177106295,"lng":618.625},{"lat":116.05442944961199,"lng":602.9375}],[{"lat":138.1837912432568,"lng":583.26513671875},{"lat":138.12127892180584,"lng":601.14013671875},{"lat":115.80438016380809,"lng":601.26513671875},{"lat":115.9375,"lng":583.2664794921875}]]);

const A112_L = L.polygon([[{"lat":115.93347032546552,"lng":582.039794921875},{"lat":164.74857071168702,"lng":582},{"lat":164.685121959962,"lng":523.71875},{"lat":115.87026856282596,"lng":523.75}]]);

const A110_L = L.polygon([[{"lat":164.70472426832984,"lng":474.001708984375},{"lat":164.70472426832984,"lng":520.876708984375},{"lat":115.92919534204347,"lng":520.9375},{"lat":116.05402284172985,"lng":474.125}]]);

const A108_L = L.polygon([[{"lat":164.5591362438841,"lng":440.25},{"lat":164.68416088678603,"lng":471.25},{"lat":115.99184319945516,"lng":471.375},{"lat":115.99184319945516,"lng":440.25}]]);

const A11 = L.polygon([[{"lat":227.9759619692815,"lng":553.583984375},{"lat":227.85093732637955,"lng":597.388427734375},{"lat":187.80620373855226,"lng":597.375},{"lat":187.86871606000324,"lng":553.470947265625}]]);

const A12 = L.polygon([[{"lat":227.87251722762872,"lng":551.3125},{"lat":187.90155552717889,"lng":551.375},{"lat":187.90176499184543,"lng":502.59375},{"lat":227.93445044088392,"lng":502.625}]]);

const A13 = L.polygon([[{"lat":227.872621959962,"lng":500.125},{"lat":227.87227079860924,"lng":453.21875},{"lat":187.83954838521782,"lng":453.3125},{"lat":187.90208534957077,"lng":500.21875}]]);

const A14 = L.polygon([[{"lat":227.87305937147158,"lng":450.71875},{"lat":227.809894013119,"lng":405.90625},{"lat":187.8086002607667,"lng":405.90625},{"lat":187.8398564214922,"lng":450.75}]]);

const A15 = L.polygon([[{"lat":164.6209092782766,"lng":437.5625},{"lat":116.36609159094576,"lng":437.625},{"lat":116.24084516192627,"lng":392.8125},{"lat":164.68092034517986,"lng":392.6875}]]);

const A16 = L.polygon([[{"lat":164.5559449880818,"lng":390.5},{"lat":164.49343266663084,"lng":355.4375},{"lat":116.24017980357367,"lng":355.4375},{"lat":116.24017980357367,"lng":390.375}]]);

const A17 = L.polygon([[{"lat":164.55856945713927,"lng":352.875},{"lat":164.4960571356883,"lng":308},{"lat":116.05442944961199,"lng":308.0625},{"lat":116.17945409251394,"lng":353.0625}]]);


const cafeteria = L.polygon([[{"lat":197.62612013190673,"lng":259.9453125},{"lat":197.62612013190673,"lng":301.6328125},{"lat":174.12148726634047,"lng":301.7578125},{"lat":174.0589749448895,"lng":260.1328125}]]);

const comedor = L.polygon([[{"lat":201.49131337706328,"lng":302.75},{"lat":201.36660909188666,"lng":223.875},{"lat":301.9356271394519,"lng":223.8125},{"lat":303.619919641737,"lng":225.0098876953125},{"lat":304.9951907136584,"lng":227.5411376953125},{"lat":305.8391070532466,"lng":230.1348876953125},{"lat":306.71427955356023,"lng":233.5723876953125},{"lat":307.55819589314837,"lng":237.6036376953125},{"lat":308.05829446475616,"lng":241.6348876953125},{"lat":308.58964919708944,"lng":245.8223876953125},{"lat":308.8979375011201,"lng":249.9464111328125},{"lat":309.11673062619855,"lng":254.2276611328125},{"lat":309.3065873837303,"lng":259.1180419921875},{"lat":309.3378435444558,"lng":262.7117919921875},{"lat":309.3239247853827,"lng":267.701416015625},{"lat":309.1000036964353,"lng":272.4859619140625},{"lat":308.91246673208235,"lng":276.7984619140625},{"lat":308.431903260928,"lng":282.331787109375},{"lat":307.9630608500457,"lng":285.706787109375},{"lat":307.52547459988887,"lng":288.644287109375},{"lat":306.7480593714716,"lng":292.96875},{"lat":305.93539919260894,"lng":295.96875},{"lat":304.96645821011884,"lng":298.78125},{"lat":303.99751722762875,"lng":300.71875},{"lat":303.21611320949154,"lng":301.59375},{"lat":301.9346106197466,"lng":302.65625}]]);

const A130_L = L.polygon([[{"lat":426.9362062476477,"lng":649.5},{"lat":427.06123089054967,"lng":694.125},{"lat":390.116448913024,"lng":694.125},{"lat":390.17896123447497,"lng":649.4375}]]);

const A132_L = L.polygon([[{"lat":427.06068874670683,"lng":610.8125},{"lat":426.99817642525585,"lng":646.875},{"lat":390.365956054985,"lng":646.875},{"lat":390.17841909063213,"lng":610.75}]]);


const A133_L = L.polygon([[{"lat":428.370231598473,"lng":561.375},{"lat":428.432743919924,"lng":608.9375},{"lat":390.11685552090614,"lng":608.9375},{"lat":390.11685552090614,"lng":561.5}]]);

const A134_L = L.polygon([[{"lat":440.7952757316702,"lng":515.56640625},{"lat":440.7327634102192,"lng":558.44140625},{"lat":390.36777962972917,"lng":558.4375},{"lat":390.1802426653763,"lng":515.5}]]);



const C109 = L.polygon([[{"lat":336.2336247916555,"lng":412.3282470703125},{"lat":333.7956442550675,"lng":433.3594970703125},{"lat":315.5795293653781,"lng":431.3546142578125},{"lat":312.6414502571823,"lng":431.0108642578125},{"lat":310.5785436493002,"lng":430.3858642578125},{"lat":308.4123451977705,"lng":429.2779541015625},{"lat":306.66200019714324,"lng":428.0592041015625},{"lat":305.3179852859473,"lng":426.6842041015625},{"lat":304.0989950176533,"lng":425.0904541015625},{"lat":303.0675417137122,"lng":423.2779541015625},{"lat":302.1923692133986,"lng":420.6529541015625},{"lat":301.9735760883202,"lng":418.1529541015625},{"lat":302.00483224904565,"lng":416.2154541015625},{"lat":302.31739385630055,"lng":413.4967041015625},{"lat":304.6525350825313,"lng":394.1875},{"lat":325.7097861444164,"lng":396.6820068359375},{"lat":324.55330819757336,"lng":406.3695068359375},{"lat":324.4595397153969,"lng":407.7132568359375},{"lat":324.67833284047526,"lng":408.6820068359375},{"lat":325.08466292990664,"lng":409.4945068359375},{"lat":325.58476150151444,"lng":410.2757568359375},{"lat":326.3974216803771,"lng":410.8382568359375},{"lat":327.2413380199652,"lng":411.2757568359375},{"lat":328.2415351631808,"lng":411.4632568359375}]]);

const C108 = L.polygon([[{"lat":352.81070106815775,"lng":414.3125},{"lat":350.40397669229526,"lng":435.4375},{"lat":335.9018943670807,"lng":433.75},{"lat":338.40238722511964,"lng":412.71875}]]);

const C107 = L.polygon([[{"lat":355.0240968376436,"lng":414.7086181640625},{"lat":352.5548601403301,"lng":435.7711181640625},{"lat":367.3181460248759,"lng":437.4898681640625},{"lat":369.7501467372798,"lng":416.3980712890625}]]);

const C106 = L.polygon([[{"lat":387.0091609987992,"lng":416.27685546875},{"lat":384.25861885495635,"lng":439.52685546875},{"lat":369.57078729591194,"lng":437.8336181640625},{"lat":372.22756095757836,"lng":414.6148681640625}]]);

const C105 = L.polygon([[{"lat":403.20753467928387,"lng":418.1787109375},{"lat":400.6445294997939,"lng":441.3662109375},{"lat":386.5167448518738,"lng":439.7412109375},{"lat":389.26728699571663,"lng":416.6787109375}]]);

const C104 = L.polygon([[{"lat":419.97622071975195,"lng":420.1787109375},{"lat":417.16316625445813,"lng":443.3662109375},{"lat":402.7853323207341,"lng":441.6787109375},{"lat":405.473362143126,"lng":418.4912109375}]]);

const C103 = L.polygon([[{"lat":436.7424648726634,"lng":422.117919921875},{"lat":434.05443505027154,"lng":445.242919921875},{"lat":419.4265518307436,"lng":443.555419921875},{"lat":422.23960629603744,"lng":420.430419921875}]]);

const C102 = L.polygon([[{"lat":453.43447564385184,"lng":424.31689453125},{"lat":450.74644582145993,"lng":447.37939453125},{"lat":436.43112420918686,"lng":445.75439453125},{"lat":439.18166635302975,"lng":422.56689453125}]]);

const C101 = L.polygon([[{"lat":470.2502901141638,"lng":426.19189453125},{"lat":467.56226029177196,"lng":449.25439453125},{"lat":453.05940171514595,"lng":447.69189453125},{"lat":455.74743153753786,"lng":424.37939453125}]]);

B149.options.name = "B149";
B150.options.name = "B150";
B12.options.name = "B12";
B11.options.name = "B11";
B142.options.name = "B142";
A139_L1.options.name = "A139_L1";
A139_L2.options.name = "A139_L2";
A139.options.name = "A139";
A140.options.name = "A140";
A138.options.name = "A138";
A137.options.name = "A137";
proyecto_mentor.options.name = "proyecto_mentor";
A129.options.name = "A129";
A128.options.name = "A128";
A127.options.name = "A127";
A126.options.name = "A126";
A125.options.name = "A125";
A123.options.name = "A123";
A122.options.name = "A122";
A124_S1.options.name = "A124_S1";
A124_S2.options.name = "A124_S2";
A124.options.name = "A124";
A121.options.name = "A121";
A120.options.name = "A120";
A118.options.name = "A118";
direccion.options.name = "direccion";
A117.options.name = "A117";
oficina_de_practicas.options.name = "oficina_de_practicas";
A114.options.name = "A114";
A115.options.name = "A115";
A112_L.options.name = "A112_L";
A110_L.options.name = "A110_L";
A108_L.options.name = "A108_L";
A11.options.name = "A11";
A12.options.name = "A12";
A13.options.name = "A13";
A14.options.name = "A14";
A15.options.name = "A15";
A16.options.name = "A16";
A17.options.name = "A17";
cafeteria.options.name = "cafeteria";
comedor.options.name = "comedor";
A130_L.options.name = "A130_L";
A132_L.options.name = "A132_L";
A133_L.options.name = "A133_L";
A134_L.options.name = "A134_L";
C109.options.name = "C109";
C108.options.name = "C108";
C107.options.name = "C107";
C106.options.name = "C106";
C105.options.name = "C105";
C104.options.name = "C104";
C103.options.name = "C103";
C102.options.name = "C102";
C101.options.name = "C101";


const layerGroupPlanta1 = L.layerGroup([
    B149,
    B150,
    B12,
    B11,
    B142,
    A139_L1,
    A139_L2,
    A139,
    A140,
    A138,
    A137,
    proyecto_mentor,
    A129,
    A128,
    A127,
    A126,
    A125,
    A123,
    A122,
    A124_S1,
    A124_S2,
    A124,
    A121,
    A120,
    A118,
    direccion,
    A117,
    oficina_de_practicas,
    A114,
    A115,
    A112_L,
    A110_L,
    A108_L,
    A11,
    A12,
    A13,
    A14,
    A15,
    A16,
    A17,
    cafeteria,
    comedor,
    A130_L,
    A132_L,
    A133_L,
    A134_L,
    C109,
    C108,
    C107,
    C106,
    C105,
    C104,
    C103,
    C102,
    C101
])

//PLANTA 2 AULAS CLICKABLES

const B248 = L.polygon([[{"lat":689.3149676505906,"lng":486.330078125},{"lat":689.8150662221983,"lng":500.017578125},{"lat":665.7478224635734,"lng":500.080078125},{"lat":665.6853101421224,"lng":483.017578125}]]);

const B249 = L.polygon([[{"lat":640.5001702600498,"lng":503.017822265625},{"lat":640.5001702600498,"lng":517.705322265625},{"lat":611.7506071114934,"lng":517.705322265625},{"lat":611.7506071114934,"lng":502.955322265625}]]);

const B22 = L.polygon([[{"lat":603.3614217610266,"lng":521},{"lat":603.4864464039285,"lng":574.875},{"lat":675.1148224814954,"lng":574.73681640625},{"lat":674.9897978385935,"lng":521.11181640625}]]);

const B21 = L.polygon([[{"lat":674.9394949549259,"lng":578.33935546875},{"lat":674.9394949549259,"lng":642.08935546875},{"lat":603.6754485008155,"lng":642.08935546875},{"lat":603.6754485008155,"lng":578.46435546875}]]);

const B241_L = L.polygon([[{"lat":695.8718949943545,"lng":684},{"lat":695.8718949943545,"lng":693.125},{"lat":680.9939624890227,"lng":710.4375},{"lat":654.4191443984444,"lng":714.37939453125},{"lat":654.2941197555424,"lng":684.00439453125}]]);

const A239_L = L.polygon([[{"lat":545.560590175099,"lng":640},{"lat":494.95051705288813,"lng":640.133544921875},{"lat":494.99293980859187,"lng":518.125},{"lat":545.5587173145509,"lng":518.125}]]);


const A239 = L.polygon([[{"lat":545.5169408749574,"lng":643.559326171875},{"lat":545.4544285535064,"lng":659.184326171875},{"lat":526.4506828324104,"lng":659.246826171875},{"lat":526.4506828324104,"lng":643.496826171875}],[{"lat":545.3936255533451,"lng":661.469970703125},{"lat":545.4561378747961,"lng":676.032470703125},{"lat":526.3898798322491,"lng":676.094970703125},{"lat":526.3273675107981,"lng":661.407470703125}],[{"lat":545.3936255533451,"lng":678.282470703125},{"lat":545.4561378747961,"lng":691.907470703125},{"lat":526.4523921537,"lng":691.844970703125},{"lat":526.514904475151,"lng":678.344970703125}],[{"lat":515.6052834381777,"lng":642.722900390625},{"lat":515.4177464738248,"lng":658.472900390625},{"lat":495.03872968080725,"lng":658.285400390625},{"lat":494.97621735935627,"lng":642.847900390625}],[{"lat":515.4177464738248,"lng":660.660400390625},{"lat":515.5427711167267,"lng":675.347900390625},{"lat":495.03872968080725,"lng":675.160400390625},{"lat":495.03872968080725,"lng":660.660400390625}],[{"lat":515.6052834381777,"lng":677.544189453125},{"lat":515.5427711167267,"lng":691.856689453125},{"lat":495.1012420022582,"lng":691.856689453125},{"lat":495.16375432370916,"lng":677.544189453125}]]);

const A238_2 = L.polygon([[{"lat":545.5129543255014,"lng":716.9697265625},{"lat":545.4903243005897,"lng":730.6787109375},{"lat":531.5500766170225,"lng":732.8662109375},{"lat":531.4250519741205,"lng":716.9912109375}]]);

const A238_1 = L.polygon([[{"lat":529.2371207233364,"lng":717.1162109375},{"lat":529.2371207233364,"lng":733.1162109375},{"lat":513.4215033962399,"lng":735.4912109375},{"lat":513.4215033962399,"lng":716.9287109375}]]);

const A238 = L.polygon([[{"lat":511.20109504095205,"lng":717.077392578125},{"lat":511.263607362403,"lng":735.764892578125},{"lat":495.69803932111046,"lng":738.264892578125},{"lat":495.4479900353066,"lng":717.202392578125}]]);


const A22 = L.polygon([[{"lat":440.7160980877108,"lng":518.28955078125},{"lat":440.7160980877108,"lng":628.53955078125},{"lat":391.3313641414413,"lng":628.53955078125},{"lat":391.7064380701471,"lng":518.53955078125}]]);

const A21 = L.polygon([[{"lat":426.4892556947506,"lng":632},{"lat":426.4892556947506,"lng":695.25},{"lat":391.6073803251071,"lng":695.375},{"lat":391.85742961091097,"lng":632.125}]]);

const A233 = L.polygon([[{"lat":406.3585665447963,"lng":716.9986572265625},{"lat":406.3215965912146,"lng":734.9056396484375},{"lat":395.125,"lng":734.8687744140625},{"lat":395.0858077047153,"lng":717.0147705078125}]]);

const ADI2 = L.polygon([[{"lat":337.3681671953689,"lng":646.2744140625},{"lat":337.3681671953689,"lng":696.1494140625},{"lat":301.9861932541176,"lng":696.2744140625},{"lat":301.73614396831374,"lng":646.3994140625}]]);


const A23 = L.polygon([[{"lat":337.67926367008977,"lng":581.896484375},{"lat":337.55423902718786,"lng":643.521484375},{"lat":301.7971911572307,"lng":643.646484375},{"lat":301.7971911572307,"lng":582.021484375}]]);

const A225 = L.polygon([[{"lat":337.55423902718786,"lng":564.8583984375},{"lat":337.4292143842859,"lng":579.2333984375},{"lat":303.29748687205404,"lng":579.2333984375},{"lat":303.1724622291521,"lng":564.8583984375}]]);

const A224_L = L.polygon([[{"lat":337.61479783859346,"lng":517.5},{"lat":337.61479783859346,"lng":562},{"lat":287.72996532071613,"lng":562.125},{"lat":287.47991603491226,"lng":517.625}]]);

const A232 = L.polygon([[{"lat":392.84066179633317,"lng":717.005126953125},{"lat":392.84066179633317,"lng":735.25},{"lat":375.86048533075257,"lng":735.25},{"lat":375.86048533075257,"lng":717.005126953125}]]);

const A231 = L.polygon([[{"lat":357.73434839686723,"lng":717.229736328125},{"lat":373.4249410810617,"lng":717.229736328125},{"lat":373.4249410810617,"lng":735.229736328125},{"lat":357.73434839686723,"lng":735.229736328125}]]);

const A230 = L.polygon([[{"lat":339.6660897987347,"lng":717.229736328125},{"lat":355.4817071258311,"lng":717.229736328125},{"lat":355.4817071258311,"lng":735.354736328125},{"lat":339.6660897987347,"lng":735.354736328125}]]);

const A229 = L.polygon([[{"lat":323.4145955427711,"lng":717.104736328125},{"lat":337.6048925121422,"lng":717.104736328125},{"lat":337.6048925121422,"lng":735.229736328125},{"lat":323.4145955427711,"lng":735.229736328125}]]);

const A228 = L.polygon([[{"lat":304.5637119827231,"lng":717.042236328125},{"lat":321.06696484578026,"lng":717.042236328125},{"lat":321.06696484578026,"lng":735.229736328125},{"lat":304.5637119827231,"lng":735.229736328125}]]);

const A227 = L.polygon([[{"lat":286.60680345717515,"lng":716.917236328125},{"lat":302.42242078427154,"lng":716.917236328125},{"lat":302.42242078427154,"lng":735.292236328125},{"lat":286.60680345717515,"lng":735.292236328125}]]);

const A224 = L.polygon([[{"lat":263.61371355090773,"lng":664.625},{"lat":282.6174592720039,"lng":664.625},{"lat":282.6174592720039,"lng":683.25},{"lat":263.61371355090773,"lng":683.25}]]);

const A222_1 = L.polygon([[{"lat":245.2350910443214,"lng":659.625},{"lat":260.73814676416293,"lng":659.625},{"lat":260.73814676416293,"lng":683.375},{"lat":245.2350910443214,"lng":683.375}]]);

const A222_2 = L.polygon([[{"lat":226.4749448895102,"lng":659.6875},{"lat":243.30492230765094,"lng":659.6875},{"lat":243.30492230765094,"lng":682.59814453125},{"lat":226.4749448895102,"lng":682.59814453125}]]);

const A222_3 = L.polygon([[{"lat":207.57229331326056,"lng":659.689453125},{"lat":224.95071867663134,"lng":659.689453125},{"lat":224.95071867663134,"lng":682.814453125},{"lat":207.57229331326056,"lng":682.814453125}]]);

const A214 = L.polygon([[{"lat":186.9371225155474,"lng":659.748779296875},{"lat":204.0654985931143,"lng":659.748779296875},{"lat":204.0654985931143,"lng":681.811279296875},{"lat":186.9371225155474,"lng":681.811279296875}]]);

const A220 = L.polygon([[{"lat":184.60749457856156,"lng":757.256103515625},{"lat":184.60749457856156,"lng":784.881103515625},{"lat":164.66606403570086,"lng":787.943603515625},{"lat":164.66606403570086,"lng":757.381103515625}]]);

const A219 = L.polygon([[{"lat":161.71748481101136,"lng":757.227294921875},{"lat":161.71748481101136,"lng":788.352294921875},{"lat":147.46467552018927,"lng":790.602294921875},{"lat":147.52718784164023,"lng":757.289794921875}]]);

const A218 = L.polygon([[{"lat":145.11655644568705,"lng":763.973876953125},{"lat":144.99153180278512,"lng":790.848876953125},{"lat":121.5494112586698,"lng":794.473876953125},{"lat":121.48689893721883,"lng":764.098876953125}]]);

const A217 = L.polygon([[{"lat":119.29896768643476,"lng":756.473876953125},{"lat":119.29896768643476,"lng":794.661376953125},{"lat":110.45957892001366,"lng":796.2099609375},{"lat":95.7691833790347,"lng":784.3349609375},{"lat":95.83169570048568,"lng":756.5224609375}]]);

const A215_L = L.polygon([[{"lat":146.59030615445278,"lng":679.58447265625},{"lat":163.78119455347064,"lng":679.58447265625},{"lat":163.78119455347064,"lng":734.20947265625},{"lat":146.59030615445278,"lng":734.20947265625}]]);

const sala_de_juntas = L.polygon([[{"lat":143.36042148323386,"lng":679.62939453125},{"lat":143.36042148323386,"lng":734.19189453125},{"lat":106.4796169596932,"lng":734.216064453125},{"lat":106.66715392404609,"lng":679.716064453125}]]);

const A211 = L.polygon([[{"lat":164.36865445274836,"lng":638.125},{"lat":164.4311667741993,"lng":656.0625},{"lat":117.38771461727333,"lng":655.933349609375},{"lat":117.26268997437138,"lng":626.433349609375},{"lat":153.89515453339786,"lng":626.433349609375},{"lat":153.83264221194688,"lng":638.120849609375}]]);

const A211_L = L.polygon([[{"lat":117.22697120812947,"lng":594.17236328125},{"lat":153.92170389985125,"lng":594.17236328125},{"lat":153.92170389985125,"lng":624.29736328125},{"lat":117.22697120812947,"lng":624.29736328125}]]);

const A210_L = L.polygon([[{"lat":117.34063435310142,"lng":542.086181640625},{"lat":154.16039168772514,"lng":542.086181640625},{"lat":154.16039168772514,"lng":590.711181640625},{"lat":117.34063435310142,"lng":590.711181640625}]]);


const A210 = L.polygon([[{"lat":117.27812203165044,"lng":525.773681640625},{"lat":136.53191703855046,"lng":525.773681640625},{"lat":136.53191703855046,"lng":540.398681640625},{"lat":117.27812203165044,"lng":540.398681640625}]]);

const ADI1 = L.polygon([[{"lat":117.41691309568614,"lng":476.59912109375},{"lat":164.8012527555245,"lng":476.59912109375},{"lat":164.8012527555245,"lng":523.22412109375},{"lat":117.41691309568614,"lng":523.22412109375}]]);

const A208_S = L.polygon([[{"lat":117.16149165725756,"lng":411.27392578125},{"lat":164.67085595999785,"lng":411.27392578125},{"lat":164.67085595999785,"lng":472.89892578125},{"lat":117.16149165725756,"lng":472.89892578125}]]);

const servicios_informaticos = L.polygon([[{"lat":117.04135078946896,"lng":325.9521484375},{"lat":164.80076437801316,"lng":325.9521484375},{"lat":164.80076437801316,"lng":407.5771484375},{"lat":117.04135078946896,"lng":407.5771484375}]]);

const A202_L = L.polygon([[{"lat":117.11016497302722,"lng":278.125},{"lat":164.86957856157142,"lng":278.125},{"lat":164.86957856157142,"lng":322.75},{"lat":117.11016497302722,"lng":322.75}]]);

const salon_de_actos = L.polygon([[{"lat":287.0936318260838,"lng":235.8935546875},{"lat":286.9686071831819,"lng":288.6435546875},{"lat":197.8592464648637,"lng":288.4736328125},{"lat":197.8592464648637,"lng":239.5986328125},{"lat":215.61274575694034,"lng":239.7236328125},{"lat":215.73777039984228,"lng":232.0986328125},{"lat":281.4377318673047,"lng":228.810546875},{"lat":281.31270722440274,"lng":236.060546875}]]);

const A206 = L.polygon([{"lat":187.39624666200692,"lng":384.7822265625},{"lat":205.14974595408356,"lng":384.7822265625},{"lat":205.14974595408356,"lng":402.6572265625},{"lat":187.39624666200692,"lng":402.6572265625}]);

const terraza = L.polygon([[{"lat":224.74507141961038,"lng":653.74169921875},{"lat":190.61334390737852,"lng":653.74169921875},{"lat":191.113590336398,"lng":421.125},{"lat":225.24531784862984,"lng":421}]]);

B248.options.name = "B248";
B249.options.name = "B249";
B22.options.name = "B22";
B21.options.name = "B21";
B241_L.options.name = "B241_L";
A239_L.options.name = "A239_L";
A239.options.name = "A239";
A238_2.options.name = "A238_2";
A238_1.options.name = "A238_1";
A238.options.name = "A238";
A22.options.name = "A22";
A21.options.name = "A21";
A233.options.name = "A233";
ADI2.options.name = "ADI2";
A23.options.name = "A23";
A225.options.name = "A225";
A224_L.options.name = "A224_L";
A232.options.name = "A232";
A231.options.name = "A231";
A230.options.name = "A230";
A229.options.name = "A229";
A228.options.name = "A228";
A227.options.name = "A227";
A224.options.name = "A224";
A222_1.options.name = "A222_1";
A222_2.options.name = "A222_2";
A222_3.options.name = "A222_3";
A214.options.name = "A214";
A220.options.name = "A220";
A219.options.name = "A219";
A218.options.name = "A218";
A217.options.name = "A217";
A215_L.options.name = "A215_L";
sala_de_juntas.options.name = "sala_de_juntas";
A211.options.name = "A211";
A211_L.options.name = "A211_L";
A210_L.options.name = "A210_L";
A210.options.name = "A210";
ADI1.options.name = "ADI1";
A208_S.options.name = "A208_S";
servicios_informaticos.options.name = "servicios_informaticos";
A202_L.options.name = "A202_L";
salon_de_actos.options.name = "salon_de_actos";
A206.options.name = "A206";
terraza.options.name = "terraza";


const layerGroupPlanta2 = L.layerGroup([
    B248,
    B249,
    B22,
    B21,
    B241_L,
    A239_L,
    A239,
    A238_2,
    A238_1,
    A238,
    A22,
    A21,
    A233,
    ADI2,
    A23,
    A225,
    A224_L,
    A232,
    A231,
    A230,
    A229,
    A228,
    A227,
    A224,
    A222_1,
    A222_2,
    A222_3,
    A214,
    A220,
    A219,
    A218,
    A217,
    A215_L,
    sala_de_juntas,
    A211,
    A211_L,
    A210_L,
    A210,
    ADI1,
    A208_S,
    servicios_informaticos,
    A202_L,
    salon_de_actos,
    A206,
    terraza
])

//PLANTA 3 AULAS CLICKABLES

const B335 = L.polygon([[{"lat":686.3103191031776,"lng":487.0625},{"lat":686.6853930318835,"lng":500.0625},{"lat":664.3684942738857,"lng":500.1875},{"lat":664.3059819524348,"lng":483.875}]]);

const B336 = L.polygon([[{"lat":607.3158536749288,"lng":503.150390625},{"lat":637.8218665430041,"lng":503.150390625},{"lat":637.8218665430041,"lng":517.837890625},{"lat":607.3158536749288,"lng":517.837890625}]]);

const B32 = L.polygon([[{"lat":599.4818628241662,"lng":520.875},{"lat":672.9963528505117,"lng":520.875},{"lat":672.9963528505117,"lng":573.625},{"lat":599.4818628241662,"lng":573.625}]]);

const B31 = L.polygon([[{"lat":599.6068874670682,"lng":576.5},{"lat":672.9963528505117,"lng":576.5},{"lat":672.9963528505117,"lng":642.625},{"lat":599.6068874670682,"lng":642.625}]]);

const B328_S = L.polygon([[{"lat":693.3092841012958,"lng":683.5625},{"lat":693.5593333870996,"lng":688.1875},{"lat":687.4331258849043,"lng":701.375},{"lat":675.4932724877682,"lng":709.375},{"lat":651.7742418947255,"lng":712.74169921875},{"lat":651.8367542161765,"lng":683.74169921875}]]);

const A324_L = L.polygon([[{"lat":544.1152167679265,"lng":517},{"lat":544.1152167679265,"lng":580.875},{"lat":522.4859535458895,"lng":580.875},{"lat":522.6109781887915,"lng":629.25},{"lat":493.39086330806316,"lng":629.197265625},{"lat":493.359327114361,"lng":517.125}]]);

const A324 = L.polygon([[{"lat":543.8839375324839,"lng":631.125},{"lat":543.8839375324839,"lng":646.7578125},{"lat":524.8845972901769,"lng":646.7578125},{"lat":524.8845972901769,"lng":631.125}],[{"lat":543.7163204338943,"lng":648.40625},{"lat":543.7163204338943,"lng":662.39990234375},{"lat":524.6254766161263,"lng":662.39990234375},{"lat":524.6254766161263,"lng":648.40625}],[{"lat":493.1994058820367,"lng":631.292236328125},{"lat":514.5161074968188,"lng":631.292236328125},{"lat":514.5161074968188,"lng":646.917236328125},{"lat":493.1994058820367,"lng":646.917236328125}],[{"lat":493.26191820348765,"lng":648.354736328125},{"lat":514.7036444611717,"lng":648.354736328125},{"lat":514.7036444611717,"lng":662.354736328125},{"lat":493.26191820348765,"lng":662.354736328125}],[{"lat":493.26191820348765,"lng":663.792236328125},{"lat":514.7036444611717,"lng":663.792236328125},{"lat":514.7036444611717,"lng":678.479736328125},{"lat":493.26191820348765,"lng":678.479736328125}],[{"lat":492.94935659623275,"lng":679.979736328125},{"lat":514.7036444611717,"lng":679.979736328125},{"lat":514.7036444611717,"lng":696.167236328125},{"lat":492.94935659623275,"lng":696.167236328125}]]);

const A324_S = L.polygon([[{"lat":524.7669896006954,"lng":696.127197265625},{"lat":524.7669896006954,"lng":664.0721435546875},{"lat":543.8955101752782,"lng":664.0721435546875},{"lat":543.8955101752782,"lng":696.127197265625}]]);

const A325 = L.polygon([[{"lat":509.4078131440758,"lng":716.674560546875},{"lat":509.2827885011739,"lng":734.862060546875},{"lat":493.7797327813323,"lng":737.362060546875},{"lat":493.7797327813323,"lng":716.737060546875}]]);

const A326 = L.polygon([[{"lat":544.0682093123286,"lng":716.69140625},{"lat":543.9431846694267,"lng":729.69140625},{"lat":511.1242159076653,"lng":734.75390625},{"lat":511.1867282291163,"lng":716.62890625}]]);

const EG4 = L.polygon([[{"lat":402.2412640912594,"lng":647.625},{"lat":439.43609535458893,"lng":647.625},{"lat":439.43609535458893,"lng":696.0625},{"lat":402.2412640912594,"lng":696.0625}]]);

const EG3 = L.polygon([[{"lat":402.2031404018137,"lng":629.1875},{"lat":402.2031404018137,"lng":582.2236328125},{"lat":439.6870362653906,"lng":582.2236328125},{"lat":439.6870362653906,"lng":629.1875}]]);

const A318 = L.polygon([[{"lat":439.42068794021185,"lng":631.499755859375},{"lat":439.42068794021185,"lng":645.492431640625},{"lat":402.2549733856659,"lng":645.492431640625},{"lat":402.2549733856659,"lng":631.499755859375}]]);

const A32 = L.polygon([[{"lat":388.14773419717903,"lng":518.6474609375},{"lat":439.53286242987974,"lng":518.6474609375},{"lat":439.53286242987974,"lng":579.3974609375},{"lat":388.14773419717903,"lng":579.3974609375}]]);


const EG1_EG2 = L.polygon([[{"lat":299.6336866229367,"lng":619.75},{"lat":335.6223755309425,"lng":619.75},{"lat":335.6223755309425,"lng":696.043212890625},{"lat":299.6336866229367,"lng":696.043212890625}]]);

const A311_1 = L.polygon([[{"lat":299.4277414108285,"lng":602.5625},{"lat":316.3685805240425,"lng":602.5625},{"lat":316.3685805240425,"lng":617.625},{"lat":299.4277414108285,"lng":617.625}]]);


const A311_2 = L.polygon([[{"lat":318.5565117748266,"lng":602.6875},{"lat":335.49735088804056,"lng":602.6875},{"lat":335.49735088804056,"lng":617.6875},{"lat":318.5565117748266,"lng":617.6875}]]);

const A31 = L.polygon([[{"lat":284.8042323063964,"lng":517},{"lat":335.49802856784413,"lng":517},{"lat":335.49802856784413,"lng":599.9375},{"lat":284.8042323063964,"lng":599.9375}]]);


const A320 = L.polygon([[{"lat":389.7439132032188,"lng":717.0625},{"lat":404.18425945839385,"lng":717.0625},{"lat":404.18425945839385,"lng":734.5},{"lat":389.7439132032188,"lng":734.5}]]);

const A317 = L.polygon([[{"lat":372.1872300482105,"lng":716.909912109375},{"lat":387.4402364822481,"lng":716.909912109375},{"lat":387.4402364822481,"lng":734.409912109375},{"lat":372.1872300482105,"lng":734.409912109375}]]);

const A316 = L.polygon([[{"lat":370.1875,"lng":716.963623046875},{"lat":370.1875,"lng":734.4375},{"lat":337.5533698048282,"lng":734.4375},{"lat":337.5533698048282,"lng":716.963623046875}]]);

const A315 = L.polygon([[{"lat":317.14456198361916,"lng":717.015869140625},{"lat":335.58569681165653,"lng":717.015869140625},{"lat":335.58569681165653,"lng":734.578369140625},{"lat":317.14456198361916,"lng":734.578369140625}]]);

const A314 = L.polygon([[{"lat":285.6177673082782,"lng":716.9375},{"lat":314.93604606878506,"lng":716.9375},{"lat":314.93604606878506,"lng":734.625},{"lat":285.6177673082782,"lng":734.625}]]);

const A309_L = L.polygon([[{"lat":280.18529446027566,"lng":664.25},{"lat":280.18529446027566,"lng":695.3125},{"lat":224.75347016864706,"lng":695.400390625},{"lat":224.81598249009804,"lng":659.462890625},{"lat":260.49423356094417,"lng":659.375},{"lat":260.5567458823951,"lng":664.3125}]]);

const A308 = L.polygon([[{"lat":205.20522272702834,"lng":678.587646484375},{"lat":222.70867273330106,"lng":678.587646484375},{"lat":222.70867273330106,"lng":695.400146484375},{"lat":205.20522272702834,"lng":695.400146484375}]]);

const A308_1 = L.polygon([[{"lat":205.14271040557736,"lng":659.400146484375},{"lat":222.6461604118501,"lng":659.400146484375},{"lat":222.6461604118501,"lng":677.150146484375},{"lat":205.14271040557736,"lng":677.150146484375}]]);

const A302_1 = L.polygon([[{"lat":185.6886806190297,"lng":659.178955078125},{"lat":203.31715526820437,"lng":659.178955078125},{"lat":203.31715526820437,"lng":695.428955078125},{"lat":185.6886806190297,"lng":695.428955078125}]]);

const A307 = L.polygon([[{"lat":204.0369497912074,"lng":736.478515625},{"lat":223.16572015520546,"lng":736.478515625},{"lat":223.16572015520546,"lng":754.103515625},{"lat":204.0369497912074,"lng":754.103515625}]]);

const A305_L = L.polygon([[{"lat":184.99266873667042,"lng":736.4375},{"lat":202.05853249278636,"lng":736.4375},{"lat":202.05853249278636,"lng":754.125},{"lat":184.99266873667042,"lng":754.125}]]);

const A305 = L.polygon([[{"lat":183.48944275677906,"lng":756.34033203125},{"lat":183.55195507823,"lng":782.40283203125},{"lat":166.61111596501604,"lng":785.09033203125},{"lat":166.69013679050846,"lng":756.38525390625}]]);

const ADIpi = L.polygon([[{"lat":163.85342625947632,"lng":717.3482666015625},{"lat":163.8332806871337,"lng":785.45751953125},{"lat":108.367973972615,"lng":794.1036376953125},{"lat":93.99270514095741,"lng":781.9581298828125},{"lat":94.03333792587415,"lng":737.20751953125},{"lat":105.06149244134988,"lng":737.2027587890625},{"lat":105.07152882323422,"lng":717.3946533203125}]]);

const A303_L = L.polygon([[{"lat":105.13710414538417,"lng":679.23046875},{"lat":163.84467130849328,"lng":679.23046875},{"lat":163.84467130849328,"lng":714.406494140625},{"lat":105.13710414538417,"lng":714.406494140625}]]);

const A301_S1 = L.polygon([[{"lat":115.33566320769933,"lng":509.73193359375},{"lat":163.77624469057477,"lng":509.73193359375},{"lat":163.77624469057477,"lng":539.051513671875},{"lat":115.33566320769933,"lng":539.051513671875}]]);

const A301_S2 = L.polygon([[{"lat":115.3125,"lng":507.517333984375},{"lat":115.3125,"lng":491.5625},{"lat":159.31006035270713,"lng":491.5625},{"lat":159.31006035270713,"lng":507.517333984375}]]);

const A301_S3 = L.polygon([[{"lat":115.24020668673943,"lng":473.75},{"lat":159.37146374357044,"lng":473.75},{"lat":159.37146374357044,"lng":489.195068359375},{"lat":115.24020668673943,"lng":489.195068359375}]]);

const A301_S4 = L.polygon([[{"lat":115.30322194741652,"lng":279.8125},{"lat":163.8093210656487,"lng":279.8125},{"lat":163.8093210656487,"lng":471.5625},{"lat":115.30322194741652,"lng":471.5625}]]);

B335.options.name = "B335";
B336.options.name = "B336";
B32.options.name = "B32";
B31.options.name = "B31";
B328_S.options.name = "B328_S";
A324_L.options.name = "A324_L";
A324.options.name = "A324";
A324_S.options.name = "A324_S";
A325.options.name = "A325";
A326.options.name = "A326";
EG4.options.name = "EG4";
EG3.options.name = "EG3";
A318.options.name = "A318";
A32.options.name = "A32";
EG1_EG2.options.name = "EG1_EG2";
A311_1.options.name = "A311_1";
A311_2.options.name = "A311_2";
A31.options.name = "A31";
A320.options.name = "A320";
A317.options.name = "A317";
A316.options.name = "A316";
A315.options.name = "A315";
A314.options.name = "A314";
A309_L.options.name = "A309_L";
A308.options.name = "A308";
A308_1.options.name = "A308_1";
A302_1.options.name = "A302_1";
A307.options.name = "A307";
A305_L.options.name = "A305_L";
A305.options.name = "A305";
ADIpi.options.name = "ADIpi";
A303_L.options.name = "A303_L";
A301_S1.options.name = "A301_S1";
A301_S2.options.name = "A301_S2";
A301_S3.options.name = "A301_S3";
A301_S4.options.name = "A301_S4";


const layerGroupPlanta3 = L.layerGroup([
    B335,
    B336,
    B32,
    B31,
    B328_S,
    A324_L,
    A324,
    A324_S,
    A325,
    A326,
    EG4,
    EG3,
    A318,
    A32,
    EG1_EG2,
    A311_1,
    A311_2,
    A31,
    A320,
    A317,
    A316,
    A315,
    A314,
    A309_L,
    A308,
    A308_1,
    A302_1,
    A307,
    A305_L,
    A305,
    ADIpi,
    A303_L,
    A301_S1,
    A301_S2,
    A301_S3,
    A301_S4
])


//PLANTA 4 AULAS CLICKABLES

const A404_L = L.polygon([[{"lat":264.0164922621288,"lng":657.6630859375},{"lat":264.0164922621288,"lng":662.2568359375},{"lat":269.54883271054,"lng":662.3193359375},{"lat":269.61696137337134,"lng":679.643798828125},{"lat":263.99085244278365,"lng":679.643798828125},{"lat":264.0280094583938,"lng":704.3125},{"lat":245.18393293994302,"lng":704.3125},{"lat":245.15258436833523,"lng":669.15625},{"lat":239.49521927702207,"lng":669.15625},{"lat":239.49521927702207,"lng":657.65625}]]);

const A403_A = L.polygon([[{"lat":147.8612111762281,"lng":657.3125},{"lat":147.8612111762281,"lng":699.125},{"lat":128.48239152642614,"lng":699.1875},{"lat":128.3573668835242,"lng":683},{"lat":130.85785974156317,"lng":683},{"lat":130.7953474201122,"lng":657.375}]]);

const A402_L = L.polygon([[{"lat":147.9432585981325,"lng":701.82275390625},{"lat":148.0223757549689,"lng":735.974365234375},{"lat":153.96104629281143,"lng":735.974365234375},{"lat":153.96104629281143,"lng":753.849365234375},{"lat":119.77120185673066,"lng":753.974365234375},{"lat":119.8049962363568,"lng":682.9375},{"lat":125.68115445274836,"lng":683},{"lat":125.74366677419933,"lng":701.8125}]]);

const A401_L = L.polygon([[{"lat":117.2241652777031,"lng":676.375},{"lat":117.18153641772855,"lng":734.8125},{"lat":96.11488408875029,"lng":734.8125},{"lat":96.24029069663243,"lng":676.4375}]]);


A404_L.options.name = "A404_L"
A403_A.options.name = "A403_A"
A402_L.options.name = "A402_L"
A401_L.options.name = "A401_L"

const layerGroupPlanta4 = L.layerGroup([A404_L, A403_A, A402_L, A401_L])

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

    // function changeColorDestino(e) {
    //     var layer = e.target;
    //     const polygonName = e.target.options.name;
    // console.log('Polygon name:', polygonName);
    //     if (layer instanceof L.Polygon) {
    //         layer.setStyle({
    //             color: 'green',
    //             opacity:'1'
    //         });
    //     }
    // }

   
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
                    color:'blue',
                    opacity: ' 0',
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
//     var options = {
//         position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
//         drawMarker: true,  // adds button to draw markers
//         drawPolygon: true,  // adds button to draw a polygon
//         drawPolyline: true,  // adds button to draw a polyline
//         drawCircle: true,  // adds button to draw a cricle
//         editPolygon: true,  // adds button to toggle global edit mode
//         deleteLayer: true   // adds a button to delete layers
//     };

//     // add leaflet.pm controls to the map
//     map.pm.addControls(options);
    

//     // get array of all available shapes
//     map.pm.Draw.getShapes()

//     // disable drawing mode
//     map.pm.disableDraw('Polygon');

//     // listen to when drawing mode gets enabled
//     map.on('pm:drawstart', function(e) {
//     	console.log(e)
//     });
    
//     // listen to when drawing mode gets disabled
//     map.on('pm:drawend', function(e) {
//     	console.log(e)
//     });
    
// // listen to when a new layer is created
// map.on('pm:create', function(e) {
//   console.log(e)

//   // listen to changes on the new layer
//   e.layer.on('pm:edit', function(x) {
//     console.log('edit', x)
//   });
// });
// map.pm.setGlobalOptions({pathOptions:{color:'red'}});
//-----------------------------------------------------------------------------------------


$(document).on('click', '#clickable-origen-location', async function () {
    const OrigenIcon = this.querySelector("i");
    OrigenIcon.style.color = 'rgb(24, 158, 82)'
   
const DestinoIcon = document.getElementById("icon-destino-location");
    DestinoIcon.setAttribute('selected-mode','false');
    DestinoIcon.style.color =  'rgb(3, 3, 3)'
})

$(document).on('click', '#clickable-destino-location', async function () {
    const DestinoIcon = this.querySelector("i");
    DestinoIcon.style.color = 'rgb(24, 158, 82)'
    DestinoIcon.setAttribute('selected-mode','true');
   
    const OrigenIcon = document.getElementById("icon-origen-location");
    OrigenIcon.style.color =  'rgb(3, 3, 3)'
})


    $(document).on('click', '#button-see-all', async function (event) {

        changeDisplay( event, "floor-select" ) 

    })
    
    $(document).on('click', '#button-search', async function (event) {
    
        changeDisplay( event, "route-finding" ) 
    })

    function showSearchDisplay(){
        const elementTarget = document.getElementById("route-finding");
        const searchButton =  document.getElementById("button-search");
            elementTarget.style.display = "";
            searchButton.setAttribute('value', "");
    }


    function changeDisplay(event,elementToChange){
        const button = $(event.currentTarget);
        const estado_boton = button.attr('value');
        const elementTarget = document.getElementById(elementToChange);
    
        if (estado_boton === 'hidden') {
            elementTarget.style.display = "";
            button.attr('value', "");
        } else {
            elementTarget.style.display = "none";
            button.attr('value', "hidden");
        }
    }

    // const startPointSelect = document.getElementById('start-point');
    // const endPointSelect = document.getElementById('end-point');
    // const findRouteButton = document.getElementById('find-route');


    const bounds = [[0, 0], [1000, 1000]];

//--------------------------------------------------------------------------------------------------------


//  Object.values(todasLasPlantas).forEach(planta => {
//             planta.nodes.forEach(node => {
//                 if (!node.id.startsWith('nodo')) {
//                     const option1 = document.createElement('option');
//                     const option2 = document.createElement('option');
//                     option1.value = option2.value = node.id;
//                     option1.text = option2.text = node.name;
//                     startPointSelect.appendChild(option1);
//                     endPointSelect.appendChild(option2);
//                 }
//             });
//         });

// Object.values(todasLasPlantas).forEach(planta => {
//     // Sort nodes alphabetically by node.name
//     planta.nodes.sort((a, b) => a.name.localeCompare(b.name)).forEach(node => {
//         if (!node.id.startsWith('nodo')) {
//             // Create and populate options
//             const option1 = document.createElement('option');
//             const option2 = document.createElement('option');
//             option1.value = option2.value = node.id;
//             option1.text = option2.text = node.name;
//             // Append options to select elements
//             startPointSelect.appendChild(option1);
//             endPointSelect.appendChild(option2);
//         }
//     });
// });


//funcion para cambiar el valor del destino o origen en el buscador del mapa dependiendo del parametro input
async function changeDestinoOrOrigenMapa(aula){
    const inputStart = document.getElementById('combo-input-start');
    const inputEnd = document.getElementById('combo-input-end');
    
    const DestinoIcon = document.getElementById("icon-destino-location");

    let input
    
    if (DestinoIcon.getAttribute('selected-mode') === 'true') input = inputEnd

    else input = inputStart
  
try {
     const allNodes = await getAllNodes()
    const nodeFound = await iterateAndMatch(allNodes,aula, input)
    
    // if (nodeFound === true) console.log('worked')
} catch (error) {
    console.error('Something went wrong ', error.response ? error.response.data : error.message);

}
}
//function que itera sobre los nodos que se pueden seleccionar y si encuentra match con el seleccionado en el mapa lo mete
async function iterateAndMatch(allNodes, nodeId, input){

    try {
        let nodeFound
        allNodes.forEach(node => {
        
            if (node.id.toLowerCase() === nodeId.toLowerCase()||node.name.toLowerCase() === nodeId.toLowerCase()) {
                input.value = node.name;
                input.setAttribute('data-attribute',node.id);
                nodeFound = node.id
            }

        });

        return nodeFound
        
    } catch (error) {
        console.error('Error iterating nodes ', error.response ? error.response.data : error.message);
    }
}

async function findClassOnMap(nodeId){

    try {

    const allLayerGroups = [
        layerGroupPlanta0,
        layerGroupPlanta1,
        layerGroupPlanta2,
        layerGroupPlanta3,
        layerGroupPlanta4,
        layerGroupPlanta5
    ];

    allLayerGroups.forEach((layerGroup, index) => 
          layerGroup.eachLayer(async function(layer) {
        if (layer.options.name === nodeId) {

              //click en el selector de pisos para el path correspondiente, triggerea tambien removelayers()
              document.querySelector(`#floor-select .floor-button[value="${index.toString()}"]`).click()
           

            //  loadFloor(index.toString())
            layer.setStyle({
                color: 'green',
                opacity:'1'
            });
             map.flyToBounds(layer.getBounds());
        }
    })
);
    } catch (error) {
        console.error('Error finding node ', error.response ? error.response.data : error.message);
    }
}

//function que itera sobre el objeto todasLasPlantas y devuelve un array con los nodos en orden alfabetico de la propiedad node.name
async function getAllNodes(){
    try {
        let allNodes = [];
        Object.values(todasLasPlantas).forEach(planta => {
            planta.nodes.forEach(node => {
                if (!node.id.startsWith('nodo')) {
                    allNodes.push({ id: node.id, name: node.name });
                }
            });
        });
        
        // Sort allNodes alphabetically by node.name
        allNodes.sort((a, b) => a.name.localeCompare(b.name));
            return allNodes
        
    } catch (error) {
        console.error('Error getting node: ', error.response ? error.response.data : error.message);
    }
   
}


async function loadDropdownSearch (){
    try {
        const allNodes = await getAllNodes()
        await addNodesToDropdown(allNodes)  
    } catch (error) {
        
    }
 
}



//funcion que añade los valores de nodos posibles al dropdown
async function addNodesToDropdown (allNodes){

    const dropdownStart = document.getElementById('combo-dropdown-start');
    const dropdownEnd = document.getElementById('combo-dropdown-end');
    
    // Clear existing content before appending new items
    dropdownStart.innerHTML = '';
    dropdownEnd.innerHTML = '';
    

allNodes.forEach(node => {
    const dropdownItem1 = document.createElement('div');
    dropdownItem1.classList.add('dropdown-item');
    dropdownItem1.textContent = node.name;
    dropdownItem1.setAttribute('value', node.id);

    const dropdownItem2 = dropdownItem1.cloneNode(true);

    dropdownItem1.addEventListener('click', () => {
        document.getElementById('combo-input-start').value = node.name;
        dropdownStart.style.display = 'none';
    });

    dropdownItem2.addEventListener('click', () => {
        document.getElementById('combo-input-end').value = node.name;
        dropdownEnd.style.display = 'none';
    });

    dropdownStart.appendChild(dropdownItem1);
    dropdownEnd.appendChild(dropdownItem2);
});

}


//CARGA OPCIONES EN EL BUSCADOR
// let allNodes = [];
// Object.values(todasLasPlantas).forEach(planta => {
//     planta.nodes.forEach(node => {
//         if (!node.id.startsWith('nodo')) {
//             allNodes.push({ id: node.id, name: node.name });
//         }
//     });
// });

// // Sort allNodes alphabetically by node.name
// allNodes.sort((a, b) => a.name.localeCompare(b.name));

// Clear startPointSelect and endPointSelect before appending sorted options
// startPointSelect.innerHTML = '';
// endPointSelect.innerHTML = '';

// // Create and append sorted options
// allNodes.forEach(node => {
//     const option1 = document.createElement('option');
//     const option2 = document.createElement('option');
//     option1.value = option2.value = node.id;
//     option1.text = option2.text = node.name;
//     startPointSelect.appendChild(option1);
//     endPointSelect.appendChild(option2);
// });

const dropdownStart = document.getElementById('combo-dropdown-start');
const dropdownEnd = document.getElementById('combo-dropdown-end');

// Clear existing content before appending new items
// dropdownStart.innerHTML = '';
// dropdownEnd.innerHTML = '';

// allNodes.forEach(node => {
//     const dropdownItem1 = document.createElement('div');
//     dropdownItem1.classList.add('dropdown-item');
//     dropdownItem1.textContent = node.name;
//     dropdownItem1.setAttribute('value', node.id);

//     const dropdownItem2 = dropdownItem1.cloneNode(true);

//     dropdownItem1.addEventListener('click', () => {
//         document.getElementById('combo-input-start').value = node.name;
//         dropdownStart.style.display = 'none';
//     });

//     dropdownItem2.addEventListener('click', () => {
//         document.getElementById('combo-input-end').value = node.name;
//         dropdownEnd.style.display = 'none';
//     });

//     dropdownStart.appendChild(dropdownItem1);
//     dropdownEnd.appendChild(dropdownItem2);
// });


const inputStart = document.getElementById('combo-input-start');
const inputEnd = document.getElementById('combo-input-end');

// const dropdownItems = Array.from(dropdown.getElementsByClassName('dropdown-item'));

$(document).on('input','#combo-input-start', function() {
    filterOptions('combo-input-start','combo-dropdown-start')
});

$(document).on('input','#combo-input-end', function() {
    filterOptions('combo-input-end','combo-dropdown-end')
});

function filterOptions (inputVar,dropdownVar) {

   const dropdown = document.getElementById(dropdownVar)
   const input = document.getElementById(inputVar)

   const dropdownItems = Array.from(dropdown.getElementsByClassName('dropdown-item'));

   const searchText = input.value.trim().toLowerCase();

   dropdownItems.forEach(item => {
       const itemText = item.textContent.toLowerCase();
       if (itemText.includes(searchText) || searchText === '') {
           item.style.display = 'block';
       } else {
           item.style.display = 'none';
       }
   });

   dropdown.style.display = 'block';
}


$(document).on('click', '#combo-input-start', function(){
    $('#combo-input-start').trigger('input')
})

$(document).on('click', '#combo-input-end', function(){
    $('#combo-input-end').trigger('input')
})


// Close dropdown if user clicks outside
document.addEventListener('click', function(event) {
 if (!inputStart.contains(event.target) && !dropdownStart.contains(event.target)) {
        dropdownStart.style.display = 'none';
    }
    if (!inputEnd.contains(event.target) && !dropdownEnd.contains(event.target)) {
        dropdownEnd.style.display = 'none';
    }
});

document.getElementById('combo-dropdown-start').addEventListener('click', async function(event) {
    if (event.target.classList.contains('dropdown-item')) {
        const inputValue = event.target.getAttribute('value')
        const allNodes = await getAllNodes()
        const nodeFound = await iterateAndMatch(allNodes,inputValue, inputStart)
        await findClassOnMap(nodeFound)
        dropdownStart.style.display = 'none';
    }
});

document.getElementById('combo-dropdown-end').addEventListener('click', async function(event) {
    if (event.target.classList.contains('dropdown-item')) {
        const inputValue = event.target.getAttribute('value')
        const allNodes = await getAllNodes()
        const nodeFound = await iterateAndMatch(allNodes,inputValue, inputEnd)
        await findClassOnMap(nodeFound)
        dropdownEnd.style.display = 'none';
    }
});





$(document).on('input','#combo-input-end, #combo-input-start', debounce(async function(event) {
 const inputField = $(event.currentTarget)

    const inputValue = inputField.val()
  const allNodes = await getAllNodes()
  const nodeFound = await iterateAndMatch(allNodes,inputValue, inputField[0])

}, 300))




$(document).on('click','#change-route', function() {
    const temporaryValue = inputStart.value
    inputStart.value = inputEnd.value
    inputEnd.value = temporaryValue

    const temporaryAttr = inputStart.getAttribute('data-attribute');
    inputStart.setAttribute('data-attribute', inputEnd.getAttribute('data-attribute'));
    inputEnd.setAttribute('data-attribute', temporaryAttr);
});

$(document).on('click','#dismiss-finder', function() {
    const elementTarget = document.getElementById("route-finding");
    const searchButton =  document.getElementById("button-search");
        elementTarget.style.display = "none";
        searchButton.setAttribute('value', "hidden");
    
});

 function removeCurrentSelection(e) {

    const inputStart = document.getElementById('combo-input-start');
    const inputEnd = document.getElementById('combo-input-end');
    const DestinoIcon = document.getElementById("icon-destino-location");

    let input
    
    if (DestinoIcon.getAttribute('selected-mode') === 'true') input = inputEnd

    else input = inputStart

    if(window.currentClickedLayer){
        
        window.currentClickedLayer.setStyle({
                        opacity:'0'
                    });   
        if (input.getAttribute('data-attribute') === window.currentClickedLayer.options.name){
            input.setAttribute('data-attribute','')
            input.value = ''
        }   
    }
}
    
    map.on('click', removeCurrentSelection);

//function que se le aplica a todos los layers(aulas) una vez son clickadas
function CambiaAulaSeleccionada(e) {
    L.DomEvent.stopPropagation(e) //evitamos que el evento se propague, de esta manera el map.on click no se triggerea al clickar en las capas de las aulas
    var layer = e.target;
    window.currentClickedLayer = layer // guardamos la capa clickada como variable global asi podemos acceder a ella para modificarla 
    const nombreAula = e.target.options.name;
    console.log(nombreAula)
    changeDestinoOrOrigenMapa(nombreAula)
    showSearchDisplay()

    if (layer instanceof L.Polygon) {
        layer.setStyle({
            color: 'green',
            opacity:'1'
        });
    }
}

function getCurrentFloor(){

    const activeFloorValue = $('#floor-select .floor-button.active').attr('value');
    return activeFloorValue
}



// Handle selection of dropdown item
// dropdown.addEventListener('click', function(event) {
//     if (event.target.classList.contains('dropdown-item')) {
//         input.value = event.target.textContent;
//         dropdown.style.display = 'none';
//     }
// });

// Dijkstra's algorithm to find the shortest path
   

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
   
//OVERLAY OF CLICKABLE CLASSES
    function addOverlayAulas(floor) {

    let layerGroup

    const allLayerGroups = [
        layerGroupPlanta0,
        layerGroupPlanta1,
        layerGroupPlanta2,
        layerGroupPlanta3,
        layerGroupPlanta4,
        layerGroupPlanta5
    ];

    allLayerGroups.forEach(group => map.removeLayer(group));

        switch (floor) {
            
            case '0':
               layerGroup = layerGroupPlanta0
              
                break;
            case '1':
                // console.log(floor)
                layerGroup = layerGroupPlanta1
               
                break;
            case '2':
                // console.log(floor)
                layerGroup = layerGroupPlanta2
                break;
            case '3':
                // console.log(floor)
                layerGroup = layerGroupPlanta3
                break;
            case '4':
                // console.log(floor)
                layerGroup = layerGroupPlanta4
                break;
            case '5':
                // console.log(floor)
                layerGroup = layerGroupPlanta5
                break;
        
            default:
                console.log('invalid')
                break;
        }

        layerGroup.eachLayer(function (layer) {
         if (layer instanceof L.Polygon) {
          
             changeAllPolygonsOpacity(layerGroup);

               // Remove existing event listeners
               layer.off('click');
               layer.off('dblclick');

             layer.on('click', function() {
                 changeAllPolygonsOpacity(layerGroup);
             });
             layer.on('click', CambiaAulaSeleccionada);
            //  layer.on('dblclick', changeColorOrigen);
   
         }
         
         });
       layerGroup.addTo(map)
    }

//CHARGE SVG MAPS
    let currentLayer = null;

    function loadFloor(floor) {
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }
        addOverlayAulas(floor)
    
        
        const svgUrl = `/img/planta_${floor}.svg`;

            //   const geojsonLayer = L.geoJSON(geojsonFeatures).addTo(map);


        currentLayer = L.imageOverlay(svgUrl, bounds).addTo(map);
        map.fitBounds(bounds);

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
        removeLayers()
    })

    // Initializar mapa en el piso 0

    
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

//en funcion del nodeId que se le entrega te dice el piso en le que se encuentra ese nodo
    function getFloorById(id, todasLasPlantas) {
        for (const planta in todasLasPlantas) {
            if (todasLasPlantas[planta].nodes.some(node => node.id === id)) {
                const plantaAsociada = planta.match(/\d+/); // Extract number from the floor string
                return plantaAsociada ? plantaAsociada[0] : null;
            }
        }
        return null; // Return null if the id is not found in any floor
    }


    document.getElementById('find-route').addEventListener('click', () => {
        const startPoint = document.getElementById('combo-input-start').getAttribute('data-attribute');
        const endPoint = document.getElementById('combo-input-end').getAttribute('data-attribute');
    
        //redirige a la planta en la que se encutra el pto de salida
        // document.querySelector(`#floor-select .floor-button[value="${getFloorById(startPoint,todasLasPlantas)}"]`).click()

        const path = findShortestPath(startPoint, endPoint, todasLasPlantas);
        console.log(path, 'path');
    
        if (path.length === 0) {
            alert('No route found!');
            return;
        }
    
        const pathParts = splitPathByEscalera(path);
        console.log(pathParts.length, 'pathParts');
    
        // Remove existing route if any
        if (window.currentRoute) {
            map.removeLayer(window.currentRoute);
        }
    
        let currentPartIndex = 0;
    
        function drawPathPart(index) {

            // removeLayers()

            const part = pathParts[index];

            const latlngs = part.map(id => {
                for (const planta in todasLasPlantas) {
                    const point = todasLasPlantas[planta].nodes.find(p => p.id === id);
                    if (point) return point.latlng;
                }
                return null;
            }).filter(latlng => latlng !== null);
    
            //click en el selector de pisos para el path correspondiente, triggerea tambien removelayers()
            document.querySelector(`#floor-select .floor-button[value="${getFloorById(part[0],todasLasPlantas)}"]`).click()
           

            window.currentRoute = L.polyline(latlngs, { color: '#50C153', dashArray: '5,10' }).addTo(map);
            map.fitBounds(window.currentRoute.getBounds());
    
            const startLatlng = latlngs[0];
            const endLatlng = latlngs[latlngs.length - 1];
    
//         console.log(part[part.length - 1],'end')

            if (startLatlng && index === 0) {
                window.startMarker = L.marker(startLatlng, { title: 'Origen', icon: currentPositionIcon }).addTo(map).bindPopup('Origen');
                loadLottieAnimation('/img/current_position.json','current-position-container');
            }
            
            if (endLatlng && index < pathParts.length - 1) {

                let currentFloor = parseInt( getFloorById(pathParts[index][0],todasLasPlantas), 10 )
                let nextFloor = parseInt( getFloorById(pathParts[index+1][0],todasLasPlantas), 10 )
                if (currentFloor === 5) currentFloor = -1
                if (nextFloor === 5) nextFloor = -1
                if ( nextFloor > currentFloor ){
                    window.secondEscalatorMarker = L.marker(endLatlng, { title: `subir a la planta ${nextFloor}`, icon: arrowUpIcon }).addTo(map).bindPopup(`subir a la planta ${nextFloor}`).openPopup();
                    loadLottieAnimation('./img/arrow_up.json','arrow-position-container');
                }
                else {
                    window.secondEscalatorMarker = L.marker(endLatlng, { title: `bajar a la planta ${nextFloor}`, icon: arrowDownIcon }).addTo(map).bindPopup(`bajar a la planta ${nextFloor}`).openPopup();
                    loadLottieAnimation('./img/arrow_down.json','arrow-position-container');
                }
                window.secondEscalatorMarker.on('click', () => {
                    currentPartIndex++;
                    drawPathPart(currentPartIndex);
                });
            } else if (endLatlng && index === pathParts.length - 1) {
                window.endMarker = L.marker(endLatlng, { title: 'Destino',  icon: finalIcon }).addTo(map)
                loadLottieAnimation('./img/destination.json','final-position-container');
            }
    
            if (startLatlng && index > 0) {
                window.escalatorMarker = L.marker(startLatlng, { title: 'volver', icon: currentPositionIcon }).addTo(map);
                window.escalatorMarker.on('click', () => {
                    currentPartIndex--;
                    drawPathPart(currentPartIndex);
                });
                loadLottieAnimation('/img/current_position.json','current-position-container');
            }
             
        }
        drawPathPart(currentPartIndex);
        $('#dismiss-finder').trigger('click')
    });
    
    async function loadLottieAnimation(path, container) {

        lottie.loadAnimation({
            container: document.getElementById(container), // Required
            path, // Path to the animation JSON file
            renderer: 'svg', // Required
            loop: true, // Optional, defaults to true
            autoplay: true, // Optional, defaults to true
            name: "Animation" // Name for future reference
        });
    }

    function removeLayers(){
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
    }
    
//---------------------------------------------------------------------------------------------------------------



