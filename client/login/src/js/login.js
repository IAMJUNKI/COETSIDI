$(document).on('submit', '#form_login_usuarios', async function (event){
event.preventDefault()

const data = new FormData(event.target)

for (const p of data) {
    console.log(p); console.log('p')
}


$.ajax({
    url: '/auth/login',
    type: 'POST',
    data,
    // cache: false,
    // contentType: false,
    // processData: false,
    success: function (x) {
      

    },
    error: function  (e) {
        // $('.js-boton-spinner.clicked').removeClass('clicked')
        console.error('ERROR______________________'.e.responseText)
    }
})



})