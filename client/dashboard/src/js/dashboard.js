// //initializes as soon as the DOM is safe to manipulate
// $(function() {
   
//     //cosas tal q abres el dashboard

//   });

//IGUAL METERLO COMO FUNCION HELPER
const preventDoubleClick = function (event) {
    let timeStampGlobal = 0
    if (Math.abs(event.timeStamp - timeStampGlobal) < 500) { timeStampGlobal = event.timeStamp; return true } 
    else { timeStampGlobal = event.timeStamp; return false }
}

$(document).on('change', '#selector-grados', async function (event) {

    console.log($(event.currentTarget).val())
    const gradoElegido = $(event.currentTarget).val()
    if(gradoElegido === 'grado_electrica_electronica'||gradoElegido === 'grado_diseno_mecanica' || gradoElegido === 'erasmus'){
        $( "#curso5" ).prop( "disabled", false );
    } else{
        $( "#curso5" ).prop( "disabled", true );
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


$(document).on('submit', '#js_form_buscar_asignaturas', async function (event) {

    event.preventDefault()
    if (preventDoubleClick(event)) { return };
    console.log('somethng',event.target)
    const data = new FormData(event.target)
    console.log(data)
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
           
            
        },
        error: function (error) {
           console.error(error)
        }
    })


})