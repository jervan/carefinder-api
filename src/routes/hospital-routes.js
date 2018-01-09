const express = require('express');

const hospitalsController = require('../controllers/hospitals-controller');
const { catchErrors } = require('../middlewares/error-handlers');
const { apikeyCheck } = require('../middlewares/apikey-handlers');

const router = express.Router();

// GET /hospitals
router.get('/', apikeyCheck, catchErrors(hospitalsController.index));

// GET /hospitals/id/:id
router.get('/id/:id', apikeyCheck, catchErrors(hospitalsController.showById));

// GET /hospitals/city/:city
router.get('/city/:city', apikeyCheck, catchErrors(hospitalsController.showByCity));

// GET /hospitals/city/:city/state/:state
router.get('/city/:city/state/:state', apikeyCheck, catchErrors(hospitalsController.showByCity));

// GET /hospitals/state/:state
router.get('/state/:state', apikeyCheck, catchErrors(hospitalsController.showByState));

// GET /hospitals/county/:county
router.get('/county/:county', apikeyCheck, catchErrors(hospitalsController.showByCounty));

// GET /hospitals/name/:name
router.get('/name/:name', apikeyCheck, catchErrors(hospitalsController.showByName));

// POST /hospitals
router.post('/', apikeyCheck, catchErrors(hospitalsController.store));

// PATCH /hospitals/id/:id
router.patch('/id/:id', apikeyCheck, catchErrors(hospitalsController.update));

// PUT /hospitals/id/:id
router.put('/id/:id', apikeyCheck, catchErrors(hospitalsController.replace));

// DELETE /hospitals/id/:id
router.delete('/id/:id', apikeyCheck, catchErrors(hospitalsController.destroy));

module.exports = router;
