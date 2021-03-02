var express = require('express');
const { getPhone, updatePhone, removeWorker } = require('../controllers/worker');
const { auth, hasRoles } = require('../middleware/checkAuth');
var router = express.Router();

router.get('/phone/:_id',auth,hasRoles(['worker']),getPhone)
router.put('/update_phone/:_id',auth,hasRoles(['worker']),updatePhone)
router.put('/remove',auth,hasRoles(['admin']),removeWorker)
module.exports = router;