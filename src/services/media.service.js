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
};

export const findShows = async () => {
  try {
    const { rows } = await pool.query(`SELECT * FROM serie ORDER BY nome`);
    return rows;
  } catch (error) {
    console.error('Error fetching shows:', error.stack);
    throw error;
  }
};

export const findShowById = async (id) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM serie WHERE id = $1`, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar serie por ID (${id}):`, error.stack);
    throw error;
  }
};

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

export const findActorsByShowId = async (showId) => {
  try {
    const query = `
      SELECT DISTINCT
          P.id AS pessoa_id,
          P.nome AS nome_ator,
          P.data_de_nascimento,
          A.personagem
      FROM serie S
      JOIN temporada T ON S.id = T.serie_id
      JOIN episodio E ON T.id = E.temporada_id
      JOIN midia M ON E.midia_id = M.id
      JOIN atuacao A ON M.id = A.midia_id
      JOIN ator ATR ON A.ator_id = ATR.id
      JOIN pessoa P ON ATR.pessoa_id = P.id
      WHERE S.id = $1
      ORDER BY P.nome;
    `;

    const { rows } = await pool.query(query, [showId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar atores por ID da série (${showId}):`, error.stack);
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
