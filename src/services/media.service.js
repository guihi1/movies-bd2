import pool from '../config/db.js';

export const findMovies = async () => {
  try {
    const { rows } = await pool.query(`SELECT * FROM midia WHERE tipo = 'Filme' ORDER BY data_de_publicacao`);
    return rows;
  } catch (error) {
    console.error('Error fetching movies:', error.stack);
    throw error;
  }
};

export const findMovieById = async (id) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM midia WHERE id = $1 AND tipo = 'Filme'`, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar filme por ID (${id}):`, error.stack);
    throw error;
  }
}

export const findActorsByMediaId = async (mediaId) => {
  try {
    const query = `
      SELECT p.nome, atu.personagem, p.id
      FROM pessoa p
      JOIN ator ON p.id = ator.pessoa_id
      JOIN atuacao atu ON ator.id = atu.ator_id
      WHERE atu.midia_id = $1
      ORDER BY p.nome;
    `;

    const { rows } = await pool.query(query, [mediaId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar atores por ID de mídia (${mediaId}):`, error.stack);
    throw error;
  }
};

export const findReviewsByMediaId = async (mediaId) => {
  try {
    const query = `
      SELECT ava.nota, ava.comentario, usu.nome_usuario
      FROM avalia ava
      JOIN usuario usu ON ava.user_id = usu.id
      WHERE ava.midia_id = $1
      ORDER BY ava.id DESC; 
    `;
    const { rows } = await pool.query(query, [mediaId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar avaliações por ID de mídia (${mediaId}):`, error.stack);
    throw error;
  }
};
