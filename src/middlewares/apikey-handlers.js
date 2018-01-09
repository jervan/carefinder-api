const config = require('../helpers/config-helper');
const ApiKey = require('../models/apikey-models');

// check for valid ApiKey in request header
exports.apikeyCheck = async (req, res, next) => {

        const header  = req.header(config.auth.header);

        if (header) {
            const headerSec = config.getApiKey(header);
            const apikey = headerSec.apikey;

            if (headerSec.authType === config.auth.type && apikey) {
                const keydata = await ApiKey.findOne({apikey}).exec();

                if (keydata) {
                    next();
                    return;
                }
            }
        }

        // this request is unauthorized
        next(config.getErrObj(config.http.status.unauthorized, config.errmsg.app.unauthorized));
};

// checks for valid ApiKey in header and if user is admin
exports.adminCheck = async (req, res, next) => {

    const header  = req.header(config.auth.header);

    if (header) {
        const headerSections = header.split(" ");
        const authType = headerSections[0];
        const apikey = headerSections[1];

        if (authType === config.auth.type && apikey) {
            const keydata = await ApiKey.findOne({apikey}).exec();

            if (keydata && keydata.isAdmin) {
                next();
                return;
            } else if (keydata) {
                // not admin api key
                next(config.getErrObj(config.http.status.forbidden, config.errmsg.app.forbidden));
                return;
            }
        }
    }

    // this request is unauthorized
    next(config.getErrObj(config.http.status.unauthorized, config.errmsg.app.unauthorized));
};