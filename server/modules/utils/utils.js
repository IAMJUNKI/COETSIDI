
const { knex } = require('@db/knex.js');

// const preventDoubleClick = function (event) {
//     let timeStampGlobal = 0
//     if (Math.abs(event.timeStamp - timeStampGlobal) < 500) { timeStampGlobal = event.timeStamp; return true } 
//     else { timeStampGlobal = event.timeStamp; return false }
// }

// function hideSpinner() { 
//     document.getElementById('spinner_loader') .remove() 
// }  

// function showSpinner(element) { 
//     const spinner = document.createElement('div')
//     spinner.setAttribute("role","status")
//     spinner.setAttribute("class","spinner-border")
//     spinner.setAttribute("id","spinner_loader")
//     spinner.innerHTML =  `<span class="visually-hidden">Loading...</span>`
//     document.getElementById(element).append(spinner)  
// }  

function createRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


const getDataUser = async (user_id) => {

    const dbQuery = await knex('t_horarios').where({ user_id }).first('data_user')
    
     return dbQuery.data_user;
    }


module.exports = {
    //  preventDoubleClick, 
    //  hideSpinner, 
    //  showSpinner,
    createRandomString,
      getDataUser
}
