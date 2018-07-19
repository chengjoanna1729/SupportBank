const log4js = require('log4js');
const logger = log4js.getLogger('<filename>');
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

const readlineSync = require('readline-sync');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const XML = require('pixl-xml');
const moment = require('moment');

let data1 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2014.csv', 'utf8');
let data2 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/DodgyTransactions2015.csv', 'utf8');
let data3 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2013.json', 'utf8');
let data4 = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2012.xml', 'utf8')

function csvparse(datanum) {
    return parse(datanum, {columns:true});
}
function jsonparse(datanum) {
    let dataname = JSON.parse(datanum);
    let newdataname = [];
    for (let i = 0; i < dataname.length; i++) {
        newdataname.push({});
        newdataname[i].Date = moment(dataname[i].Date).format('DD-MM-YYYY');
        newdataname[i].From = dataname[i].FromAccount;
        newdataname[i].To = dataname[i].ToAccount;
        newdataname[i].Narrative = dataname[i].Narrative;
        newdataname[i].Amount = dataname[i].Amount;
    }
    return newdataname;
}
function xmlparse(datanum) {
    let dataname = XML.parse(datanum);
    let newdataname = [];
    for (let i = 0; i < dataname.SupportTransaction.length; i++) {
        newdataname.push({});
        newdataname[i].Date = moment.unix((+dataname.SupportTransaction[i].Date - (25568))*86400).format('DD-MM-YYYY');
        newdataname[i].From = dataname.SupportTransaction[i].Parties.From;
        newdataname[i].To = dataname.SupportTransaction[i].Parties.To;
        newdataname[i].Narrative = dataname.SupportTransaction[i].Description;
        newdataname[i].Amount = dataname.SupportTransaction[i].Value;
    }
    return newdataname;
}

let firstData = csvparse(data1);
let secondData = csvparse(data2);
let thirdData = jsonparse(data3);
console.log(thirdData);
let fourthData = xmlparse(data4);
let datafile = [...firstData, ...secondData, ...thirdData, ...fourthData];

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
        if (!moment(datafile[i].Date, ['DD-MM-YYYY']).isValid()) {
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
