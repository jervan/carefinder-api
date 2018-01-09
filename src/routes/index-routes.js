const express = require('express');
const router = express.Router();

/**
 * The index route simply returns 204 No Content
 */
router.get('/', (req, res, next) =>
{
    res.status(204).send();
});

module.exports = router;
