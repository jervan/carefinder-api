const express = require('express');

const apikeysAdminController = require('../controllers/apikeys-admin-controller');
const { catchErrors } = require('../middlewares/error-handlers');

const router = express.Router();

// GET /apikeys/admin
router.get('/', catchErrors(apikeysAdminController.index));

// POST /apikeys/admin
router.post('/', catchErrors(apikeysAdminController.store));

// GET /apikeys/admin/username/:username
router.get('/username/:username', catchErrors(apikeysAdminController.showByUserName));

// GET /apikeys/admin/id/:id
router.get('/id/:id', catchErrors(apikeysAdminController.showById));

// DELETE /apikeys/admin/id/:id
router.delete('/id/:id', catchErrors(apikeysAdminController.destroy));

// PATCH /apikeys/admin/id/:id
router.patch('/id/:id', catchErrors(apikeysAdminController.update));

// PUT /apikeys/admin/id/:id
router.put('/id/:id', catchErrors(apikeysAdminController.replace));

module.exports = router;