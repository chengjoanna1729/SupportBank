const readlineSync = require('readline-sync');
const fs = require('fs');
const parsingFuncs = require('./parsingFunctions');

function readData() {
    const ta2014 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2014.csv', 'utf8');
    const ta2015 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/DodgyTransactions2015.csv', 'utf8');
    const ta2013 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2013.json', 'utf8');
    const ta2012 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2012.xml', 'utf8')

    const csvData = parsingFuncs.csvParse(ta2014);
    const dodgyCsvData = parsingFuncs.csvParse(ta2015);
    const jsonData = parsingFuncs.jsonParse(ta2013);
    const xmlData = parsingFuncs.xmlParse(ta2012);
    const dataFile = [...csvData, ...dodgyCsvData, ...jsonData, ...xmlData];

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