const r = require("./collector");

r.classificationCollector({
    receipt_id: '70f0520d-582c-4b58-bc73-9c5608643957',
    store: 'ALDI SÜD',
    date: '2019-11-23T12:10:46+0200',
    items:
        [{
            item_id: 'af01ad68-7429-4dd1-a2a4-de3022b9f1aa',
            ean: '36084',
            name: 'Landfrucht Säfte',
            quantity: 1,
            price: 99
        },
            {
                item_id: '7011f100-d80a-4d20-92d5-100793b2b7e6',
                ean: '2339',
                name: 'Traubendirektsaft',
                quantity: 1,
                price: 99
            },
            {
                item_id: 'f41f9a97-b623-472a-ad47-5893ad0733fe',
                ean: '32701',
                name: 'Bio-Karotten',
                quantity: 1,
                price: 99
            },
            {
                item_id: '1b6a7488-2b07-44ef-8332-f6800bd1a75a',
                ean: '11692',
                name: 'Kinderzahncreme',
                quantity: 1,
                price: 60
            },
            {
                item_id: '506339ff-ec7f-4a02-a4d9-aa6b4f733967',
                ean: '9007',
                name: 'Mehrfruchtdirektsa',
                quantity: 1,
                price: 159
            }]
})