const language = require('@google-cloud/language');
const { PubSub } = require('@google-cloud/pubsub');
const https = require('https');
const wiki = require('wikijs').default;
const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate({ projectId: "hackathon-sap19-wal-1009" });

async function translateToEnglish(text) {
    const target = 'en';
    const [translation] = await translate.translate(text, target);
    return translation;
}


async function classify(productName) {

    // Instantiates a client
    const germanProductDesc = await getWikipedia(productName);
    const englishProductDescription = await translateToEnglish(germanProductDesc);


    const document = {
        content: englishProductDescription,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const languageClient = new language.LanguageServiceClient();
    let classification;
    try {
        [classification] = await languageClient.classifyText({ document });
    } catch (error) {
        return {
            category: "unknown",
            confidence: 0
        }
    }

    console.log('Categories:');
    classification.categories.forEach(category => {
        console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);
    });

    return classification.categories[0];
}

exports.productClassification = async (event, context) => {
    console.log(JSON.stringify(event));
    const pubsubMessageData = event.data;
    let payload = JSON.parse(Buffer.from(pubsubMessageData, 'base64').toString());
    let items = payload.items || [{
        name: "Milch"
    }];

    const pubsub = new PubSub({ projectId: "hackathon-sap19-wal-1009" });
    const topic = await pubsub.topic("classification_result");

    var pClassifications = items.map(async item => {
        let classification = await classify(item.name);
        item.category = classification.category;
        item.categoryconfidence = classification.confidence;
        let messageID = await topic.publishJSON(item);
        console.log(`Message published: ${messageID} product: ${item.name} category: ${item.category} confidence: ${item.categoryconfidence}`)
        return messageID;
    });

    await pClassifications;
};

async function getWikipedia(article) {
    var p = await wiki({ apiUrl: 'https://de.wikipedia.org/w/api.php' }).page(article)
    return p.summary()
}