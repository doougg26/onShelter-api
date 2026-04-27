// campos da tabela pets: nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status
const joi = require('joi');
const schema = joi.object({
    nome: joi.string().max(100).required(),
    especie: joi.string().max(50).required(),
    raca: joi.string().max(50).required(),
    genero: joi.string().valid('M', 'F').required(),
    tamanho: joi.string().max(20).required(),
    foto_url: joi.string().uri().max(255).required(),
    descricao: joi.string().max(255).allow(null),
    id_dono: joi.number().integer().allow(null),
    id_abrigo: joi.number().integer().allow(null),
    status: joi.string().max(50).required()
});

function validarPet(req, res, next) {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: 'Dados inválidos', errors: error.details });
    }
    next();
}

module.exports = validarPet;