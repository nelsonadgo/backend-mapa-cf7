const { Router } = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const espaciosController = require('./espacios.controller');

const router = Router();

router.get('/', asyncHandler(espaciosController.listEspacios));
router.get('/:id', asyncHandler(espaciosController.getEspacio));
router.post('/', asyncHandler(espaciosController.createEspacio));
router.put('/:id', asyncHandler(espaciosController.replaceEspacio));
router.patch('/:id', asyncHandler(espaciosController.updateEspacio));
router.delete('/:id', asyncHandler(espaciosController.deleteEspacio));

module.exports = router;
