const express = require('express');
const router = express.Router();
const controller = require('../controllers/petsController');
const validaPet = require('../middlewares/validations/validaPet');
const { auth, checarRole } = require('../middlewares/auth');

router.post('/pets', auth, validaPet, controller.addPet);
router.get('/pets', controller.buscarPets);
router.get('/pets/:id', auth, controller.buscarPetPorId);
router.put('/pets/:id', auth, checarRole('admin', 'manager'), validaPet, controller.editarPet);
router.delete('/pets/:id', auth, checarRole('admin', 'manager'), controller.removerPet);

module.exports = router;