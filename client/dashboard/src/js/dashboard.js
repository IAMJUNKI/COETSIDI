
// (() => {
//     'use strict'
  
//     // Graphs
//     const ctx = document.getElementById('myChart')
//     // eslint-disable-next-line no-unused-vars
//     const myChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: [
//           'Sunday',
//           'Monday',
//           'Tuesday',
//           'Wednesday',
//           'Thursday',
//           'Friday',
//           'Saturday'
//         ],
//         datasets: [{
//           data: [
//             15339,
//             21345,
//             18483,
//             24003,
//             23489,
//             24092,
//             12034
//           ],
//           lineTension: 0,
//           backgroundColor: 'transparent',
//           borderColor: '#007bff',
//           borderWidth: 4,
//           pointBackgroundColor: '#007bff'
//         }]
//       },
//       options: {
//         plugins: {
//           legend: {
//             display: false
//           },
//           tooltip: {
//             boxPadding: 3
//           }
//         }
//       }
//     })
//   })()
  

//BOTONES SIDEBAR


$(document).on('click', '.boton_sidebar', function () {
    const botonSeleccionado = this.id

    console.log(botonSeleccionado, 'boton seleccionado')
    // $('#js_resultado').empty()
    // $('#js_planes').empty()
    // $('#js_tabla_planes').hide()
    // $('#js_nombre_usuario').hide()
    // $('#js_num_usuario').hide()
    // $('#searchId').val('')
    // $('#searchUser').val('')
    // $('.js-funciones').hide()
    // $('#user-from').val('')
    // $('#enviar_qr_user_to').val('')
    
    // $(`#js_funcion_${botonSeleccionado}`).show()  
})