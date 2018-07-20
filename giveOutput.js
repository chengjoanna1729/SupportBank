const readlineSync = require('readline-sync');

function decideOutput(accounts) {
    const command = readlineSync.question('List All or List [name]? ');

    if (command === 'List All') {
        accounts.forEach(accountsLine => {
            delete accountsLine.Transactions;
        });
        console.log(accounts);
    }

    accounts.forEach(accountsLine => {
        if (command === 'List ' + accountsLine.Name) {
            console.log(accountsLine);
        }
    });
}

module.exports = {decideOutput};