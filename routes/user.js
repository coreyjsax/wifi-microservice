const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const tools = require('../util/tools');
let t = tools;
let u = userController;

router.get('/', u.getAllUsers);

router.get('/full', u.getAllUsersFull);

router.get('/config', u.config);

router.get('/:userId', u.getUserById);

router.post('/create/:locId', t.validateIt, u.findOrCreateUser);

module.exports = router;

