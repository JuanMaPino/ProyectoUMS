const express = require('express');
const router = express.Router();
const donacionController = require('../Controllers/donacionController');

router.get('/', donacionController.obtenerTodasLasDonaciones);
router.post('/', donacionController.crearDonacion);
router.get('/:id', donacionController.obtenerDonacionPorId);
router.put('/:id', donacionController.actualizarDonacion);
router.patch('/:id/anular', donacionController.anularDonacion); // Verifica que esta línea esté presente

module.exports = router;


