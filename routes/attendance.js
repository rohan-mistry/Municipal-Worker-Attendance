var express = require('express');
const { 
  markAttendance, 
  getWorkerAttendance, 
  municipalAttendanceList 
} = require('../controllers/attendance');
const { auth, hasRoles } = require('../middleware/checkAuth');
var router = express.Router();

router.post('/',auth,hasRoles(['worker']),markAttendance)
router.get('/:worker',auth,hasRoles(['worker']),getWorkerAttendance)
router.get('/municipal/:municipal',auth,hasRoles(['admin']),municipalAttendanceList)

module.exports = router;