// CAMPOS DA TABELA DESABRIGADDOS: usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos
const desabrigadosModel = require('../models/desabrigadosModel');
const abrigosModel = require('../models/abrigosModel');

const cadastrarDesabrigado = async (req, res) => {
    try {
        const { usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos } = req.body;
        const desabrigado = await desabrigadosModel.cadastrarDesabrigado(usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos);
        res.status(201).json({ message: 'Desabrigado cadastrado com sucesso', desabrigado });
    } catch (error) {
        console.error('Erro ao cadastrar desabrigado:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};  

const obterDesabrigados = async (req, res) => {
    try {
        const desabrigados = await desabrigadosModel.obterDesabrigados();
        res.json(desabrigados.rows);
    } catch (error) {
        console.error('Erro ao obter desabrigados:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const obterDesabrigadoPorId = async (req, res) => {
    try {   
        const { id } = req.params;
        const desabrigado = await desabrigadosModel.obterDesabrigadoPorId(id);
        if (desabrigado.rows.length === 0) {
            return res.status(404).json({ message: 'Desabrigado não encontrado' });
        }
        res.json(desabrigado.rows[0]);
    } catch (error) {
        console.error('Erro ao obter desabrigado por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const atualizarDesabrigado = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos } = req.body;
        
        // Verificar permissão: apenas o próprio usuário ou admin pode atualizar
        const desabrigadoExistente = await desabrigadosModel.obterDesabrigadoPorId(id);
        if (desabrigadoExistente.rows.length === 0) {
            return res.status(404).json({ message: 'Desabrigado não encontrado' });
        }
        
        if (req.usuario.id !== desabrigadoExistente.rows[0].usuario_id && req.usuario.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas o próprio usuário ou administrador pode executar essa ação.' });
        }
        
        const desabrigado = await desabrigadosModel.atualizarDesabrigado(id, usuario_id, nome_completo, tamanho_familia, contato, ultima_localizacao, latitude, longitude, id_abrigo_atual, status, detalhes_medicos);
        res.json({ message: 'Desabrigado atualizado com sucesso', desabrigado });
    } catch (error) {
        console.error('Erro ao atualizar desabrigado:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const entrarAbrigo = async (req, res) => {
    try {
        const { id } = req.params;
        const { abrigoId } = req.body;

        if (!abrigoId) {
            return res.status(400).json({ message: 'ID do abrigo é obrigatório' });
        }

        const desabrigadoResult = await desabrigadosModel.obterDesabrigadoPorId(id);
        if (desabrigadoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Desabrigado não encontrado' });
        }

        const desabrigado = desabrigadoResult.rows[0];
        if (req.usuario.id !== desabrigado.usuario_id && req.usuario.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas o próprio usuário ou administrador pode executar essa ação.' });
        }

        const abrigoResult = await abrigosModel.obterAbrigoPorId(abrigoId);
        if (abrigoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Abrigo não encontrado' });
        }

        const abrigo = abrigoResult.rows[0];
        const novaCapacidade = abrigo.capacidade_atual + desabrigado.tamanho_familia;
        if (novaCapacidade > abrigo.capacidade_total) {
            return res.status(400).json({ message: 'Capacidade do abrigo insuficiente para a família.' });
        }

        const updatedAbrigo = await abrigosModel.atualizarCapacidadeAtual(abrigo.id, novaCapacidade);
        const updatedDesabrigado = await desabrigadosModel.atualizarStatusAbrigo(id, abrigo.id, 'abrigado');

        res.json({
            message: 'Desabrigado vinculado ao abrigo com sucesso',
            desabrigado: updatedDesabrigado,
            abrigo: updatedAbrigo,
        });
    } catch (error) {
        console.error('Erro ao vincular desabrigado ao abrigo:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const deletarDesabrigado = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar permissão: apenas o próprio usuário ou admin pode deletar
        const desabrigadoExistente = await desabrigadosModel.obterDesabrigadoPorId(id);
        if (desabrigadoExistente.rows.length === 0) {
            return res.status(404).json({ message: 'Desabrigado não encontrado' });
        }
        
        if (req.usuario.id !== desabrigadoExistente.rows[0].usuario_id && req.usuario.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas o próprio usuário ou administrador pode executar essa ação.' });
        }
        
        const desabrigado = await desabrigadosModel.deletarDesabrigado(id);
        if (desabrigado.rows.length === 0) {
            return res.status(404).json({ message: 'Desabrigado não encontrado' });
        }
        res.json({ message: 'Desabrigado deletado com sucesso', desabrigado: desabrigado.rows[0] });
    } catch (error) {
        console.error('Erro ao deletar desabrigado:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const obterDesabrigadoPorUsuarioId = async (req, res) => {
    try {   
        const { usuario_id } = req.params;
        const desabrigado = await desabrigadosModel.obterDesabrigados();
        
        // Filtra por usuario_id
        const encontrado = desabrigado.rows.find(d => d.usuario_id == usuario_id);
        
        if (!encontrado) {
            return res.status(404).json({ message: 'Desabrigado não encontrado para este usuário' });
        }
        
        res.json(encontrado);
    } catch (error) {
        console.error('Erro ao obter desabrigado por usuário ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = {
    cadastrarDesabrigado,
    obterDesabrigados,
    obterDesabrigadoPorId,
    obterDesabrigadoPorUsuarioId,
    atualizarDesabrigado,
    entrarAbrigo,
    deletarDesabrigado
};
