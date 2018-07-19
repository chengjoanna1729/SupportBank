const dataReading = require('./dataReading');
const accounting = require('./accounting');
const giveOutput = require('./giveOutput');

let dataFile = dataReading.readData();
let accounts = accounting.doAccounts(dataFile);
giveOutput.decideOutput(accounts);
