const express = require('express');
const router = express.Router();
const tareaController = require('../Controllers/tareaController');

router.get('/', tareaController.obtenerTodasLasTareas);
router.post('/', tareaController.crearTarea);
router.get('/:id', tareaController.obtenerTareaPorId);
router.put('/:id', tareaController.actualizarTarea);
router.delete('/:id', tareaController.eliminarTarea);
router.patch('/:id/estado', tareaController.cambiarEstadoTarea);

module.exports = router;