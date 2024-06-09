

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

// document.addEventListener('DOMContentLoaded', () => {
//     const canvas = document.getElementById('map-canvas');
//     const ctx = canvas.getContext('2d');
//     const startPointSelect = document.getElementById('start-point');
//     const endPointSelect = document.getElementById('end-point');
//     const findRouteButton = document.getElementById('find-route');

//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     // Sample nodes and edges data
//     const nodes = [
//         { id: 'A', x: 50, y: 50 },
//         { id: 'B', x: 200, y: 50 },
//         { id: 'C', x: 50, y: 200 },
//         { id: 'D', x: 200, y: 200 },
//     ];

//     const edges = [
//         { from: 'A', to: 'B', weight: 1 },
//         { from: 'A', to: 'C', weight: 1 },
//         { from: 'B', to: 'D', weight: 1 },
//         { from: 'C', to: 'D', weight: 1 },
//     ];

//     // Populate select options
//     nodes.forEach(node => {
//         const option1 = document.createElement('option');
//         const option2 = document.createElement('option');
//         option1.value = option2.value = node.id;
//         option1.text = option2.text = node.id;
//         startPointSelect.appendChild(option1);
//         endPointSelect.appendChild(option2);
//     });

//     // Draw the map
//     function drawMap() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
        
//         // Draw edges
//         edges.forEach(edge => {
//             const fromNode = nodes.find(n => n.id === edge.from);
//             const toNode = nodes.find(n => n.id === edge.to);
//             ctx.beginPath();
//             ctx.moveTo(fromNode.x, fromNode.y);
//             ctx.lineTo(toNode.x, toNode.y);
//             ctx.stroke();
//         });

//         // Draw nodes
//         nodes.forEach(node => {
//             ctx.beginPath();
//             ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
//             ctx.fill();
//             ctx.strokeText(node.id, node.x + 10, node.y);
//         });
//     }

//     drawMap();

//     // Dijkstra's algorithm to find the shortest path
//     function findShortestPath(startId, endId) {
//         const distances = {};
//         const prev = {};
//         const pq = new Set(nodes.map(n => n.id));

//         distances[startId] = 0;

//         nodes.forEach(node => {
//             if (node.id !== startId) distances[node.id] = Infinity;
//             prev[node.id] = null;
//         });

//         while (pq.size > 0) {
//             const closestNode = [...pq].reduce((min, nodeId) => 
//                 distances[nodeId] < distances[min] ? nodeId : min, [...pq][0]);

//             pq.delete(closestNode);

//             if (closestNode === endId) {
//                 const path = [];
//                 let step = endId;
//                 while (prev[step]) {
//                     path.push(step);
//                     step = prev[step];
//                 }
//                 return path.concat(startId).reverse();
//             }

//             const neighbors = edges
//                 .filter(edge => edge.from === closestNode || edge.to === closestNode)
//                 .map(edge => edge.from === closestNode ? edge.to : edge.from);

//             neighbors.forEach(neighbor => {
//                 const alt = distances[closestNode] + edges.find(edge => 
//                     (edge.from === closestNode && edge.to === neighbor) || 
//                     (edge.to === closestNode && edge.from === neighbor)).weight;

//                 if (alt < distances[neighbor]) {
//                     distances[neighbor] = alt;
//                     prev[neighbor] = closestNode;
//                 }
//             });
//         }
//         return [];
//     }

//     // Handle the route finding
//     findRouteButton.addEventListener('click', () => {
//         const start = startPointSelect.value;
//         const end = endPointSelect.value;
//         if (start && end) {
//             const path = findShortestPath(start, end);
//             console.log('Shortest path:', path);

