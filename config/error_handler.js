function errorHandler  (err, req, res, next){
  if (typeof err === "string") {
    return res.status(400).json({ success: false, message: err });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ success: false, message: err });
  }

  return res.status(500).json({ success: false, message: err.message });
};

module.exports = errorHandler;
