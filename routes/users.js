const express = require('express');
const userController = require('../controllers/user-controller.js');
const ensureAuthentication = require('../middlewares/auth.js');

const router = express.Router();

router.post('/', (req, res) => userController.addUser(req, res));
router.get('/verification', (req, res) => userController.showVerifyUserUI(req, res));
router.patch('/verification', (req, res) => userController.verifyUser(req, res));
router.post('/verification', ensureAuthentication, (req, res) => userController.resendConfirmationEmail(req, res));
router.get('/password-reset', (req, res) => userController.showResetPasswordUI(req, res));
router.patch('/password-reset', (req, res) => userController.resetPassword(req, res));
router.post('/password-reset', (req, res) => userController.sendResetPasswordEmail(req, res));
router.post('/login', (req, res) => userController.signIn(req, res));
router.delete('/logout', ensureAuthentication, (req, res) => userController.signOut(req, res));
router.delete('/', ensureAuthentication, (req, res) => userController.deleteAccount(req, res));
router.patch('/password-change', ensureAuthentication, (req, res) => userController.changePassword(req, res));
router.get('/', ensureAuthentication, (req, res) => userController.getUserInfo(req, res));
router.patch('/', ensureAuthentication, (req, res) => userController.editProfile(req, res));

module.exports = router;