//             // Redraw the map with the path highlighted
//             drawMap();
//             ctx.strokeStyle = 'red';
//             for (let i = 0; i < path.length - 1; i++) {
//                 const fromNode = nodes.find(n => n.id === path[i]);
//                 const toNode = nodes.find(n => n.id === path[i + 1]);
//                 ctx.beginPath();
//                 ctx.moveTo(fromNode.x, fromNode.y);
//                 ctx.lineTo(toNode.x, toNode.y);
//                 ctx.stroke();
//             }
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {

    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 5
    });

  
    var marker = L.marker([51.5, 500]).addTo(map);
    // var polygon = L.polygon([
    //     [432.1, 658.99],
    //     [600, 300],
    //     [200, -400],
    //     [0, 400]
    // ]).addTo(map);

    var B01 = L.polygon([
        [{"lat":692.36,"lng":591.75},{"lat":694.74,"lng":656},{"lat":658.47,"lng":656.5},{"lat":658.22,"lng":645.75},{"lat":619.453,"lng":645.875},{"lat":619.32878,"lng":606,"alt":25},{"lat":623.956,"lng":606.375},{"lat":624.206,"lng":591.875}]
    ]).addTo(map);


    var A21 = L.polygon([
        [692.36, 591.75],
        [619.453, 645.875],
        [619.32878, 606,25],
        [623.956, 606.375],
        [624.206, 591.875]
    ]).addTo(map);

    var B03 = L.polygon([
        [692.36, 591.75],
        [623.956, 606.375],
        [624.206, 591.875]
    ]).addTo(map);

    // B01.style.color = 'red'

