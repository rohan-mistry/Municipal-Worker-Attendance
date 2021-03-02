var express = require('express');
const { SignIn } = require('../controllers/login');
var router = express.Router();

router.post('/',SignIn)

module.exports = router;