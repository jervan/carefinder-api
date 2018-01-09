/**
 * app.js - The app!
 * @type {*|createApplication}
 */

// Modules
require('dotenv').config();
require('./src/helpers/config-helper');
require('./src/helpers/db-helper');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const debug = require('./src/middlewares/debug-handlers');
const errorHandlers = require('./src/middlewares/error-handlers');
const app = express();


console.log('server:%s running on %s:%d in %s mode.', process.env.npm_package_name, process.env.HOST, process.env.PORT, process.env.NODE_ENV);

// Use native ES6 Promises since mongoose's are deprecated.
mongoose.Promise = global.Promise;

// Protect from some well-known web vulnerabilities by
// setting HTTP headers appropriately.

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// request debugging
app.use(debug.reqDebug);

// Routes
const indexRoutes = require('./src/routes/index-routes');
const hospitalsRoutes = require('./src/routes/hospital-routes');
const apikeysRoutes = require('./src/routes/apikeys-routes');

// Endpoints
app.use('/', indexRoutes);
app.use('/hospitals', hospitalsRoutes);
app.use('/apikeys', apikeysRoutes);

// Catch all invalid routes
app.use(errorHandlers.invalidRoute);

// Handle mongoose errors
app.use(errorHandlers.validationErrors);

// error logging
app.use((debug.errorDebug));

// Don't Show errors in production
if (process.env.NODE_ENV === 'production') {
    app.use(errorHandlers.production)
} else {
    app.use(errorHandlers.development)
}

module.exports = app;
