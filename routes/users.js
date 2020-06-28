const express = require('express');
const userController = require('../controllers/user-controller.js');

const router = express.Router();

router.get('/', (req, res) => userController.getUsers(req, res));
router.post('/', (req, res) => userController.addUser(req, res));

module.exports = router;
