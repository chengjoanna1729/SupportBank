const readlineSync = require('readline-sync');
const fs = require('fs');
const parsingFuncs = require('./parsingFunctions');

function readData() {
    const data1 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2014.csv', 'utf8');
    const data2 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/DodgyTransactions2015.csv', 'utf8');
    const data3 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2013.json', 'utf8');
    const data4 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2012.xml', 'utf8')

    const firstData = parsingFuncs.csvParse(data1);
    const secondData = parsingFuncs.csvParse(data2);
    const thirdData = parsingFuncs.jsonParse(data3);
    const fourthData = parsingFuncs.xmlParse(data4);
    const dataFile = [...firstData, ...secondData, ...thirdData, ...fourthData];

    const fileName = readlineSync.question('Import file ');
    if (fileName.slice(-4) === '.csv') {
        const data = fs.readFileSync(fileName, 'utf8');
        moreData = parsingFuncs.csvparse(data);
        dataFile.push(...moreData);
    } else if (fileName.slice(-5) === '.json') {
        const data = fs.readFileSync(fileName, 'utf8');
        moreData = parsingFuncs.jsonparse(data);
        dataFile.push(...moreData);
    }
    return dataFile;
}

module.exports = {readData};