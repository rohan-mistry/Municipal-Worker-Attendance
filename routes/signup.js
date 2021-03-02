var express = require('express');
const { MunicipalWorker } = require('../controllers/signup');
var router = express.Router();

router.post('/signup/worker',MunicipalWorker)

module.exports = router;