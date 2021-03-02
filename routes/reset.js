var express = require('express');
const { sendResetMail, verifyToken, resetPassword} = require('../controllers/reset');
var router = express.Router();

router.post('/',sendResetMail)
router.get('/identify/:token/:id',verifyToken)
router.put('/reset/:token/:id',resetPassword)

module.exports = router;