// campos da tabela pets: nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status
const pool = require('../config/db');


const cadastrarPet = async (nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status) => {
    const result = await pool.query(
        'INSERT INTO pets (nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status]
    );
    return result.rows[0];
}

const obterPets = async () => {
    return await pool.query('SELECT * FROM pets;');
}

const obterPetPorId = async (id) => {
    return await pool.query('SELECT * FROM pets WHERE id=$1;', [id]);
}

const atualizarPet = async (id, nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status) => {
    const result = await pool.query(
        'UPDATE pets SET nome=$1, especie=$2, raca=$3, genero=$4, tamanho=$5, foto_url=$6, descricao=$7, id_dono=$8, id_abrigo=$9, status=$10 WHERE id=$11 RETURNING *',
        [nome, especie, raca, genero, tamanho, foto_url, descricao, id_dono, id_abrigo, status, id]
    );
    return result.rows[0];
}

const deletarPet = async (id) => {
    return await pool.query(`DELETE FROM pets WHERE id=$1 RETURNING *`, [id]);
}

module.exports = {
    cadastrarPet,
    obterPets,
    obterPetPorId,
    atualizarPet,
    deletarPet
};