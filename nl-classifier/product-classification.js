async function classify(text) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
    // const fs = require('fs');

    // const text = fs.readFileSync("example.txt", "utf8");

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    // The text to analyze
    // const text = 'Hello, world!';

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [classification] = await client.classifyText({ document });
    console.log('Categories:');
    classification.categories.forEach(category => {
        console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);
    });

    return classification.categories;
}


exports.productClassification = (req, res) => {
    let text = req.query.text || req.body.text;

    const classifications = classify(text);

    classifications.then(classif => {
        res.status(200).send(JSON.stringify(classif));
    })
};