const parse = require('csv-parse/lib/sync');
const XML = require('pixl-xml');
const moment = require('moment');

function csvParse(dataNum) {
    const dataName = parse(dataNum, {columns:true});
    return dataName.map(({Date: date, From: from, To: to, Narrative: narrative, Amount: amount}) => ({
        date,
        from,
        to,
        narrative,
        amount
    }));
}

function jsonParse(dataNum) {
    const dataName = JSON.parse(dataNum);
    return dataName.map(({Date: date, FromAccount, ToAccount, Narrative: narrative, Amount: amount}) => ({
        date: moment(date).format('DD-MM-YYYY'),
        from: FromAccount,
        to: ToAccount,
        narrative,
        amount
    }));
}

function xmlParse(dataNum) {
    const dataName = XML.parse(dataNum);
    return dataName.SupportTransaction.map(({Date: date, Parties, Description: narrative, Value: amount}) => ({
        date: moment.unix((+date - (25568))*86400).format('DD-MM-YYYY'),
        from: Parties.From,
        to: Parties.To,
        narrative,
        amount
    }));
}

module.exports = {csvParse, jsonParse, xmlParse};