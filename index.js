let readlineSync = require('readline-sync');
let fs = require('fs');
let parse = require('csv-parse/lib/sync');
let moment = require('moment');

let data = fs.readFileSync('C:/Users/JOC/Documents/Training/SupportBank/Transactions2014.csv', 'utf8');

let datafile = parse(data, {columns: true});
console.log(datafile[1].Narrative);

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
        if (datafile[i].From === accounts[accountsnum].Name) {
            accounts[accountsnum].Transactions.push(datafile[i]);
            accounts[accountsnum].Net_Balance -= +datafile[i].Amount;
        } 
        
        if (datafile[i].To === accounts[accountsnum].Name) {
            accounts[accountsnum].Transactions.push(datafile[i]);
            accounts[accountsnum].Net_Balance += +datafile[i].Amount;
        }
        accounts[accountsnum].Net_Balance = Math.round(accounts[accountsnum].Net_Balance * 100) / 100;
    }
}

let command = readlineSync.question('List all or list someone? ');

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
