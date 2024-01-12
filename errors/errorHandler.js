const mongoose = require("mongoose");
const StandardError = require("./standardError");
const debug = require("debug")("app:errors");

function makeStandardError(err, req, res, next) {
  if (err instanceof StandardError) {
    next(err);
  } else {
    const standardError = new StandardError(
      err.message || err.msg || "Internal Error",
      err.cause || err,
      err.status || 500
    );
    next(standardError);
  }
}

function errorResponse(err, req, res, next) {
  if (err instanceof StandardError) {
    const path = req.method + " " + req.path;
    res.status(err.status).json({
      path,
      status: err.status,
      message: err.message,
      cause: err.cause,
    });
  }
}

module.exports = [makeStandardError, errorResponse];
