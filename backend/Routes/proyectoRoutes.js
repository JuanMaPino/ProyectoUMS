const express = require('express');
const router = express.Router();
const proyectoController = require('../Controllers/proyectoController');

// Rutas para CRUD de proyectos
router.get('/', proyectoController.obtenerTodosLosProyectos);
router.post('/', proyectoController.crearProyecto);
router.get('/:id', proyectoController.obtenerProyectoPorId);
router.put('/:id', proyectoController.actualizarProyecto);
router.delete('/:id', proyectoController.eliminarProyecto);
// Rutas para manejar actividades dentro de un proyecto
router.post('/:id/actividades', proyectoController.agregarActividad);
router.put('/:id/actividades/:idActividad', proyectoController.actualizarActividad);
router.delete('/:id/actividades/:idActividad', proyectoController.eliminarActividad);
router.patch('/:id/actividades/:idActividad/estado', proyectoController.cambiarEstadoActividad);


// Ruta para obtener actividades de un proyecto
router.get('/:id/actividades', proyectoController.obtenerActividadesPorProyecto);

// Otras rutas específicas
router.patch('/:id/estado', proyectoController.cambiarEstadoProyecto);

module.exports = router;
