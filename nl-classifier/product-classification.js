const language = require('@google-cloud/language');
const { PubSub } = require('@google-cloud/pubsub');
const https = require('https');
const wiki = require('wikijs').default;
const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate({ projectId: "hackathon-sap19-wal-1009" });
const { google } = require('googleapis');
const customsearch = google.customsearch('v1');

async function getGoogleResult(text) {
    let res;
    try {
        res = await customsearch.cse.list({
            q: text,
            cx: "017324218257979284771:dvqaxmboyqe",
            auth: "AIzaSyC7flbY3Iz-kWSeaeWztDO4PQaEDCldbN8",
            lr: "lang_de"
        });
    } catch (error) {
        console.log("google search error:" + error.message);
        return [undefined, undefined];
    }
    return [res.data.items && res.data.items[0].snippet, res.data.spelling && res.data.spelling.correctedQuery];
}

async function translateToEnglish(text) {
    const target = 'en';
    const [translation] = await translate.translate(text, target);
    return translation;
}


async function classify(productName) {

    var googlres, correctedProductName;
    try {
        [googlres, correctedProductName] = await getGoogleResult(productName);
    } catch (error) {
        googlres = undefined;
    }
    // Instantiates a client
    let germanProductDesc;
    try {
        germanProductDesc = await getWikipedia(correctedProductName || productName);
    } catch (error) {
        if (!googlres) {
            return {
                name: "unknown",
                confidence: 0
            }
        }
    }

    const englishProductDescription = await translateToEnglish(germanProductDesc || googlres);

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
            name: "unknown",
            confidence: 0
        }
    }

    return classification.categories[0];
}

exports.productClassification = async (event, context) => {
    console.log(JSON.stringify(event));
    const pubsubMessageData = event.data;
    let payload = JSON.parse(Buffer.from(pubsubMessageData, 'base64').toString());
    let items = payload.items || [{
        name: "Nimm 2 Lachgummi"
    }];

    const pubsub = new PubSub({ projectId: "hackathon-sap19-wal-1009" });
    const topic = await pubsub.topic("classification_result");

    var pClassifications = items.map(async item => {
        try {
            let classification = await classify(item.name);
            item.category = classification.name;
            item.categoryconfidence = classification.confidence;
            console.log(`classified: product: ${item.name} category: ${item.category} confidence: ${item.categoryconfidence}`)

        } catch (error) {
            console.log("classification failed:" + error.message);
        }
    });

    await pClassifications;

    payload.items = items;

    let messageID = await topic.publishJSON(payload);
};

async function getWikipedia(article) {
    var p;
    try {
        p = await wiki({ apiUrl: 'https://de.wikipedia.org/w/api.php' }).page(article)
    } catch (error) {
        let searchResults = await wiki({ apiUrl: 'https://de.wikipedia.org/w/api.php' }).search(article, 1);
        p = await wiki({ apiUrl: 'https://de.wikipedia.org/w/api.php' }).page(searchResults.results[0]);
        console.log(`${article} matched to ${searchResults.results[0]}`);
    }
    return p.summary()
}