const language = require('@google-cloud/language');
const { PubSub } = require('@google-cloud/pubsub');
const https = require('https');
const wiki = require('wikijs').default;

async function classify(text) {
    // Imports the Google Cloud client library

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    try {
        const [classification] = await client.classifyText({ document });
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
    let items = payload.items || [];

    const pubsub = new PubSub({ projectId: "hackathon-sap19-wal-1009" });
    const topic = await pubsub.topic("classification_result");

    var pClassifications = items.map(item => {
        return classify(item.name)
            .then(classification => {
                item.category = classification.category;
                item.categoryconfidence = classification.confidence;
                topic.publishJSON(item);
            });
    });

    await pClassifications;
};

async function getWikipedia(article) {
    var p = await wiki({apiUrl: 'https://de.wikipedia.org/w/api.php'}).page(article)
    return p.summary()
}