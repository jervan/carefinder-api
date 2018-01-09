/**
 * apiKeys-controller - API keys controller
 * @type {*|Mongoose}
 */

const config = require('../helpers/config-helper');
const apikeygen = require("apikeygen").apikey;
const ApiKey = require('../models/apikey-models');


/**
 * store - Create a new key and save it in the database
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.store = async (req, res) => {
    // Ensure that the request contains a message body
    if(Object.keys(req.body).length===0) {
        // Error: no body was sent
        throw config.getErrObj(config.http.status.bad_request, config.errmsg.app.missing_body)
    }

    // make sure user isn't trying to create admin only admins can do that through admin endpoint
    if (req.body.isAdmin === true) {
        throw config.getErrObj(config.http.status.forbidden, config.errmsg.app.unauthorized_admin);
    }

    // Generate the new API key
    const apiKey = new ApiKey(config.db.minimum_document);
    apiKey.firstName = req.body.firstName;
    apiKey.lastName = req.body.lastName;
    apiKey.userName = req.body.userName;
    apiKey.apikey = apikeygen();
    await apiKey.save();

    // Set the Location header
    res.location(config.app.apikeyUrl + apiKey._id);

    // Send response
    res.status(config.http.status.created).json({data: apiKey});

};

/**
 *
 * show - Show a single record by ApiKey
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.show = async (req, res) => {
    const header  = req.header(config.auth.header);
    const apikey = config.getApiKey(header).apikey;
    if (apikey) {
        const keydata = await  ApiKey.findOne({apikey}).exec();
        if (keydata) {
            res.status(config.http.status.ok).json({data: keydata})
            return;
        }
    }
    throw config.getErrObj(config.http.status.internal_server_error, config.errmsg.app.server_error);
};


/**
 * destroy - Deletes a single record by ApiKey
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.destroy = async (req, res) => {
    const header  = req.header(config.auth.header);
    const apikey = config.getApiKey(header).apikey;
    if (apikey) {
        const keydata = await  ApiKey.findOneAndRemove({apikey}).exec();
        if (keydata) {
            res.status(config.http.status.ok).json({data: keydata});
            return;
        }
    }
    throw config.getErrObj(config.http.status.internal_server_error, config.errmsg.app.server_error);
};

/**
 * update - Updates a single record by ApiKey
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.update = async (req, res) => {
    // Ensure that the request contains a message body
    if(Object.keys(req.body).length===0) {
        // Error: no body was sent
        throw config.getErrObj(config.http.status.bad_request, config.errmsg.app.missing_body)
    }
    // make sure user isn't trying to create admin only admins can do that through admin endpoint
    if (req.body.isAdmin === true) {
        throw config.getErrObj(config.http.status.forbidden, config.errmsg.app.unauthorized_admin);
    }
    const header  = req.header(config.auth.header);
    const apikey = config.getApiKey(header).apikey;
    if (apikey) {
        const keydata = await ApiKey.findOne({apikey}).exec();
        if (keydata) {
            // Combine/patch the two objects together
            const newkeydata = config.updateJson(req.body, keydata);
            if (newkeydata) {
                // set server controlled values
                newkeydata.dateModified = new Date();
                newkeydata._id = keydata._id;
                newkeydata.apikey = keydata.apikey;
                await newkeydata.save();
                res.json({data: newkeydata});
                return;
            }
        }
    }
    throw config.getErrObj(config.http.status.internal_server_error, config.errmsg.app.server_error);
};

/**
 * replace - Replaces a single record by id
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.replace = async (req, res) => {
    // Ensure that the request contains a message body
    if(Object.keys(req.body).length===0) {
        // Error: no body was sent
        throw config.getErrObj(config.http.status.bad_request, config.errmsg.app.missing_body)
    }
    // make sure user isn't trying to create admin only admins can do that through admin endpoint
    if (req.body.isAdmin === true) {
        throw config.getErrObj(config.http.status.forbidden, config.errmsg.app.unauthorized_admin);
    }
    const newkeydata = req.body;
    if (newkeydata) {
        const header = req.header(config.auth.header);
        const apikey = config.getApiKey(header).apikey;
        if (apikey) {
            let keydata = await ApiKey.findOne({apikey}).exec();
            if (keydata) {
                // set all user editable fields to given values
                keydata.userName = newkeydata.userName;
                keydata.firstName = newkeydata.firstName;
                keydata.lastName = newkeydata.lastName;
                keydata.dateModified = new Date();
                await keydata.save();
                res.json({data: keydata});
                return;
            } else {
                // this should never happen as key is required to get here
                // client provided a valid key but it is not in our database. We need to add it
                return this.store(req, res);
            }
        }
    }
    throw config.getErrObj(config.http.status.internal_server_error, config.errmsg.app.server_error);

};