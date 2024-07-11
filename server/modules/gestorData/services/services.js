const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { knex } = require('@db/knex.js')
const Horarios = require('@db/models/horarios.js')
const csvDirPath = path.join(__dirname, '../../../../horarios/csv');
const {gradosPorCurso} = require('@gestorData/services/gradosPorCurso.js')


//funcion para leer un documento CSV
const readCSV = async (filePath) => {

 
    const file = fs.createReadStream(filePath);
       
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
          header: true,
          complete: results => {
              console.log('Complete', results.data.length, 'records.');
              resolve(results.data);
          },
          error: err => {
              reject(new Error('File reading error: ' + err.message));
          }
      });
  });
};

// filtrador en funcion del grupo y la clase Tipo de Teoria y Problemas
const filterCSVData = (data, filtroGrupos, filtroExtra, filtroExtraKey) => {
  return data.filter(row => filtroGrupos.includes(row.Grupo) && filtroExtra.includes(row[filtroExtraKey]));
};


//coge todos los csv's que hay en la carpeta y los filtra individualmente
const processCSVs = async (filtroGrupos, filtroExtra = 'Teoría y Problemas', filtroExtraKey = 'Tipo', dirPath = csvDirPath) => {
  try {
      const files = fs.readdirSync(dirPath).filter(file => path.extname(file) === '.csv');
      let allData = [];

      for (const file of files) {
          const filePath = path.join(dirPath, file);
          const data = await readCSV(filePath);
          const filteredData = filterCSVData(data, filtroGrupos, filtroExtra, filtroExtraKey);
          
          //si hay alguna asignatura y grupo repetido( ej:clase lunes y martes) no se mete en alldata
          filteredData.forEach(row => { 
            const exists = allData.some(item => item.Grupo === row.Grupo && item.Asignatura === row.Asignatura);
            if (!exists) {
                allData.push(row);
            }
            else if (filtroExtra !== 'Teoría y Problemas') allData.push(row);
        });
      }

      // console.log(`csv filtrados por grupos ${filtroGrupos}:`, allData);
      return allData
  } catch (error) {
      console.error('Error processing CSV files:', error);
  }
};


const getNombresGrupos = async (titulacion,cursos) => {

  //para no cambiar la estructura del objeto gradosPorCurso que me da pereza
  if (!Array.isArray(cursos)) {
    cursos = [cursos];
  }
  
  const grupos = cursos.reduce((accumulator, curso) => {
    const nombresGrupos = gradosPorCurso[titulacion][curso];
    if (nombresGrupos) {
      return accumulator.concat(nombresGrupos);
    }
    return accumulator;
  }, []);

  return grupos.join(',');
}


const crearObjetoEstructurado = async (CSVFiltrado, tipoDeEstructura ,objetoGradosCurso = gradosPorCurso) => {
  const objetoEstructurado = {};

  CSVFiltrado.forEach(asignatura => {
    const { Semestre, Grupo, Titulacion, Dia } = asignatura;
    const semestreKey = `semestre_${Semestre}`;

    if (!objetoEstructurado[semestreKey]) {
      objetoEstructurado[semestreKey] = {};
    }

    if(tipoDeEstructura === 'cursos'){
      // busca el curso (1, 2, 3, 4, 5) en funcion de la Titulacion y Grupo
      let curso = null;
      if (objetoGradosCurso[Titulacion]) {
        curso = Object.keys(objetoGradosCurso[Titulacion]).find(anho => {
          const grupos = objetoGradosCurso[Titulacion][anho];
          return Array.isArray(grupos) ? grupos.includes(Grupo) : grupos === Grupo;
        });
      }
  
      if (curso) {
        if (!objetoEstructurado[semestreKey][curso]) {
          objetoEstructurado[semestreKey][curso] = [];
        }
  
        objetoEstructurado[semestreKey][curso].push(asignatura);
      }
    }
    else if(tipoDeEstructura === 'dias'){
      if (!objetoEstructurado[semestreKey][Dia]) {
        objetoEstructurado[semestreKey][Dia] = [];
      }
      objetoEstructurado[semestreKey][Dia].push(asignatura);
    }
  });

  return objetoEstructurado;
};

const separarGradoYAsignaturas = async (arrayForm) => {

  let arrayToParse
if (typeof arrayForm === 'string') arrayToParse = [arrayForm]
else arrayToParse = arrayForm

  const objetoBonito = {};

  arrayToParse.forEach(asignatura => {
   
    const [key, value] = asignatura.split('_');

    
    if (!objetoBonito[key]) {
      objetoBonito[key] = [];
    }

    objetoBonito[key].push(value);
  });

console.log(objetoBonito);
 return objetoBonito;
}

//creacion actualizacion tabla hecha con SEQUELIZE en vez de knex para que coja el default value uuid creado con sequelize
const guardarInfoDB = async (data_user, user_id) => {
  try {
    await Horarios.upsert({
        user_id: user_id,
        data_user: data_user
    });
    console.log('Asignatura creada/actualizada con éxito');
    
} catch (error) {
    console.error('Error al crear/actualizar Asignatura:', error);
}
}

// const getDataUser = async (user_id) => {

//   const dbQuery = await knex('t_horarios').where({ user_id }).first('data_user')
  
//    return dbQuery.data_user;
//   }

//devuelve true si no hay valor en la db y false si ya existe algún valor
const isDBEmpty = async (user_id) => {

const dbQuery = await knex('t_horarios').where({ user_id })

 return Object.keys(dbQuery).length === 0;
}


module.exports = {
  processCSVs, getNombresGrupos ,crearObjetoEstructurado, separarGradoYAsignaturas, isDBEmpty, guardarInfoDB
}
