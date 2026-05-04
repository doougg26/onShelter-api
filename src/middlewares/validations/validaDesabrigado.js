// CAMPOS DA TABELA DESABRIGADDOS: usuario_id, nome_completo, tamanho_familia, contato, cep, latitude, longitude, id_abrigo_atual, status, detalhes_medicos
const joi = require('joi');

const schema = joi.object({
    usuario_id: joi.number().integer().allow(null),
    nome_completo: joi.string().max(100).required(),
    tamanho_familia: joi.number().integer().min(1).required(),
    contato: joi.string().max(20).required(),
    ultima_localizacao: joi.string().max(255).allow('').default('Não informado'),
    latitude: joi.number().precision(10).allow(null),
    longitude: joi.number().precision(10).allow(null),
    id_abrigo_atual: joi.number().integer().allow(null),
    status: joi.string().max(50).required(),
    detalhes_medicos: joi.string().max(255).allow(null)
});

function validarDesabrigado(req, res, next) {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details.map(e => e.message) });
    }
    next();
}

module.exports = validarDesabrigado;