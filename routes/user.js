const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
let u = userController;


router.get('/', u.getAllUsers);

router.get('/full', u.getAllUsersFull);

router.get('/config', u.config);

router.get('/:userId', u.getUserById);

router.post('/create/:locId', u.findOrCreateUser);

router.post('/email/:locId', u.testAddEmail);

module.exports = router;

