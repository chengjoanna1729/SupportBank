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
const moment = require('moment');

function doAccounts(dataFile) {
    let namesList = [];
    for (let i = 0; i < dataFile.length; i++) {
        namesList.push(dataFile[i].From);
        namesList.push(dataFile[i].To);
    }
    let accountsList = Array.from(new Set(namesList));
    
    let accounts = [];
    for (let i = 0; i < accountsList.length; i++) {
        accounts[i] = {Name: accountsList[i], Net_Balance: 0, Transactions: []};
    }

    for (let i = 0; i < dataFile.length; i++) {
        for (let accountsnum = 0; accountsnum < accounts.length; accountsnum++) {
            if (!moment(dataFile[i].Date, ['DD-MM-YYYY']).isValid()) {
                logger.warn(`Not a proper date from transaction of ${dataFile[i].Narrative}, from ${dataFile[i].From} to ${dataFile[i].To}`)
            }
            if (isNaN(dataFile[i].Amount)) {
                logger.error(`Not a monetary value from transaction of ${dataFile[i].Narrative}, from ${dataFile[i].From} to ${dataFile[i].To}`);
            } else {
                if (dataFile[i].From === accounts[accountsnum].Name) {
                    accounts[accountsnum].Transactions.push(dataFile[i]);
                    accounts[accountsnum].Net_Balance -= +dataFile[i].Amount;
                }
                if (dataFile[i].To === accounts[accountsnum].Name) {
                    accounts[accountsnum].Transactions.push(dataFile[i]);
                    accounts[accountsnum].Net_Balance += +dataFile[i].Amount;
                }
            } 
            accounts[accountsnum].Net_Balance = Math.round(accounts[accountsnum].Net_Balance * 100) / 100;
        }
    }
    return accounts;
}

module.exports = {doAccounts};