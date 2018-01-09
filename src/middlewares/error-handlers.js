// https://github.com/wesbos/Learn-Node/blob/master/stepped-solutions/45%20-%20Finished%20App/handlers/errorHandlers.js
const config = require('../helpers/config-helper');


/**
 * Handler to catch `async` operation errors.
 * Reduces having to write `try-catch` all the time.
 */
exports.catchErrors = (action) => {
    return (req, res, next) => {
        action(req, res).catch(next)
    }
};

/**
 * Handle any invalid routes.
 */
exports.invalidRoute = (req, res, next) => {
    const err = new Error(config.errmsg.app.invalid_route);
    err.status = 404;
    next(err)
};

/**
 * Validation error handler for Mongo.
 * The client app should handle displaying the errors.
 */
exports.validationErrors = (err, req, res, next) => {
    // catch Mongo id CastErrors
    if (err.name && err.name === config.errcode.invalid_id) {
        err.status = config.http.status.bad_request;
        err.message = config.errmsg.app.id_invalid;
        return next(err);
    }
    // catch unique field error
    if (err.code && err.code === config.errcode.duplicate_field) {
        err.status = config.http.status.bad_request;
        err.message = err.errmsg;
        return next(err);
    }

    if (!err.errors) {
        return next(err)
    }
    res.status(400).json({
        status: 400,
        error: err.errors
    })
};

/**
 * Show useful information to client in development.
 */
exports.development = (err, req, res, next) => {
    err.stack = err.stack || '';
    const status = err.status || 500;
    res.status(status);
    res.json({
        status: status,
        message: err.message,
        stack: err.stack
    })
};

/**
 * Do not show information in production.
 */
exports.production = (err, req, res, next) => {
    if (req.accepts('application/json')) {
        res.status(err.status || 500).json({status: err.status, message: err.message});
    } else if (err.status && err.status === 404) {
        res.redirect('/')
    } else {
        res.status(err.status || 500).send();
    }
};
