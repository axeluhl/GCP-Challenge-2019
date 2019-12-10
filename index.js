
/**
 * Returns a list of Google APIs and the link to the API's docs.
 * @param {Express.Request} req The API request.
 * @param {Express.Response} res The API response.
 */
exports.classify = async (req, res) => {
    let store = req.body.store;
    let items = req.body.items;
    res.send({ "number-of-items": items.length });
};