// CAMPOS DA TABELA DESABRIGADDOS: usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos
const pool = require('../config/db');

const cadastrarDesabrigado = async (usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos) => {
    const result = await pool.query(
        'INSERT INTO desabrigados (usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos]
    );
    return result.rows[0];
}

const obterDesabrigados = async () => {
    return await pool.query('SELECT * FROM desabrigados;');
}

const obterDesabrigadoPorId = async (id) => {
    return await pool.query('SELECT * FROM desabrigados WHERE id=$1;', [id]);
}

const atualizarDesabrigado = async (id, usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos) => {
    const result = await pool.query(
        'UPDATE desabrigados SET usuario_id=$1, nome_completo=$2, tamanho_familia=$3, contato=$4, ultima_localizacao=$5, latitude=$6, longitude=$7, id_abrigo_atual=$8, status=$9, detalhes_medicos=$10 WHERE id=$11 RETURNING *',
        [usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos, id]
    );
    return result.rows[0];
}

const deletarDesabrigado = async (id) => {
    return await pool.query(`DELETE FROM desabrigados WHERE id=$1 RETURNING *`, [id]);
}

const atualizarStatusAbrigo = async (id, id_abrigo_atual, status) => {
    const result = await pool.query(
        'UPDATE desabrigados SET id_abrigo_atual=$1, status=$2 WHERE id=$3 RETURNING *',
        [id_abrigo_atual, status, id]
    );
    return result.rows[0];
}

module.exports = {
    cadastrarDesabrigado,
    obterDesabrigados,
    obterDesabrigadoPorId,
    atualizarDesabrigado,
    atualizarStatusAbrigo,
    deletarDesabrigado
};