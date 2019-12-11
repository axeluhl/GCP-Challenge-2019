const {PubSub} = require('@google-cloud/pubsub');

/**
 * Returns a list of Google APIs and the link to the API's docs.
 * @param {Express.Request} req The API request.
 * @param {Express.Response} res The API response.
 */
exports.static_classifier = async (event, context) => {
    console.log("Received message: "+JSON.stringify(event))
    let data = JSON.parse(Buffer.from(event.data, 'base64'));
    let store = data.store;
    let items = data.items;
    if (data.store && data.items) {
      for (let i=0; i<items.length; i++) {
        tryToClassify(items[i]);
      }
      console.log("Classified message: "+JSON.stringify(data));
      const pubsub = new PubSub({projectId: "hackathon-sap19-wal-1009"});
      const messageId = await pubsub.topic("classification_result").publishJSON(data);
      console.log(`Message ${messageId} published.`);
    } else {
      console.log("Error: store or items not defined");
    }
};

function tryToClassify(item) {
  let name = item.name;
  if (name.match(/Bambusstab/i)) {
    item.category = "Gärtnereibedarf";
    item.categoryconfidence = 0.5;
  } else if (name.match(/Sprüher/i)) {
    item.category = "Bastelbedarf";
    item.categoryconfidence = 0.5;
  } else if (name.match(/Spanplattenschrauben/i)) {
    item.category = "Eisenwaren";
    item.categoryconfidence = 0.5;
  } else {
    item.category = "Unknown";
    item.categoryconfidence = 0.0;
  }
}
