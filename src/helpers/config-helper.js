let config = {};

config.app = {};
config.db = {};
config.auth = {};
config.errcode = {};
config.errmsg = {};
config.errmsg.db = {};
config.errmsg.app = {};
config.http = {};
config.http.status = {};
config.models = {};
config.return = {};
config.return.object = {};
config.return.status = {};

/**
 *getErrObj - creates a new error object
 *
 * @param status of error object to create
 * @param message of error object to create
 * @returns {*}
 */
config.getErrObj = (status, message) => {
    const retobj = new Error();
    retobj.status = status;
    retobj.message = message;
    return retobj
};

/**
 * getApiKey - parses api type and token into object
 *
 * @param header to parse
 * @returns object with authType and apikey fields
 */
config.getApiKey = (header) => {
    const returnObj = {};
    const headerSections = header.split(" ");
    returnObj.authType = headerSections[0];
    returnObj.apikey = headerSections[1];
    return returnObj;
};

/**
 * updateJson - updates a json object
 *
 * @param replacer object with new fields to replace on object
 * @param original object to have fields replaced on
 * @returns updated original object
 */
config.updateJson = (replacer, original) => {
    const keys = Object.keys(replacer);
    keys.forEach((key) => {
        if (typeof replacer[key] === "object") {
            original[key] = config.updateJson(replacer[key], original[key])
        } else {
            original[key] = replacer[key]
        }
    });
    return original;
};

// Application config
config.app.baseUrl = "http://localhost:3000";
config.app.apikeyUrl = config.app.baseUrl + "/apikeys/id/";
config.app.hospitalUrl = config.app.baseUrl + "/hospitals/id/";

// Database
config.db.minimum_document = {
    'dateCreated': Date.now(),
    'dateModified': Date.now()
};

// Error statuses
config.return.status.error = 0;
config.return.status.success = 1;

config.return.object =
    {
        status: ""
    };

// Authorization
config.auth.header = "Authorization";
config.auth.type = "ApiKey";

// Error Code
config.errcode.invalid_id = "CastError";
config.errcode.duplicate_field = 11000;

// Error messages
config.errmsg.nomessage = "";
config.errmsg.app.unauthorized = "Unauthorized";
config.errmsg.app.forbidden = "Forbidden";
config.errmsg.app.invalid_route = "Invalid Route";
config.errmsg.app.username_not_found = "The specified username does not exist. Please specify a valid username.";
config.errmsg.app.hospitals_not_found_city = "The specified city does not have any hospitals. Please specify a valid city.";
config.errmsg.app.hospitals_not_found_state = "The specified state does not have any hospitals. Please specify a valid state.";
config.errmsg.app.hospitals_not_found_county = "The specified county does not have any hospitals. Please specify a valid county.";
config.errmsg.app.hospitals_not_found_name = "The specified name does not have any hospitals. Please specify a valid name.";
config.errmsg.app.id_not_found = "The specified id does not exist. Please specify a valid id.";
config.errmsg.app.id_invalid = "The specified id is not a valid id. Please specify a valid id.";
config.errmsg.app.apikeys_not_found = "No Api Keys are in the database.";
config.errmsg.app.hospitals_not_found = "No Hospitals are in the database."
config.errmsg.app.missing_body = "The required body of the request is missing. Please send a valid message body.";
config.errmsg.app.missing_username = "The required field \"userName\" was missing from the request. Please send a valid userName";
config.errmsg.app.server_error = "I am broken try again later";
config.errmsg.app.unauthorized_admin = "Must use Admin endpoints for Admin Api Keys";

config.errmsg.db.hospital_creation = "There was a problem creating the hospital in the database: ";
config.errmsg.db.hospital_notfound = "The requested hospital was not found in the database.";
config.errmsg.db.hospital_update = "There was a problem updating the hospital in the database: ";

// Models
config.models.hospitals = 'Hospitals';
config.models.apikeys = "ApiKeys";

// HTTP
config.http.status.ok = 200;
config.http.status.created = 201;
config.http.status.no_content = 204;
config.http.status.bad_request = 400;
config.http.status.unauthorized = 401;
config.http.status.forbidden = 403;
config.http.status.not_found = 404;
config.http.status.conflict = 409;
config.http.status.internal_server_error = 500;

module.exports = config;