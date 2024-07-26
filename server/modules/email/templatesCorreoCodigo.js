const correoVerificacion = {}
correoVerificacion.subject = 'Código de verificación de correo'
correoVerificacion.titulo = 'Código de verificación'
correoVerificacion.contenido = 'Para poder usar tu cuenta necesitas verificarla. Este es tu código, cópialo y pégalo en la pantalla de verificación.'
correoVerificacion.imagen = 'codigo_correo.png'

const correoRecuperarContrasena = {}
correoRecuperarContrasena.subject = 'Código cambio de contraseña'
correoRecuperarContrasena.titulo = 'Código para recuperar tu contraseña'
correoRecuperarContrasena.contenido = 'Para recuperar tu contraseña copia y pega este código en la pantalla de recuperación y procede a escribir tu nueva contraseña. Si no has solicitado el cambio de contraseña omite este correo.'
correoRecuperarContrasena.imagen = 'forgot_password.png'


module.exports = {correoRecuperarContrasena, correoVerificacion}