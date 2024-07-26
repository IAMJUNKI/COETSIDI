const { knex } = require('@db/knex.js');
const Noticias = require('@db/models/noticias.js')


const getNoticias = async (ano, mes) => {
  
  const noticiasDelMes = await knex('t_noticias').where({ ano, mes})
  console.log(noticiasDelMes,'noticiasdelmes')

  noticiasDelMes.sort((a, b) => {
    return b.numero_dia.localeCompare(a.numero_dia, undefined, { numeric: true });
});

  return noticiasDelMes
  
}

const getAdminTools = async (role) => {

    const extraTools = {}

    if (role === 'admin'){

        extraTools.delete = 
            ` <div class= "row">
                <button class= "botonBorrarNoticia" data-bs-toggle="modal" data-bs-target="#modalBorrarNoticia">Borrar</button>
              </div>
            `
        extraTools.add = 
            ` <div class= "row anadirNoticia">
                <button class= "botonAnadirNoticia" data-bs-toggle="modal" data-bs-target="#modalAnadirNoticia">Añadir</button>
              </div>
            `
        return extraTools

    }
    else {
        extraTools.delete = ''
        extraTools.add = ''
        return extraTools
    }
    
}

const crearNuevaNoticia = async (dia, numero, mes, ano, titulo, texto, link) => {
  
    if (link === '') link = null

    const createNoticia = await Noticias.create({
        dia_de_la_semana: dia,
        numero_dia: numero,
        mes,
        ano,
        titulo,
        texto,
        link
    });

    return createNoticia
    
  }


  const borrarNoticia = async (id) => {
  
    const borrarNoticia = await knex('t_noticias').where({ id }).del()
  
    return borrarNoticia
    
  }


module.exports = {
  getNoticias,
  getAdminTools,
  crearNuevaNoticia,
  borrarNoticia,
}
