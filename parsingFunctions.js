const parse = require('csv-parse/lib/sync');
const XML = require('pixl-xml');
const moment = require('moment');

function csvParse(dataNum) {
    return parse(dataNum, {columns:true});
}
function jsonParse(dataNum) {
    let dataName = JSON.parse(dataNum);
    let newDataName = [];
    for (let i = 0; i < dataName.length; i++) {
        newDataName.push({});
        newDataName[i].Date = moment(dataName[i].Date).format('DD-MM-YYYY');
        newDataName[i].From = dataName[i].FromAccount;
        newDataName[i].To = dataName[i].ToAccount;
        newDataName[i].Narrative = dataName[i].Narrative;
        newDataName[i].Amount = dataName[i].Amount;
    }
    return newDataName;
}
function xmlParse(dataNum) {
    let dataName = XML.parse(dataNum);
    let newDataName = [];
    for (let i = 0; i < dataName.SupportTransaction.length; i++) {
        newDataName.push({});
        newDataName[i].Date = moment.unix((+dataName.SupportTransaction[i].Date - (25568))*86400).format('DD-MM-YYYY');
        newDataName[i].From = dataName.SupportTransaction[i].Parties.From;
        newDataName[i].To = dataName.SupportTransaction[i].Parties.To;
        newDataName[i].Narrative = dataName.SupportTransaction[i].Description;
        newDataName[i].Amount = dataName.SupportTransaction[i].Value;
    }
    return newDataName;
}

module.exports = {csvParse, jsonParse, xmlParse};