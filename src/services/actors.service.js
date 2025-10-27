import pool from '../config/db.js';

export const findAllActors = async () => {
  try {
    const query = `
      SELECT a.id, p.nome 
      FROM ator a
      JOIN pessoa p ON a.pessoa_id = p.id
      ORDER BY p.nome;
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar todos os atores:', error.stack);
    throw error;
  }
};

export const findPersonByActorId = async (atorId) => {
  try {
    const query = `
      SELECT p.id, p.nome, p.data_de_nascimento, p.altura, p.local_de_nascimento
      FROM pessoa p
      JOIN ator a ON p.id = a.pessoa_id
      WHERE a.id = $1;
    `;
    const { rows } = await pool.query(query, [atorId]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar dados de pessoa pelo ID do ator (${atorId}):`, error.stack);
    throw error;
  }
};

export const findMediaByActorId = async (atorId) => {
  try {
    const query = `
      SELECT m.id, m.titulo, m.tipo, atu.personagem
      FROM midia m
      JOIN atuacao atu ON m.id = atu.midia_id
      WHERE atu.ator_id = $1
      ORDER BY m.data_de_publicacao DESC;
    `;
    const { rows } = await pool.query(query, [atorId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar filmografia pelo ID do ator (${atorId}):`, error.stack);
    throw error;
  }
};
