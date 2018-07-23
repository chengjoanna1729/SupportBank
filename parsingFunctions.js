const parse = require('csv-parse/lib/sync');
const XML = require('pixl-xml');
const moment = require('moment');

function csvParse(dataNum) {
    return parse(dataNum, {columns:true});
}

function jsonParse(dataNum) {
    const dataName = JSON.parse(dataNum);
    return dataName.map(dataLine => ({
        Date: moment(dataLine.Date).format('DD-MM-YYYY'),
        From: dataLine.FromAccount,
        To: dataLine.ToAccount,
        Narrative: dataLine.Narrative,
        Amount: dataLine.Amount
    }));
}

function xmlParse(dataNum) {
    const dataName = XML.parse(dataNum);
    return dataName.SupportTransaction.map(dataLine => ({
        Date: moment.unix((+dataLine.Date - (25568))*86400).format('DD-MM-YYYY'),
        From: dataLine.Parties.From,
        To: dataLine.Parties.To,
        Narrative: dataLine.Description,
        Amount: dataLine.Value
    }));
}

module.exports = {csvParse, jsonParse, xmlParse};