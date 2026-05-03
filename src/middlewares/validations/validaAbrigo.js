//campos da tabela abrigos: nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao

const joi = require('joi');
const schema = joi.object({
    nome: joi.string().max(100).required(),
    endereco: joi.string().max(255).required(),
    cep: joi.string().pattern(/^\d{8}$/).allow(null),
    latitude: joi.number().precision(10).allow(null),
    longitude: joi.number().precision(10).allow(null),
    capacidade_total: joi.number().integer().min(0).required(),
    capacidade_atual: joi.number().integer().min(0).required(),
    aceita_pets: joi.boolean().required(),
    capacidade_pets: joi.number().integer().min(0).required(),
    capacidade_atual_pets: joi.number().integer().min(0).required(),
    contato: joi.string().max(100).required(),
    gerente_id: joi.alternatives().try(joi.string().uuid(), joi.number().integer()).required(),
    verificacao: joi.boolean().required()
});

function validarAbrigo(req, res, next) {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details.map(e => e.message) });
    }
    next();
}

module.exports = validarAbrigo;