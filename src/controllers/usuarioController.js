const usuariomodel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

const criarUsuario = async (req, res) => {
    try {
        const { nome_completo, telefone, email, hash_senha, role } = req.body;
        
        
        const usuario = await usuariomodel.criarUsuario(nome_completo, telefone, email, hash_senha, role);
            res.status(201).json({
                mensagem: "Usuário criado com sucesso",
                usuario: usuario,
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const obterUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await usuariomodel.obterUsuarioPorId(id);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuario' });
    }   
};
const obterUsuarios = async (req, res) => {
    try {
        const resultado  = await usuariomodel.obterUsuarios();
        res.json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuarios' });

    }
};

const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_completo, telefone, email, hash_senha, role } = req.body;
        const usuarioExistente = await usuariomodel.obterUsuarioPorId(id);
        if (usuarioExistente.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario não encontrado' });
        }

        let hash = usuarioExistente.rows[0].hash_senha;
        if (hash_senha) {
            hash = await bcrypt.hash(hash_senha, 10);
        }

        const usuario = await usuariomodel.atualizarUsuario(id, nome_completo, telefone, email, hash, role);
        res.status(200).json({
          mensagem: "Usuário atualizado com sucesso",
          usuario: usuario,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const deletarUsuario = async (req, res) => {
    try {

        const { id } = req.params;

        // const usuario = await usuariomodel.obterUsuarioPorId(id);
        // if (usuario.rows.length === 0) {
        //     return res.status(404).json({ error: 'Usuario não encontrado' });
        // }
       const resultado = await usuariomodel.deletarUsuario(id);
        res.json({
          mensagem: "Usuário deletado com sucesso",
          usuario: resultado.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar usuario', error: err.message });
    }
};

module.exports = {
    obterUsuarios,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
    obterUsuarioPorId
};