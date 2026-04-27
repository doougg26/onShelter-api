const express = require('express');
const router = express.Router();
const controller = require('../controllers/desabrigadosController');
const validaDesabrigado = require('../middlewares/validations/validaDesabrigado');
const { auth, checarRole } = require('../middlewares/auth');

router.post('/desabrigados', auth, validaDesabrigado, controller.cadastrarDesabrigado);
router.post('/desabrigados/:id/entrar', auth, controller.entrarAbrigo);
router.get('/desabrigados', controller.obterDesabrigados);
router.get('/desabrigados/usuario/:usuario_id', auth, controller.obterDesabrigadoPorUsuarioId);
router.get('/desabrigados/:id', auth, controller.obterDesabrigadoPorId);
router.put('/desabrigados/:id', auth, checarRole('admin', 'manager'), validaDesabrigado, controller.atualizarDesabrigado);
router.delete('/desabrigados/:id', auth, checarRole('admin', 'manager'), controller.deletarDesabrigado);

module.exports = router;