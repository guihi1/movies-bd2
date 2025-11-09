import pool from '../config/db.js';

export const findPersonById = async (pessoaId) => {
  try {
    const query = `
      SELECT p.id, p.nome, p.data_de_nascimento, p.altura, p.local_de_nascimento
      FROM pessoa p
      WHERE p.id = $1;
    `;
    const { rows } = await pool.query(query, [pessoaId]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar dados de pessoa pelo ID (${pessoaId}):`, error.stack);
    throw error;
  }
};