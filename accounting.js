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
        namesList.push(dataLine.from);
        namesList.push(dataLine.to);
    });
    const accountsList = Array.from(new Set(namesList));

    const accounts = {};
    accountsList.forEach(name => {
        accounts[name] = {name, netBalance: 0, transactions: []};
    })

    dataFile.forEach(dataLine => {
        if (!moment(dataLine.date, ['DD-MM-YYYY']).isValid()) {
            logger.warn(`Not a proper date from transaction of ${dataLine.narrative}, from ${dataLine.from} to ${dataLine.to}`)
        }
        if (isNaN(dataLine.amount)) {
            logger.error(`Not a monetary value from transaction of ${dataLine.narrative}, from ${dataLine.from} to ${dataLine.to}`);
            return
        }

        const amount = +dataLine.amount;
        
        function updateBalance(whichAccount, operation) {
            const account = accounts[dataLine[whichAccount]];
            account.transactions.push(dataLine);
            const newBalance = +account.netBalance + (+(operation) * amount);
            account.netBalance = Math.round(newBalance * 100) / 100;
            return account;
        }
        updateBalance('from','-1');
        updateBalance('to','+1');
    })

    return accounts;
}

module.exports = {doAccounts};