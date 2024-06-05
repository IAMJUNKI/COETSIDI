

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
        },
        error: function (error) {
           console.error(error)
        }
    })

    // Lunes es el default
    if (window.innerWidth < 700) {
    showDay('lunes');
    }

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
        success: function (objetoEstructurado) {
          destroySpinner()
          document.getElementById("cerrar_modal_asignaturas_2").click();
    
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

$(document).on('change', '#day-select', async function (event) {
    const dia = $(event.currentTarget).val()
    showDay(dia)
})


function showDay(day) {
    const schedule = document.querySelector('.schedule');
    const sessions = schedule.querySelectorAll('.session');
    sessions.forEach(session => {
      const gridColumn = session.style.gridColumn;
      if (gridColumn.includes(day)) {
        session.style.display = 'block';
      } else {
        session.style.display = 'none';
      }
    });
  }

  function showAllDays() {
    const schedule = document.querySelector('.schedule');
    const sessions = schedule.querySelectorAll('.session');
    sessions.forEach(session => {
        session.style.display = 'block';
    });
  }

//FUNCIONES RESPONSIVE

    window.addEventListener('resize', function() {
        handleScreenWidthChange();
    });

    function handleScreenWidthChange() {
        if (window.innerWidth >= 700) {
            showAllDays();
        } else {
            showDay(document.getElementById('day-select').value)
        }
    }

