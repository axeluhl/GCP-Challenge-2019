
/**
 * Returns a list of Google APIs and the link to the API's docs.
 * @param {Express.Request} req The API request.
 * @param {Express.Response} res The API response.
 */
exports.classify = async (req, res) => {
    let store = req.body.store;
    let items = req.body.items;
    for (let i=0; i<items.length; i++) {
      tryToClassify(items[i]);
    }
    res.send(req.body);
};

function tryToClassify(item) {
  item.category = "Unknown";
}