const readlineSync = require('readline-sync');
const fs = require('fs');
const parsingFuncs = require('./parsingFunctions');

function readData() {
    let data1 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2014.csv', 'utf8');
    let data2 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/DodgyTransactions2015.csv', 'utf8');
    let data3 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2013.json', 'utf8');
    let data4 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2012.xml', 'utf8')

    let firstData = parsingFuncs.csvParse(data1);
    let secondData = parsingFuncs.csvParse(data2);
    let thirdData = parsingFuncs.jsonParse(data3);
    let fourthData = parsingFuncs.xmlParse(data4);
    let dataFile = [...firstData, ...secondData, ...thirdData, ...fourthData];

    let fileName = readlineSync.question('Import file ');
    if (fileName.slice(-4) === '.csv') {
        let data = fs.readFileSync(fileName, 'utf8');
        moreData = parsingFuncs.csvparse(data);
        dataFile.push(...moreData);
    } else if (fileName.slice(-5) === '.json') {
        let data = fs.readFileSync(fileName, 'utf8');
        moreData = parsingFuncs.jsonparse(data);
        dataFile.push(...moreData);
    }
    return dataFile;
}

module.exports = {readData};