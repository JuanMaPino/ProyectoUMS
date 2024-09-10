const express = require('express');
const router = express.Router();
const permisosController = require('../Controllers/permisosController');

router.get('/', permisosController.obtenerTodosLosPermisos);

module.exports = router;