const express = require('express');
const userController = require('../controllers/user-controller.js');

const router = express.Router();

router.get('/', (req, res) => userController.getUsers(req, res));

module.exports = router;
