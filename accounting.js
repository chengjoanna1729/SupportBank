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

    const accounts = {};
    accountsList.forEach(name => {
        accounts[name] = {name, netBalance: 0, transactions: []};
    })

    dataFile.forEach(dataLine => {
        if (!moment(dataLine.Date, ['DD-MM-YYYY']).isValid()) {
            logger.warn(`Not a proper date from transaction of ${dataLine.Narrative}, from ${dataLine.From} to ${dataLine.To}`)
        }
        if (isNaN(dataLine.Amount)) {
            logger.error(`Not a monetary value from transaction of ${dataLine.Narrative}, from ${dataLine.From} to ${dataLine.To}`);
            return
        }
        
        const amount = +dataLine.Amount;

        const fromAccount = accounts[dataLine.From];
        fromAccount.transactions.push(dataLine);
        fromAccount.netBalance -= amount;
        fromAccount.netBalance = Math.round(fromAccount.netBalance * 100) / 100;

        const toAccount = accounts[dataLine.To];
        toAccount.transactions.push(dataLine);
        toAccount.netBalance += amount;
        toAccount.netBalance = Math.round(toAccount.netBalance * 100) / 100;
    })

    return accounts;
}

module.exports = {doAccounts};