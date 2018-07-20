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
    const namesList = [];
    dataFile.forEach(dataLine => {
        namesList.push(dataLine.From);
        namesList.push(dataLine.To);
    });
    const accountsList = Array.from(new Set(namesList));

    const accounts = [];
    accountsList.forEach(accountsLine => {
        accounts.push({Name: accountsLine, Net_Balance: 0, Transactions: []});
    });

    dataFile.forEach(dataLine => {
        accounts.forEach(accountsLine => {
            if (!moment(dataLine.Date, ['DD-MM-YYYY']).isValid()) {
                logger.warn(`Not a proper date from transaction of ${dataLine.Narrative}, from ${dataLine.From} to ${dataLine.To}`)
            }
            if (isNaN(dataLine.Amount)) {
                logger.error(`Not a monetary value from transaction of ${dataLine.Narrative}, from ${dataLine.From} to ${dataLine.To}`);
            } else {
                if (dataLine.From === accountsLine.Name) {
                    accountsLine.Transactions.push(dataLine);
                    accountsLine.Net_Balance -= +dataLine.Amount;
                }
                if (dataLine.To === accountsLine.Name) {
                    accountsLine.Transactions.push(dataLine);
                    accountsLine.Net_Balance += +dataLine.Amount;
                }
            } 
            accountsLine.Net_Balance = Math.round(accountsLine.Net_Balance * 100) / 100;
        });
    });

    return accounts;
}

module.exports = {doAccounts};