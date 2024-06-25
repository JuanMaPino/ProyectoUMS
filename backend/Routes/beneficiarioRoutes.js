const express = require('express');
const router = express.Router();
const beneficiarioController = require('../Controllers/beneficiarioController');

router.get('/', beneficiarioController.obtenerTodosLosBeneficiarios);
router.post('/', beneficiarioController.crearBeneficiario);
router.get('/:id', beneficiarioController.obtenerBeneficiarioPorId);
router.put('/:id', beneficiarioController.actualizarBeneficiario);
router.delete('/:id', beneficiarioController.eliminarBeneficiario);
router.patch('/:id/estado', beneficiarioController.cambiarEstadoBeneficiario);
router.get('/buscar/:identificacion', beneficiarioController.obtenerBeneficiarioPorIdentificacion);

module.exports = router;


