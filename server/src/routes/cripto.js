const router = require('express').Router();
const CriptoController = require('../controllers/cripto.controller.js');

router.get('/prices', CriptoController.getCriptoPrices);

module.exports = router;
