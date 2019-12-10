'use strict';
const {BigQuery} = require('@google-cloud/bigquery');

const projectId = 'hackathon-sap19-wal-1009'
const datasetId = 'categorizeddata'
const tableId = 'categorizeddata'

const options = {
    projectId: projectId,
};
const bigquery = new BigQuery(options);

function errorHandling(e) {
    console.warn("error inserting data", e.errors.map((row) => row.errors))
}

exports.classificationCollector = (event, context) => {
    const pubsubMessage = event.data;
    console.log(Buffer.from(pubsubMessage, 'base64').toString());
};



async function insertRowsAsStream(rows) {
    rows.map((row) => classify(row.article))
    await bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert([]).then(() => {
            console.log(`Inserted ${rows.length} rows`);
        }).catch(errorHandling)
}

const dataset = [
    {date: '2019-12-05 16:46:30', article: "PUTENBRUST", price: 289},
    {date: '2019-12-05 16:46:30', article: "BIO SCHINK.WURST", price: 129},
    {date: '2019-12-05 16:46:30', article: "GERAMONT SCHB.", price: 249},
    {date: '2019-12-05 16:46:30', article: "JA! MEDIUM 6x1,5", price: 114},
    {date: '2019-12-05 16:46:30', article: "PFAND 1,50 EURO", price: 150},
    {date: '2019-12-05 16:46:30', article: "JA! BACKPAPIERZ", price: 95},
];
insertRowsAsStream(dataset);