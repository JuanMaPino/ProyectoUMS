const express = require('express');
const router = express.Router();
const { register, login, logout, SendCode, ValidateSendCode, newPassword, getUsers, updateUsuario, disableUsuario  } = require('../Controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/sendcode', SendCode);
router.post('/validatecode', ValidateSendCode);
router.post('/changepassword', newPassword);
router.get('/users', getUsers);
router.put('/users/:id', updateUsuario);
router.patch('/users/disable/:id', disableUsuario);
module.exports = router;
