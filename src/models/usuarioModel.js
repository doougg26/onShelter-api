const pool = require('../config/db');
const bcrypt = require('bcrypt');

const criarUsuario = async (nome_completo, telefone, email, hash_senha, role) => {
    const senhaCriptografada = await bcrypt.hash(hash_senha, 10);
    const result = await pool.query(
        'INSERT INTO usuarios (nome_completo, telefone, email, hash_senha, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nome_completo, telefone, email, senhaCriptografada, role]
    );
    return result.rows[0];
}

const obterUsuarios = async () => {
    
    return await pool.query('SELECT * FROM usuarios;');
}

const obterUsuarioPorId = async (id) => {
   return await pool.query('SELECT * FROM usuarios WHERE id=$1;', [id]);
}

const obterUsuarioPorEmail = async (email) => {
  return await pool.query(
    `
          SELECT * FROM usuarios WHERE email=$1
        `,
    [email],
  );
};

const atualizarUsuario = async (id, nome_completo, telefone, email, hash_senha, role) => {
        const result = await pool.query(
            'UPDATE usuarios SET nome_completo=$1, telefone=$2, email=$3, hash_senha=$4, role=$5 WHERE id=$6 RETURNING *',
            [nome_completo, telefone, email, hash_senha, role, id]
        );
        return result.rows[0];
   }

const deletarUsuario = async (id) => {
   return await pool.query(`DELETE FROM usuarios WHERE id=$1 RETURNING *`, [id]);
}

module.exports = {
    criarUsuario,
    obterUsuarios,
    obterUsuarioPorId,
    obterUsuarioPorEmail,
    atualizarUsuario,
    deletarUsuario
};