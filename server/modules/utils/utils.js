

const preventDoubleClick = function (event) {
    let timeStampGlobal = 0
    if (Math.abs(event.timeStamp - timeStampGlobal) < 500) { timeStampGlobal = event.timeStamp; return true } 
    else { timeStampGlobal = event.timeStamp; return false }
}

function hideSpinner() { 
    document.getElementById('spinner_loader') .remove() 
}  

function showSpinner(element) { 
    const spinner = document.createElement('div')
    spinner.setAttribute("role","status")
    spinner.setAttribute("class","spinner-border")
    spinner.setAttribute("id","spinner_loader")
    spinner.innerHTML =  `<span class="visually-hidden">Loading...</span>`
    document.getElementById(element).append(spinner)  
}  



module.exports = { preventDoubleClick, hideSpinner, showSpinner }
