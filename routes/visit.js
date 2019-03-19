const express = require('express');
const router = express.Router();

const visitController = require('../controllers/visit');
let v = visitController;

router.get('/', v.getAllVisits);

router.get('/:visitId', v.getVisitById);

module.exports = router;