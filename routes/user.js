const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
let u = userController;


router.get('/', u.getAllUsers);

router.get('/full', u.getAllUsersFull);

router.get('/:userId', u.getUserById);

router.put('/:userId', u.getUserByIdEdit);

router.post('/create/:locId', u.findOrCreateUser);

module.exports = router;

