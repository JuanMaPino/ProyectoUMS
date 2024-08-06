const express = require('express');
const router = express.Router();
const actividadController = require('../Controllers/actividadController');

router.get('/', actividadController.obtenerTodasLasActividades);
router.get('/proyecto/:proyectoId', actividadController.obtenerActividadesPorProyecto); // Asegúrate de usar el controlador
router.post('/', actividadController.crearActividad);
router.get('/:id', actividadController.obtenerActividadPorId);
router.put('/:id', actividadController.actualizarActividad);
router.delete('/:id', actividadController.eliminarActividad);
router.patch('/:id/estado', actividadController.cambiarEstadoActividad);
router.get('/buscar/:nombre', actividadController.obtenerActividadPorNombre);

module.exports = router;

