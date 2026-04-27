const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
const validarUsuario = require('../middlewares/validations/validarUsuario');
const { auth, checarRole } = require('../middlewares/auth');

router.post('/usuarios', validarUsuario, controller.criarUsuario);
router.get('/usuarios', controller.obterUsuarios);
router.get('/usuarios/:id', auth,controller.obterUsuarioPorId);
router.put('/usuarios/:id', validarUsuario, controller.atualizarUsuario);
router.delete('/usuarios/:id',auth,checarRole('admin'), controller.deletarUsuario);

module.exports = router;