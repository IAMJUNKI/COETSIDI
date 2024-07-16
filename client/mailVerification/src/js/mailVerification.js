document.addEventListener('DOMContentLoaded', function() {
//UNCOMMENT FOR PRODUCTION
// console.log = function () {};
// Check if the signup was successful
    if (sessionStorage.getItem('signupSuccess') === 'true') {
        // Clear the sessionStorage flag
        sessionStorage.removeItem('signupSuccess');
        // Retrieve and set the email value
        const email = sessionStorage.getItem('email');
        if (email) {
            document.getElementById('email-input').value = email;
            document.getElementById('submit_enviar_correo').click()
        }

    }
});


let timerOn = true;
function timer(remaining) {
  document.getElementById("countdown").innerHTML = `${remaining}s`;
  remaining -= 1;
  if (remaining >= 0 && timerOn) {
    setTimeout(function () {
      timer(remaining);
    }, 1000);
     document.getElementById("countdown").style.display='block'
    const resendButton = document.getElementById("resend")
    resendButton.style.pointerEvents = "none";
    resendButton.style.color = "#c5c5c5"

    return;
  }
  if (!timerOn) {
    return;
  }
  document.getElementById("countdown").style.display='none'
  const resendButton = document.getElementById("resend")
  resendButton.style.pointerEvents = "auto";
  resendButton.style.color = "#007bff"
}
// timer(60);



$(document).on('submit', '#form_enviar_correo', async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    console.log(formData,'formData')
    formData.forEach((value, key) => {
        data[key] = value;
    });
    $('#error_message').hide();

    $.ajax({
        url: '/auth/enviarCorreoVerificacion',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            if (response.message === 'succesfully sent email') {

                document.getElementById('send-verification-code').innerHTML=''
                // window.location.href = '/mailVerification';
                document.getElementById('verify-email-code').innerHTML = `
                 <p class="text-center text-primary" style="font-size: 5.5rem;"><i class="fa-solid fa-envelope-circle-check"></i></p>
                      <p class="text-center h5 ">Revisa tu correo</p>
                      <p class="text-muted text-center" style="margin: 0%;">Hemos enviado un código a</p>
                      <form id="form_verificar_correo">
                        <input class="form-control-plaintext text-muted text-center"  type="text" value="${response.email}" name="email" aria-label="correo readonly"  readonly>
                        
                        <div class="d-flex flex-row " style="margin: 20px;">
                          <input type="text" class="form-control" autofocus=""  name="codigo" required/>
                        </div>
                        <div class="d-flex justify-content-center mt-3 t-100 links-container">
                            <a href="#" id="resend" class="resalte ">Reenviar código</a>
                            <span class="mobile-text" id="countdown"></span>
                        </div>
                         <div class="cartel-error" id="error_message" style="display: none; color: red;"></div>
                        <div class="row pt-5">
                            <div class="col-6">
                                <button class="btn btn-outline-secondary w-100" id='volver-mail-verificacion' type="button">Volver</button>
                            </div>
                            <div class="col-6">
                                <button class="btn btn-primary w-100" type="submit">Verificar</button>
                            </div> 
                        </div>
                      </form>
                `
                timer(60)
            }
        },
        error: function (e) {
            let mensaje = e.responseJSON?.message || 'Algo fue mal... Prueba más tarde.';
            $('#error_message').text(mensaje).show();
        }
    });
});


$(document).on('click', '#resend', async function () {

    const form = document.getElementById('form_verificar_correo');
    
    const formData = new FormData(form);
    const data = {};
    console.log(formData,'formData')
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log('Form data:', data); // Debugging line to check the form data
    
    $('#error_message').hide();
    $.ajax({
        url: '/auth/enviarCorreoVerificacion',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log('Success:', response); 
            
            if (response.message === 'succesfully sent email') {
                timer(60)
                console.log('correo reenviado!!!!')
            }
        },
        error: function (e) {
            let mensaje = e.responseJSON?.message || 'Something went wrong, please try later.';
            console.error('Error:', mensaje); // Debugging line to check the error
            $('#error_message').text(mensaje).show();
        }
    });
});


$(document).on('click', '#volver-mail-verificacion', async function () {

    window.location.href = '/mailVerification';

});



$(document).on('submit', '#form_verificar_correo', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    console.log(formData,'formData')
    formData.forEach((value, key) => {
        data[key] = value;
    });

    $('#error_message').hide();

    $.ajax({
        url: '/auth/verificarCodigo',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log('Success:', response); 
            if (response.message === 'mail validated') {

                document.getElementById('verify-email-code').innerHTML=''

                document.getElementById('account-verified').innerHTML = `
                <p class="text-center text-success" style="font-size: 5.5rem;"><i class="fa-solid fa-circle-check"></i></p>
                <p class="text-center h5 ">Correo verificado correctamente</p>
                 <div class="d-flex justify-content-center mt-3 t-100 links-container">
                    <a href="/login" class="resalte">Ir al login</a>
                  </div>
                `
            }
        },
        error: function (e) {
            let mensaje = e.responseJSON?.message || 'Something went wrong, please try later.';
            console.error('Error:', mensaje); // Debugging line to check the error
            $('#error_message').text(mensaje).show();
        }
    });
});
