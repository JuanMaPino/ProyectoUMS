const express = require('express');
const router = express.Router();
const { register, login, logout, SendCode, ValidateSendCode, newPassword } = require('../Controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/sendcode', SendCode);
router.post('/validatecode', ValidateSendCode);
router.post('/changepassword', newPassword);
module.exports = router;
