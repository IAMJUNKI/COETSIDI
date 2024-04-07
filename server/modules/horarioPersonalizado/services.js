const fs = require('fs');
const Papa = require('papaparse');



const csvFilePath = '../../../horarios/csv/56AD_2.csv'


const readCSV = async (filePath) => {

 

    const file = fs.createReadStream(filePath);
       
        return new Promise( async (resolve, reject) => {

            try{
                Papa.parse(file, {
                  header: true,
                  complete: results => {
                    console.log('Complete', results.data.length, 'records.'); 
                    resolve(results.data);
                  }
                });


            } catch(err){
                throw new Error ('file reading error:',err);
                reject(err);

            }
        });

};

const dataParser = async () => {
  let parsedData = await readCSV(csvFilePath); 
  console.log(parsedData)
}

dataParser()




// const file = fs.createReadStream(csvFilePath);

// var csvData=[];
// Papa.parse(file, {
//   header: true,
//   step: function(result) {
//     csvData.push(result.data)
//   },
//   complete: function(results, file) {
//     console.log('Complete', csvData, 'records.'); 
//   }
// });