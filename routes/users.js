const express = require('express');
const userController = require('../controllers/user-controller.js');

const router = express.Router();

router.get('/', (req, res) => userController.getUsers(req, res));
router.post('/', (req, res) => userController.addUser(req, res));
router.get('/verification', (req, res) => userController.showVerifyUserUI(req, res));
router.put('/verification', (req, res) => userController.verifyUser(req, res));

module.exports = router;
