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
    console.warn("error inserting data", e)
}


async function insertRowsAsStream(data) {
    await bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(data).then(() => {
            console.log(`Inserted ${data.items.length} rows`);
        }).catch(errorHandling)
}

function transformData(data) {
    return data.items.map((row) => {
            return {
                date: data.date,
                store: data.store,
                bill_id: data.receipt_id,
                item_id: row.item_id,
                category: row.category,
                categoryconfidence: row.categoryconfidence,
                price: row.price
            }
        }
    )
}

exports.classificationCollector = (event, context) => {
    const pubsubMessage = event.data;
    const data = JSON.parse(Buffer.from(pubsubMessage, 'base64').toString());

    console.log("INPUT", data);
    console.log("TRANSFORMED", transformData(data));
    insertRowsAsStream(transformData(data));
};
