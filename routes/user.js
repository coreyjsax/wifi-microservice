const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const tools = require('../util/tools');
let t = tools;
let u = userController;

router.get('/', t.authenticate, u.getAllUsers);

router.get('/full', t.authenticate, u.getAllUsersFull);

router.get('/config', t.authenticate, u.config);

router.get('/:userId', t.authenticate, u.getUserById);

router.post('/create/:locId', t.authenticate, t.validateIt, u.findOrCreateUser);

module.exports = router;

