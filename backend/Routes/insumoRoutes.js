const express = require('express');
const router = express.Router();
const insumoController = require('../Controllers/insumoController');

router.get('/', insumoController.getAllInsumos);
router.post('/', insumoController.createInsumo);
router.get('/:id', insumoController.getInsumoById);
router.put('/:id', insumoController.updateInsumo);
router.delete('/:id', insumoController.deleteInsumo);
router.patch('/:id/disable', insumoController.disableInsumo);

module.exports = router;