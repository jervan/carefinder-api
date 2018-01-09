const express = require('express');

const apikeysController = require('../controllers/apikeys-controller');
const apikeysAdmin = require('./apikeys-admin-routes');
const { catchErrors } = require('../middlewares/error-handlers');
const { apikeyCheck } = require('../middlewares/apikey-handlers');
const { adminCheck } = require('../middlewares/apikey-handlers');


const router = express.Router();

// POST /apikeys
router.post('/', catchErrors(apikeysController.store));

// GET /apikeys
router.get('/', apikeyCheck, catchErrors(apikeysController.show));

// PATCH /apikeys
router.patch('/', apikeyCheck, catchErrors(apikeysController.update));

// DELETE /apikeys
router.delete('/', apikeyCheck, catchErrors(apikeysController.destroy));

// PUT /apikeys
router.put('/', apikeyCheck, catchErrors(apikeysController.replace));

// /apikeys/admin
// USE admin router for admin endpoints
router.use('/admin', adminCheck, apikeysAdmin);

module.exports = router;