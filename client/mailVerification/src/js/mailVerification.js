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
        if (key === 'email') {
            if(value !='')    value += '@alumnos.upm.es';
        }
        data[key] = value;
    });

    console.log('Form data:', data); // Debugging line to check the form data

    $.ajax({
        url: '/auth/enviarCorreoVerificacion',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            $('#login_error_message').hide();
            console.log('Success:', response); // Debugging line to check the response
            // if (response.message === 'Signup successful') {
            //     window.location.href = '/mailVerification';
            // }
        },
        error: function (e) {
            let mensaje = e.responseJSON?.message || 'Something went wrong, please try later.';
            console.error('Error:', mensaje); // Debugging line to check the error
            $('#login_error_message').text(mensaje).show();
        }
    });
});

$(document).on('submit', '#form_verificar_correo', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    console.log(formData,'formData')
    formData.forEach((value, key) => {
        if (key === 'email') {
            if(value !='')    value += '@alumnos.upm.es';
        }
        data[key] = value;
    });

    console.log('Form data:', data); // Debugging line to check the form data

    $.ajax({
        url: '/auth/enviarCorreoVerificacion',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            $('#login_error_message').hide();
            console.log('Success:', response); // Debugging line to check the response
            // if (response.message === 'Signup successful') {
            //     window.location.href = '/mailVerification';
            // }
        },
        error: function (e) {
            let mensaje = e.responseJSON?.message || 'Something went wrong, please try later.';
            console.error('Error:', mensaje); // Debugging line to check the error
            $('#login_error_message').text(mensaje).show();
        }
    });
});
