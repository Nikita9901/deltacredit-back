const ApiError = require("../exceptions/api-error");

module.exports = function (req, res, err) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Unknown error" });
};
