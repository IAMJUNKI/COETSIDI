$(document).ready(function () {
    console.log = function () {};
     const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        const userId = sessionStorage.getItem('userId');
      
        if (userId) {
            $.ajax({
                url: '/googleCalendar/oauth2callback',
                type: 'GET',
                data: { code: code, userId: userId },
                success: function (response) {

                    console.log(response, 'response');
                    if (response.message === 'success')
                        {
                            document.getElementById('mainDiv').innerHTML=` 
                            <p class="text-center text-success" style="font-size: 5.5rem;"><i class="fa-solid fa-circle-check"></i></p>
                            <p class="text-center h5">¡Google Calendar Actualizado!</p>
                            <div class="d-flex justify-content-center mt-3 t-100 links-container">
                                <a href="/dashboard" class="resalte" style="margin-bottom: 10px;">Volver al dashboard</a>
                            </div>
                            `
                        }
                },
                error: function (e) {
            let mensaje = e.responseJSON?.message || 'Something went wrong, please try later.';
            console.error('Error:', mensaje); 

            document.getElementById('mainDiv').innerHTML=` 
            <p class="text-center text-danger" style="font-size: 5.5rem;"><i class="fa-solid fa-circle-xmark"></i></p>
            <p class="text-center h5">Algo fue mal...</p>
            <div class="d-flex justify-content-center mt-3 t-100 links-container">
                <a href="/dashboard" class="resalte" style="margin-bottom: 10px;">Volver al dashboard</a>
            </div>
            `
        }
            });
        } else {
            console.error('User ID not found in session storage');
        }
    } else {
        console.error('Authorization code not found in URL');
    }
});
