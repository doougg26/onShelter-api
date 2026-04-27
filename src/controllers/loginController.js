const usuarioModel = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const login = async (req, res) => {
    const { email, hash_senha } = req.body;
    try{
    const usuario = await usuarioModel.obterUsuarioPorEmail(email);

    if (usuario.rows.length === 0) {
        return res.status(400).json({ error: 'usuario não encontrado' });
    }

    const senhaValida = await bcrypt.compare(hash_senha, usuario.rows[0].hash_senha);

    if (!senhaValida) {
        return res.status(400).json({ error: 'senha incorreta' });
    }

    const token = jwt.sign({ id: usuario.rows[0].id, role: usuario.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
}
catch (err) {
    res.status(500).json({ error: err.message });
}
};

module.exports ={login};