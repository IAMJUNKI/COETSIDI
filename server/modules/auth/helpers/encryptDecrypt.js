
const { knex } = require('@db/knex.js')
const bcrypt = require('bcrypt');


const checkUserAndPassword = async (email, password) => {
    try {
        console.log(email,'email')
        const userToBeFound = email.toLowerCase()
        const infoUser = await knex('t_usuarios').where({ email: userToBeFound }).first('id', 'password', 'role','validated') || {}
        console.log(infoUser,'infousers')
        let response
        
        if (infoUser.id) {
            if(infoUser.validated === false) return response = { validated: false, error_code: 'email_not_validated' }
            const valid = await bcrypt.compare(password, infoUser.password);
            if (valid) {
              
                response = { validated: true, id: infoUser.id}
                // const isFirstTime = await funnel.primerLoginUsuario(infoUser.id)
                // response.newuser = isFirstTime
            } else {
                response = { validated: false, error_code: 'bad_password' }
            };
        } else {
            response = { validated: false, error_code: 'not_user' }
        }
        
        return response
    } catch (e) {
        console.log(e, 'checkUserAndPassword');
    }

}

const encryptPassword = async(password) => {
    return await bcrypt.hash(password, 10)
}

module.exports = {checkUserAndPassword, encryptPassword}