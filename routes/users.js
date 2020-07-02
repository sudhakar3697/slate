const express = require('express');
const userController = require('../controllers/user-controller.js');
const ensureAuthentication = require('../middlewares/auth.js');

const router = express.Router();

router.get('/', (req, res) => userController.getUsers(req, res));
router.post('/', (req, res) => userController.addUser(req, res));
router.get('/verification', (req, res) => userController.showVerifyUserUI(req, res));
router.patch('/verification', (req, res) => userController.verifyUser(req, res));
router.post('/verification', (req, res) => userController.resendConfirmationEmail(req, res));
router.get('/password-reset', (req, res) => userController.showResetPasswordUI(req, res));
router.post('/password-reset', (req, res) => userController.sendResetPasswordEmail(req, res));
router.patch('/password-reset', (req, res) => userController.resetPassword(req, res));
router.post('/login', (req, res) => userController.signIn(req, res));
router.get('/:id', ensureAuthentication, (req, res) => userController.getUserInfo(req, res));

module.exports = router;
