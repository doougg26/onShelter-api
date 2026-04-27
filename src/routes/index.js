const express = require('express');
const abrigosRoutes = require('./abrigosRoutes');
const desabrigadosRoutes = require('./desabrigadosRoutes');
const petsRoutes = require('./petsRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const loginRoutes = require('./loginRoutes');
const router = express.Router();

router.use('/', abrigosRoutes);
router.use('/', desabrigadosRoutes);
router.use('/', petsRoutes);
router.use('/', usuarioRoutes);
router.use('/', loginRoutes);

router.get("/", (req, res) => {
    res.send("<h1>Welcome to OnShelter API</h1>");
});


module.exports = router;