// campos da tabela pets: nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status
const petsModel = require('../models/petsModel');
const addPet = async (req, res) => {
    try {
        const { nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status } = req.body;
        const pet = await petsModel.cadastrarPet(nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status);
        res.status(201).json({ message: 'Pet cadastrado com sucesso', pet });
    } catch (error) {
        console.error('Erro ao cadastrar pet:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const buscarPets = async (req, res) => {
    try {
        const pets = await petsModel.obterPets();
        res.status(200).json({ pets: pets.rows });
    } catch (error) {
        console.error('Erro ao obter pets:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const buscarPetPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await petsModel.obterPetPorId(id);
        if (pet.rows.length === 0) {
            return res.status(404).json({ message: 'Pet não encontrado' });
        }
        res.status(200).json({ pet: pet.rows[0] });
    } catch (error) {
        console.error('Erro ao obter pet por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }   
};

const editarPet = async (req, res) => {
    try {
        const { id } = req.params; 
        const { nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status } = req.body;
        const pet = await petsModel.atualizarPet(id, nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status);
        res.status(200).json({ message: 'Pet atualizado com sucesso', pet });
    } catch (error) {
        console.error('Erro ao atualizar pet:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const removerPet = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await petsModel.deletarPet(id);
        if (pet.rows.length === 0) {
            return res.status(404).json({ message: 'Pet não encontrado' });
        }
        res.status(200).json({ message: 'Pet deletado com sucesso', pet: pet.rows[0] });
    } catch (error) {
        console.error('Erro ao deletar pet:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = {
    addPet,
    buscarPets,
    buscarPetPorId,
    editarPet,
    removerPet
};