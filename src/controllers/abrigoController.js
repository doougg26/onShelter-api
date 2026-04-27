//campos da tabela abrigos: nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao
const abrigosModel = require('../models/abrigosModel');

const addAbrigo = async (req, res) => {
    try {
        const { nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao } = req.body;
        const abrigo = await abrigosModel.cadastrarAbrigo(nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao);
        res.status(201).json({ message: 'Abrigo cadastrado com sucesso', abrigo });
    } catch (error) {
        console.error('Erro ao cadastrar abrigo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const buscarAbrigoss = async (req, res) => {
    try {
        const abrigosResult = await abrigosModel.obterAbrigos();
        res.status(200).json({ abrigos: abrigosResult.rows });
    } catch (error) {
        console.error('Erro ao obter abrigos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const buscarAbrigoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const abrigo = await abrigosModel.obterAbrigoPorId(id);
        if (abrigo.rows.length === 0) {
            return res.status(404).json({ message: 'Abrigo não encontrado' });
        }
        res.status(200).json({ abrigo: abrigo.rows[0] });
    } catch (error) {
        console.error('Erro ao obter abrigo por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }  
};

const editarAbrigo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao } = req.body;   
        const abrigo = await abrigosModel.atualizarAbrigo(id, nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao);
        res.status(200).json({ message: 'Abrigo atualizado com sucesso', abrigo });
    } catch (error) {
        console.error('Erro ao atualizar abrigo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const removerAbrigo = async (req, res) => {
    try {
        const { id } = req.params;
        const abrigo = await abrigosModel.deletarAbrigo(id);
        if (abrigo.rows.length === 0) {
            return res.status(404).json({ message: 'Abrigo não encontrado' });
        }
        res.status(200).json({ message: 'Abrigo deletado com sucesso', abrigo: abrigo.rows[0] });
    } catch (error) {
        console.error('Erro ao deletar abrigo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = {
    addAbrigo,
    buscarAbrigoss,
    buscarAbrigoPorId,
    editarAbrigo,
    removerAbrigo
};