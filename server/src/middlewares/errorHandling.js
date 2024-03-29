const http = require("http");

const errorHandling = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || http.STATUS_CODES[err.statusCode];

    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        message: err.message
    })
}

module.exports = errorHandling;
