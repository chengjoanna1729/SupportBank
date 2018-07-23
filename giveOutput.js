const readlineSync = require('readline-sync');

function decideOutput(accounts) {
    const command = readlineSync.question('List All or List [name]? ');

    if (command === 'List All') {
        Object.values(accounts).forEach(accountsLine => {
            console.log(`${accountsLine.name} has net balance £${accountsLine.netBalance}`)
        })
    } else {
        const name = command.slice('List '.length);
        console.log(accounts[name]);
    }
}

module.exports = {decideOutput};