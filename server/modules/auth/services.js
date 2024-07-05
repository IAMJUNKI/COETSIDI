const { passport } = require('@auth/helpers/passportStrategies');

const { knex } = require('@db/knex.js');
const Usuarios = require('@db/models/usuarios.js')

const debug = require('debug')('&:SIGNUP_LOGIN_SERVICES')
const {encryptPassword} = require("@auth/helpers/encryptDecrypt")
const {createRandomString} = require('@utils/utils.js')

async function authenticateUser(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.error('Error during authentication:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        } else if (!user) {
            console.warn('Authentication failed:', info.message);
            return res.status(401).json({ message: info.message });
        } else {
            req.logIn(user, function (err) {
                if (err) {
                    console.error('Error during login:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                } else {
                    return res.status(200).json({ message: 'Login successful' });
                }
            });
        }
    })(req, res, next);
}


async function signupNewUser(req, res) {
    try {
        const {name, email, password} = req.body
    
        const existingUser = await verifyUserAlreadyExists(email)
        if (existingUser)  return res.status(400).json({ message: 'Usuario ya existe' });
    
        const encryptedPassword = await encryptPassword(password)
    
         const done = await createNewUser(name, email, encryptedPassword)
    
         console.log(done,'done')
        return res.status(200).json({ message: 'Signup successful' })
    } catch (error) {
        debug('SIGN UP NEW USER')
        debug(error)
        res.status(500).json('Algo fue mal, vuelve a intentarlo más tarde!')
    }

}



async function verifyUserAlreadyExists(email) {
   try {
       const userAlreadyExists = await knex('t_usuarios').where({ email }).first('id','validated')
       
       if (userAlreadyExists) return userAlreadyExists
        else return undefined
   } catch (error) {
    console.error('error verifying if user exists',error)
    res.status(500).json('Algo fue mal, vuelve a intentarlo más tarde!')
   } 
}


async function createNewUser(username, email, password) {
    try {

       const done = await Usuarios.create({
            username,
            email,
            password,
            role: 'alumno'
        });
return done
    } catch (error) {
        console.error('error creating NEW USER',error)
        res.status(500).json('Algo fue mal, vuelve a intentarlo más tarde!')
    }
}



async function enviarCorreo(req, res) {
    try {
        const {email} = req.body
    
        const existingUser = await verifyUserAlreadyExists(email)
        console.log(existingUser,'existingUser')
        if (!existingUser)  return res.status(400).json({ message: 'El usuario no existe' });

        if ( existingUser.validated === true)  return res.status(400).json({ message: 'Ya se ha verificado' });
    
        const codigo = createRandomString(8)
        
        await sendEmailCodigoVerificacion(email, codigo) //TODO crear en helpers, mirar api google

        await guardarCodigoDB(email, codigo)

        //  console.log(done,'done')
        return res.status(200).json({ message: 'Signup successful' })
    } catch (error) {
        debug('SIGN UP NEW USER')
        debug(error)
        res.status(500).json('Algo fue mal, vuelve a intentarlo más tarde!')
    }

}




module.exports = {
    authenticateUser,
    signupNewUser,
    enviarCorreo

};
