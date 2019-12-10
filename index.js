
/**
 * Returns a list of Google APIs and the link to the API's docs.
 * @param {Express.Request} req The API request.
 * @param {Express.Response} res The API response.
 */
exports.listGoogleAPIs = async (req, res) => {
    let sum = 0;
    for (let i = 0; i < 10; ++i) {
      sum += i;
    }
    res.send({ sum });
  };