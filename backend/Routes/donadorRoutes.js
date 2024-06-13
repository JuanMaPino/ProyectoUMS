const express = require('express');
const router = express.Router();
const donadorController = require('../Controllers/donadorController');

router.get('/', donadorController.obtenerTodosLosDonadores);
router.post('/', donadorController.crearDonador);
router.get('/:id', donadorController.obtenerDonadorPorId);
router.put('/:id', donadorController.actualizarDonador);
router.delete('/:id', donadorController.eliminarDonador);
router.patch('/:id/estado', donadorController.cambiarEstadoDonador);
router.get('/buscar/:identificacion', donadorController.obtenerDonadorPorIdentificacion);

module.exports = router;
