const http = require('debug')('http');
const reqHeaders = require('debug')('requestHeader');
const reqBody = require('debug')('requestBody');

exports.reqDebug = (req, res, next) => {
    http(req.method + ' ' + req.url);
    reqHeaders(req.headers);
    reqBody(req.body);
    next();
};

exports.errorDebug = (err, req, res, next) => {
    if (err) {
        console.error(err);
        next(err);
    }
};