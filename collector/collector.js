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
    if (e.errors instanceof Array) {
        e.errors.forEach((error) => {
            console.warn("error inserting data: ", error)
        })
    } else
        console.warn("error inserting data: ", e)
}

async function insertRowsAsStream(data) {
    await bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(data).then(() => {
            console.log(`Inserted ${data.length} rows`);
        }).catch(errorHandling)
}

/*

Field name 	            Type 	    Mode 	Description
date 	                TIMESTAMP 	NULLABLE
article 	            STRING 	    NULLABLE
category 	            STRING 	    NULLABLE
category_confidence 	FLOAT 	    NULLABLE
price 	                NUMERIC 	NULLABLE 	in euro cent
store 	                STRING 	    NULLABLE 	Name of the store
bill_id 	            STRING 	    NULLABLE 	UUID
id 	                    STRING 	    NULLABLE 	UUID
 */
function transformData(data) {
    return data.items.map((row) => {
            return {
                date: new Date(Date.parse(data.date)).toISOString().slice(0, 19).replace('T', ' '),
                article: row.name,
                category: row.category || "unknown",
                category_confidence: row.categoryconfidence || 0.0,
                price: row.price,
                store: data.store,
                bill_id: data.receipt_id,
                id: row.item_id,
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
