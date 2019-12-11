const {PubSub} = require('@google-cloud/pubsub');

/**
 * Returns a list of Google APIs and the link to the API's docs.
 * @param {Express.Request} req The API request.
 * @param {Express.Response} res The API response.
 */
exports.static_classifier = async (event, context) => {
    console.log("Received message: "+JSON.stringify(event))
    let payload = Buffer.from(event.data, 'base64');
    console.log("Base64-decoded payload: "+payload);
    let data = JSON.parse(payload);
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
  item.categoryconfidence = 0.5;
  if (name.match(/Bambusstab/i)) item.category = "Gärtnereibedarf";
  else if (name.match(/Sprüher/i)) item.category = "Bastelbedarf";
  else if (name.match(/Spanplattenschrauben/i)) item.category = "Eisenwaren";
  else if (name.match(/Landfrucht Säfte/i)) item.category = "Getränke";
  else if (name.match(/Traubendirektsaft/i)) item.category = "Getränke";
  else if (name.match(/Mehrfruchtdirektsa/i)) item.category = "Getränke";
  else if (name.match(/Karotten/i)) item.category = "Lebensmittel";
  else if (name.match(/Joghurt/i)) item.category = "Lebensmittel";
  else if (name.match(/Zahncreme/i)) item.category = "Hygiene";
  else if (name.match(/Zahnbürste/i)) item.category = "Hygiene";
  else if (name.match(/Puderzucker/i)) item.category = "Lebensmittel";
  else if (name.match(/Moser Roth Gefüllt/i)) item.category = "Süßigkeiten";
  else if (name.match(/Haselnusskerne/i)) item.category = "Lebensmittel";
  else if (name.match(/Walnusskerne/i)) item.category = "Lebensmittel";
  else if (name.match(/Romarispen/i)) item.category = "Lebensmittel";
  else if (name.match(/Oreo/i)) item.category = "Süßigkeiten";
  else if (name.match(/Nimm 2/i)) item.category = "Süßigkeiten";
  else if (name.match(/Bad-\/Küchen\/Dusch/i)) item.category = "Hygiene";
  else if (name.match(/salat/i)) item.category = "Lebensmittel";
  else if (name.match(/Reinig/i)) item.category = "Haushalt";
  else if (name.match(/Eier/i)) item.category = "Lebensmittel";
  else if (name.match(/Bourbon Vanille/i)) item.category = "Lebensmittel";
  else if (name.match(/Fischstäbchen/i)) item.category = "Lebensmittel";
  else if (name.match(/Nuss-Frucht-Mix/i)) item.category = "Lebensmittel";
  else if (name.match(/Multi Power Reinig/i)) item.category = "Haushalt";
  else if (name.match(/Milchreis/i)) item.category = "Lebensmittel";
  else if (name.match(/käse/i)) item.category = "Lebensmittel";
  else if (name.match(/Snack/i)) item.category = "Süßigkeiten";
  else if (name.match(/Milch/i)) item.category = "Getränke";
  else {
    item.category = "Unknown";
    item.categoryconfidence = 0.0;
  }
}
