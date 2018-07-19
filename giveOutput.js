const readlineSync = require('readline-sync');

function decideOutput(accounts) {
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
}

module.exports = {decideOutput};