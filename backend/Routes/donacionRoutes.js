const express = require('express');
const router = express.Router();
const donacionController = require('../Controllers/donacionController');

router.get('/', donacionController.obtenerTodasLasDonaciones);
router.post('/', donacionController.crearDonacion);
router.get('/:id', donacionController.obtenerDonacionPorId);
router.put('/:id', donacionController.actualizarDonacion);
router.delete('/:id', donacionController.eliminarDonacion);

module.exports = router;
