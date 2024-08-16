document.addEventListener('DOMContentLoaded', function() {
    //UNCOMMENT FOR PRODUCTION
    // console.log = function () {};
    const images = [
        'fondo_signup_1.jpg',
        'fondo_signup_2.jpg',
        'fondo_signup_3.jpg',
        'fondo_signup_4.jpg',
        'fondo_signup_5.jpg',
        'fondo_signup_6.jpg',
        'fondo_signup_7.jpg',
        'fondo_signup_8.jpg',
        'fondo_signup_9.jpg',
        'fondo_signup_10.jpg',
        'fondo_signup_11.jpg',
        'fondo_signup_12.jpg',
        'fondo_signup_13.jpg',
        'fondo_signup_14.jpg',
        'fondo_signup_15.jpg',
        'fondo_signup_16.jpg',
        'fondo_signup_17.jpg',
        'fondo_signup_18.jpg',
        'fondo_signup_19.jpg',
        'fondo_signup_20.jpg',
    ];


    const randomIndex = Math.floor(Math.random() * images.length);


    const randomImagePath = 'img/' + images[randomIndex];

    const imgElement = document.getElementById('randomImage');
    imgElement.src = randomImagePath;
});



$(document).on('submit', '#form_login_usuarios', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log('Form data:', data); 

    $.ajax({
        url: '/auth/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log('Success:', response); 
            if (response.message === 'Login successful') {
                window.location.href = '/dashboard';
            }
        },
        error: function (e) {
            let mensaje = e.responseJSON?.message || 'Algo fue mal... Prueba más tarde.';
            console.error('Error:', mensaje); 
            $('#login_error_message').text(mensaje).show();
        }
    });
});
