const {PubSub} = require('@google-cloud/pubsub');

/**
 * Returns a list of Google APIs and the link to the API's docs.
 * @param {Express.Request} req The API request.
 * @param {Express.Response} res The API response.
 */
exports.classify = async (req, res) => {
    let store = req.body.store;
    let items = req.body.items;
    if (req.body.store && req.body.items) {
      for (let i=0; i<items.length; i++) {
        tryToClassify(items[i]);
      }
      const pubsub = new PubSub({projectId: "hackathon-sap19-wal-1009"});
      const messageId = await pubsub.topic("classification_result").publishJSON(req.body);
      console.log(`Message ${messageId} published.`);
      res.send(req.body);
    } else {
      res.status(400).send("store and/or items attribute missing in body");
    }
};

function tryToClassify(item) {
  item.category = "Unknown";
}