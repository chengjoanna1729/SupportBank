let log4js = require('log4js');
const logger = log4js.getLogger('<filename>');
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

let readlineSync = require('readline-sync');
let fs = require('fs');
let parse = require('csv-parse/lib/sync');
let moment = require('moment');

let data1 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2014.csv', 'utf8');
let data2 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/DodgyTransactions2015.csv', 'utf8');
let data3 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2013.json', 'utf8');

function csvparse(datanum) {
    return parse(datanum, {columns:true});
}
function jsonparse(datanum) {
    let dataname = JSON.parse(datanum);
    for (let i = 0; i < dataname.length; i++) {
        dataname[i].From = dataname[i].FromAccount;
        dataname[i].To = dataname[i].ToAccount;
        delete dataname[i].FromAccount;
        delete dataname[i].ToAccount;
    }
    return dataname;
}

let firstData = csvparse(data1);
let secondData = csvparse(data2);
let thirdData = jsonparse(data3);
let datafile = [...firstData, ...secondData, ...thirdData];

let filename = readlineSync.question('Import file ');
if (filename.slice(-4) === '.csv') {
    let data = fs.readFileSync(filename, 'utf8');
    moreData = csvparse(data);
    datafile.push(...moreData);
} else if (filename.slice(-5) === '.json') {
    let data = fs.readFileSync(filename, 'utf8');
    moreData = jsonparse(data);
    datafile.push(...moreData);
}

let nameslist = [];
for (let i = 0; i < datafile.length; i++) {
    nameslist.push(datafile[i].From);
    nameslist.push(datafile[i].To);
}
let accountslist = Array.from(new Set(nameslist));

let accounts = [];
for (let i = 0; i < accountslist.length; i++) {
    accounts[i] = {Name: accountslist[i], Net_Balance: 0, Transactions: []};
}

for (let i = 0; i < datafile.length; i++) {
    for (let accountsnum = 0; accountsnum < accounts.length; accountsnum++) {
        if (!moment(datafile[i].Date, ['DD-MM-YYYY', moment.ISO_8601]).isValid()) {
            logger.warn(`Not a proper date from transaction of ${datafile[i].Narrative}, from ${datafile[i].From} to ${datafile[i].To}`)
        }
        if (isNaN(datafile[i].Amount)) {
            logger.error(`Not a monetary value from transaction of ${datafile[i].Narrative}, from ${datafile[i].From} to ${datafile[i].To}`);
        } else {
            if (datafile[i].From === accounts[accountsnum].Name) {
                accounts[accountsnum].Transactions.push(datafile[i]);
                accounts[accountsnum].Net_Balance -= +datafile[i].Amount;
            }
            if (datafile[i].To === accounts[accountsnum].Name) {
                accounts[accountsnum].Transactions.push(datafile[i]);
                accounts[accountsnum].Net_Balance += +datafile[i].Amount;
            }
        } 
        accounts[accountsnum].Net_Balance = Math.round(accounts[accountsnum].Net_Balance * 100) / 100;
    }
}

let command = readlineSync.question('List All or List [name]? ');

if (command === 'List All') {
    for (let i = 0; i < accounts.length; i++) {
        delete accounts[i].Transactions;
    }
    console.log(accounts);
}

for (let i = 0; i < accounts.length; i++) {
    if (command === 'List ' + accounts[i].Name) {
        console.log(accounts[i]);
        continue
    }
}
