//campos da tabela abrigos:nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao
const pool = require('../config/db');

const cadastrarAbrigo = async (nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao) => {
    const result = await pool.query(
        'INSERT INTO abrigos (nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
        [nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao]
    );
    return result.rows[0];
}

const obterAbrigos = async () => {
    return await pool.query('SELECT * FROM abrigos;');
}

const obterAbrigoPorId = async (id) => {
    return await pool.query('SELECT * FROM abrigos WHERE id=$1;', [id]);
}

const atualizarAbrigo = async (id, nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao) => {
    const result = await pool.query(
        'UPDATE abrigos SET nome=$1, endereco=$2, cep=$3, latitude=$4, longitude=$5, capacidade_total=$6, capacidade_atual=$7, aceita_pets=$8, capacidade_pets=$9, capacidade_atual_pets=$10, contato=$11, gerente_id=$12, verificacao=$13 WHERE id=$14 RETURNING *',
        [nome, endereco, cep, latitude, longitude, capacidade_total, capacidade_atual, aceita_pets, capacidade_pets, capacidade_atual_pets, contato, gerente_id, verificacao, id]
    );
    return result.rows[0];
}

const deletarAbrigo = async (id) => {
    return await pool.query(`DELETE FROM abrigos WHERE id=$1 RETURNING *`, [id]);
}

const atualizarCapacidadeAtual = async (id, capacidade_atual) => {
    const result = await pool.query(
        'UPDATE abrigos SET capacidade_atual=$1 WHERE id=$2 RETURNING *',
        [capacidade_atual, id]
    );
    return result.rows[0];
}

module.exports = {
    cadastrarAbrigo,
    obterAbrigos,
    obterAbrigoPorId,
    atualizarAbrigo,
    atualizarCapacidadeAtual,
    deletarAbrigo
};
