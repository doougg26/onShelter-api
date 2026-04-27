const express = require('express');
const router = express.Router();
const controller = require('../controllers/abrigoController');
const validaAbrigo = require('../middlewares/validations/validaAbrigo');
const { auth, checarRole } = require('../middlewares/auth');

router.post('/abrigos', auth, validaAbrigo, controller.addAbrigo);
router.get('/abrigos', controller.buscarAbrigoss);
router.get('/abrigos/:id', auth, controller.buscarAbrigoPorId);
router.put('/abrigos/:id', auth, checarRole('admin', 'manager'), validaAbrigo, controller.editarAbrigo);
router.delete('/abrigos/:id', auth, checarRole('admin', 'manager'), controller.removerAbrigo);

module.exports = router;