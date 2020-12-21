// Converting .xlsx and .csv data table to json format

//'use strict';
//const excelToJson = require('convert-excel-to-json');
import 'convert-excel-to-json';

const resultExcelToJson = excelToJson({
    sourceFile: '../auto-mpg.xlsx',
    header:{
        // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
        rows: 1 // 2, 3, 4, etc.
    }
});

export default excelToJson;
// result will be an Object like the previous example, but without the rows that was defined as headers