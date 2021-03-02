const express = require('express');
const { addLocation,
  allMunicipals, 
  getLocations, 
  updateLocation, 
  getOneLocation, 
  pendingRequests, 
  requestStatus, 
  getAllotment,
  newAllotment,
  removeAllotment
} = require('../controllers/municipal');
const { getWorkers } = require('../controllers/worker');
const { auth, hasRoles } = require('../middleware/checkAuth');
var router = express.Router();

router.get('/',allMunicipals);
router.post('/locations',auth,hasRoles(['admin']),addLocation);
router.get('/locations/:_id',auth,hasRoles(['admin']),getLocations);
router.put('/locations/:_id',auth,hasRoles(['admin']),updateLocation)
router.get('/single_location/:_id',auth,hasRoles(['admin']),getOneLocation)
router.get('/workers/:_id',auth,hasRoles(['admin']),getWorkers);
router.get('/requests/:_id',auth,hasRoles(['admin']),pendingRequests);
router.put('/requests',auth,hasRoles(['admin']),requestStatus);
router.get('/allotment/:_id',auth,hasRoles(['admin','worker']),getAllotment);
router.post('/allotment',auth,hasRoles(['admin']),newAllotment);
router.put('/allotment',auth,hasRoles(['admin']),removeAllotment);

module.exports = router;