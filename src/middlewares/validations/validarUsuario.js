const Joi = require('joi');

    const schema = Joi.object({
        nome_completo: Joi.string().max(100).required(),
        telefone: Joi.string().max(20).required(),
        email: Joi.string().email().max(100).required(),
        hash_senha: Joi.string().min(6).max(100).required(),
        role: Joi.string().valid('admin', 'user', 'manager').required()
    });

function validarUsuario(req, res, next) {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details.map(e => e.message) });
    }
    next();
}



module.exports = validarUsuario;