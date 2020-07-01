const express = require('express');
const userController = require('../controllers/user-controller.js');

const router = express.Router();

router.get('/', (req, res) => userController.getUsers(req, res));
router.post('/', (req, res) => userController.addUser(req, res));
router.get('/verification', (req, res) => userController.showVerifyUserUI(req, res));
router.patch('/verification', (req, res) => userController.verifyUser(req, res));
router.post('/verification', (req, res) => userController.resendConfirmationEmail(req, res));
module.exports = router;
