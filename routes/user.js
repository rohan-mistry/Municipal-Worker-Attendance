var express = require('express');
const { updateDetail, getDetail,isAccBlocked } = require('../controllers/user');
var router = express.Router();
const { auth, hasRoles } = require('../middleware/checkAuth');

router.get('/:_id',auth,hasRoles(['worker']),getDetail)
router.put('/update_detail/:_id',auth,hasRoles(['worker']),updateDetail)
router.get('/check/blocked/:_id',auth,hasRoles(['admin','worker']),isAccBlocked)

module.exports = router;