//cambia el color de cualquier layer de tipo vector (poligono etc)
//   B01.setStyle({color:'green'})

    // map.fitBounds(B01.getBounds());

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

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

    function changeColor(e) {
        var layer = e.target;
        if (layer instanceof L.Polygon) {
            layer.setStyle({
                color: 'green'
            });
        }
    }

    function getInfoXY(e) {
        var layer = e.target;
        if (layer instanceof L.Polygon) {
           console.log(JSON.stringify(layer.getLatLngs()), 'layer info')
    
        }
    }


    function changeAllPolygonsColor() {
        map.eachLayer(function(layer) {
            
            if (layer instanceof L.Polygon) {
                layer.setStyle({
                    color: '#3388ff'
                });
            }
        });
    }


    // If you want to use map event delegation
    map.eachLayer(function (layer) {

        if (layer instanceof L.Polygon) {

            
            layer.on('click', function() {
                changeAllPolygonsColor();
            });
            layer.on('click', changeColor);
            layer.on('click', getInfoXY)
            
        }
    });
    
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
    var latlngs = [
        [ // first polygon
          [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
          [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
        ],
        [ // second polygon
          [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
        ]
      ];
      var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);

// B01.bindPopup("I am a polygon.");

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

    // Sample nodes and edges data for each floor including inter-floor connections
    const floorData = {
        baja: {
            nodes: [
                { id: 'bajaA', x: 100, y: 100 },
                { id: 'bajaB', x: 200, y: 100 },
                { id: 'bajaC', x: 100, y: 200 },
                { id: 'bajaD', x: 200, y: 200 },
                { id: 'E_baja', x: 150, y: 150 } // Elevator node
            ],
            edges: [
                { from: 'bajaA', to: 'bajaB', weight: 1 },
                { from: 'bajaA', to: 'bajaC', weight: 1 },
                { from: 'bajaB', to: 'bajaD', weight: 1 },
                { from: 'bajaC', to: 'bajaD', weight: 1 },
                { from: 'bajaC', to: 'E_baja', weight: 1 },
                { from: 'bajaD', to: 'E_baja', weight: 1 }
            ]
        },
        0: {
            nodes: [
                { id: '0A', x: 100, y: 100 },
                { id: '0B', x: 200, y: 100 },
                { id: '0C', x: 100, y: 200 },
                { id: '0D', x: 200, y: 200 },
                { id: 'E0', x: 150, y: 150 } // Elevator node
            ],
            edges: [
                { from: '0A', to: '0B', weight: 1 },
                { from: '0A', to: '0C', weight: 1 },
                { from: '0B', to: '0D', weight: 1 },
                { from: '0C', to: '0D', weight: 1 },
                { from: '0C', to: 'E0', weight: 1 },
                { from: '0D', to: 'E0', weight: 1 }
            ]
        },
        1: {
            nodes: [
                { id: '1A', x: 100, y: 100 },
                { id: '1B', x: 200, y: 100 },
                { id: '1C', x: 100, y: 200 },
                { id: '1D', x: 200, y: 200 },
                { id: 'E1', x: 150, y: 150 } // Elevator node
            ],
            edges: [
                { from: '1A', to: '1B', weight: 1 },
                { from: '1A', to: '1C', weight: 1 },
                { from: '1B', to: '1D', weight: 1 },
                { from: '1C', to: '1D', weight: 1 },
                { from: '1C', to: 'E1', weight: 1 },
                { from: '1D', to: 'E1', weight: 1 }
            ]
        },
        2: {
            nodes: [
                { id: '2A', x: 100, y: 100 },
                { id: '2B', x: 200, y: 100 },
                { id: '2C', x: 100, y: 200 },
                { id: '2D', x: 200, y: 200 },
                { id: 'E2', x: 150, y: 150 } // Elevator node
            ],
            edges: [
                { from: '2A', to: '2B', weight: 1 },
                { from: '2A', to: '2C', weight: 1 },
                { from: '2B', to: '2D', weight: 1 },
                { from: '2C', to: '2D', weight: 1 },
                { from: '2C', to: 'E2', weight: 1 },
                { from: '2D', to: 'E2', weight: 1 }
            ]
        },
        3: {
            nodes: [
                { id: '3A', x: 100, y: 100 },
                { id: '3B', x: 200, y: 100 },
                { id: '3C', x: 100, y: 200 },
                { id: '3D', x: 200, y: 200 },
                { id: 'E3', x: 150, y: 150 } // Elevator node
            ],
            edges: [
                { from: '3A', to: '3B', weight: 1 },
                { from: '3A', to: '3C', weight: 1 },
                { from: '3B', to: '3D', weight: 1 },
                { from: '3C', to: '3D', weight: 1 },
                { from: '3C', to: 'E3', weight: 1 },
                { from: '3D', to: 'E3', weight: 1 }
            ]
        },
    };

    const interFloorEdges = [
        { from: 'E1', to: 'E2', weight: 1 }
    ];

    let currentLayer = null;

    function loadFloor(floor) {
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }

        const svgUrl = `/img/planta_${floor}.svg`;

        currentLayer = L.imageOverlay(svgUrl, bounds).addTo(map);
        map.fitBounds(bounds);

        // Clear and populate the start and end point selects
        startPointSelect.innerHTML = '';
        endPointSelect.innerHTML = '';

        Object.values(floorData).forEach(floor => {
            floor.nodes.forEach(node => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = option2.value = node.id;
                option1.text = option2.text = node.id;
                startPointSelect.appendChild(option1);
                endPointSelect.appendChild(option2);
            });
        });
    }
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
    loadFloor(0);

    // Dijkstra's algorithm to find the shortest path
    function findShortestPath(startId, endId) {
        const nodes = Object.values(floorData).flatMap(floor => floor.nodes);
        const edges = Object.values(floorData).flatMap(floor => floor.edges).concat(interFloorEdges);
        const distances = {};
        const prev = {};
        const pq = new Set(nodes.map(n => n.id));

        distances[startId] = 0;

        nodes.forEach(node => {
            if (node.id !== startId) distances[node.id] = Infinity;
            prev[node.id] = null;
        });

        while (pq.size > 0) {
            const closestNode = [...pq].reduce((min, nodeId) => 
                distances[nodeId] < distances[min] ? nodeId : min, [...pq][0]);

            pq.delete(closestNode);

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
                const alt = distances[closestNode] + edges.find(edge => 
                    (edge.from === closestNode && edge.to === neighbor) || 
                    (edge.to === closestNode && edge.from === neighbor)).weight;

                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    prev[neighbor] = closestNode;
                }
            });
        }
        return [];
    }

    // Handle the route finding
    findRouteButton.addEventListener('click', () => {
        const start = startPointSelect.value;
        const end = endPointSelect.value;
        if (start && end) {
            const path = findShortestPath(start, end);
            console.log('Shortest path:', path);

            // Redraw the map with the path highlighted
            const floorToNodesMap = Object.keys(floorData).reduce((acc, floor) => {
                acc[floor] = floorData[floor].nodes.reduce((obj, node) => {
                    obj[node.id] = node;
                    return obj;
                }, {});
                return acc;
            }, {});

            path.forEach((nodeId, index) => {
                const floor = nodeId[0];
                const currentNode = floorToNodesMap[floor][nodeId];

                if (index === 0 || nodeId[0] !== path[index - 1][0]) {
                    loadFloor(floor);
                }

                const nextNodeId = path[index + 1];
                if (nextNodeId && nodeId[0] === nextNodeId[0]) {
                    const nextNode = floorToNodesMap[floor][nextNodeId];
                    L.polyline(
                        [[currentNode.y, currentNode.x], [nextNode.y, nextNode.x]], 
                        { color: 'red' }
                    ).addTo(map);
                }
            });
        }
    });
});