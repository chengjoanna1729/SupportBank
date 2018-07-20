const dataReading = require('./dataReading');
const accounting = require('./accounting');
const giveOutput = require('./giveOutput');

const dataFile = dataReading.readData();
const accounts = accounting.doAccounts(dataFile);
giveOutput.decideOutput(accounts);
