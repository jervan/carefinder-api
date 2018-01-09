/*
firstname
lastname
dateOfBirth
username
apikey
 */

const mongoose = require('mongoose');
const config = require('../helpers/config-helper');

const definition = {

    firstName: String,
    lastName: String,
    userName: { type: String, required: true, unique: true },
    apikey: { type: String, required: true, unique: true },
    isAdmin: Boolean,
    dateCreated: { type: Date, required: true },
    dateModified: { type: Date, required: true }
};

const apikeysSchema = new mongoose.Schema(definition);

module.exports = mongoose.model(config.models.apikeys, apikeysSchema);