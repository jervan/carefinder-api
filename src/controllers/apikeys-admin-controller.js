/**
 * apiKeys-controller - API keys controller
 * @type {*|Mongoose}
 */

const config = require('../helpers/config-helper');
const apikeygen = require("apikeygen").apikey;
const ApiKey = require('../models/apikey-models');

/**
 * index - Gets all api keys currently in the database
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.index = async (req, res) => {
    const apikeys = await ApiKey.find().exec();
    if (apikeys && apikeys.length > 0) {
        res.status(config.http.status.ok).json({data: apikeys});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.apikeys_not_found);
    }
};


/**
 * storeAdmin - Admin create a new key and save it in the database
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

    // Generate the new API key
    const apiKey = new ApiKey(config.db.minimum_document);
    apiKey.firstName = req.body.firstName;
    apiKey.lastName = req.body.lastName;
    apiKey.userName = req.body.userName;
    apiKey.isAdmin = req.body.isAdmin;
    apiKey.apikey = apikeygen();
    await apiKey.save();

    // Set the Location header
    res.location(config.app.apikeyUrl + apiKey._id);

    // Send response
    res.status(config.http.status.created).json({data: apiKey});

};

/**
 * showByUserName - Show a single record by username
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.showByUserName = async (req, res) => {
    const keydata = await  ApiKey.findOne({userName: req.params.username}).exec();
    if (keydata) {
        res.status(config.http.status.ok).json({data: keydata})
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.username_not_found);
    }
};

/**
 * showById - Show a single record by id
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.showById = async (req, res) => {
    const keydata = await  ApiKey.findById(req.params.id).exec();
    if (keydata) {
        res.status(config.http.status.ok).json({data: keydata});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.id_not_found);
    }
};

/**
 * destroy - Deletes a single record by id
 *
 * @param req from client
 * @param res to client
 * @returns {Promise.<void>}
 */
exports.destroy = async (req, res) => {

    const keydata = await  ApiKey.findByIdAndRemove(req.params.id).exec();
    if (keydata) {
        res.status(config.http.status.ok).json({data: keydata});
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.id_not_found);
    }
};

/**
 * update - Updates a single record by id
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
    const keydata = await ApiKey.findById(req.params.id).exec();
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
    } else {
        throw config.getErrObj(config.http.status.not_found, config.errmsg.app.id_not_found);
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

    const newkeydata = req.body;
    if (newkeydata) {
        const keydata = await ApiKey.findById(req.params.id).exec();
        if (keydata) {
            // set all user editable fields to given values
            keydata.userName = newkeydata.userName;
            keydata.firstName = newkeydata.firstName;
            keydata.lastName = newkeydata.lastName;
            keydata.isAdmin = newkeydata.isAdmin;
            keydata.dateModified = new Date();
            await keydata.save();
            res.json({data: keydata});
            return;
        } else {
            // this id is not in the database add a new document
            const apiKey = new ApiKey(config.db.minimum_document);
            apiKey._id = req.params.id;
            apiKey.firstName = req.body.firstName;
            apiKey.lastName = req.body.lastName;
            apiKey.userName = req.body.userName;
            apiKey.isAdmin = req.body.isAdmin;
            apiKey.apikey = req.body.apikey;
            if (apiKey.apikey === null) {
                apiKey.apikey = apikeygen();
            }
            await apiKey.save();
            res.json({data: apiKey});
            return;
        }

    }
    throw config.getErrObj(config.http.status.internal_server_error, config.errmsg.app.server_error);
};