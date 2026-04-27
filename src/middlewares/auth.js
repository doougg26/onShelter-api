const jwt = require("jsonwebtoken");
const { obterUsuarioPorId } = require('../models/usuarioModel');

const auth = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ mensagem: "sem token" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        const usuarioResult = await obterUsuarioPorId(decoded.id);

        if (usuarioResult.rows.length === 0) {
            return res.status(401).json({ mensagem: "usuário não encontrado" });
        }

        req.usuario = {
            id: usuarioResult.rows[0].id,
            role: usuarioResult.rows[0].role,
        };

        next();
    } catch (erro) {
        return res.status(401).json({ mensagem: "token inválido" });
    }
};

const checarRole = (role) => {
    return (req, res, next) => {
        const roleUsuario = req.usuario && req.usuario.role;
        const rolesPermitidas = Array.isArray(role) ? role : [role];

        if (!rolesPermitidas.includes(roleUsuario)) {
            return res.status(403).json({
                erro: "Acesso negado. Você não tem permissão para realizar esta ação."
            });
        }

        next();
    };
};

module.exports = { auth, checarRole };