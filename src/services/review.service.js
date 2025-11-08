import pool from "../config/db.js";

export const createUserAndReview = async (nome_usuario, comentario, nota, midia_id) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userQuery = `
      INSERT INTO usuario (nome_usuario, email, senha)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;

    const userResult = await client.query(userQuery, [nome_usuario, Math.random(), 'senhasecreta']);
    const newUserId = userResult.rows[0].id;

    const reviewQuery = `
      INSERT INTO avalia (comentario, nota, user_id, midia_id)
      VALUES ($1, $2, $3, $4);
    `;

    await client.query(reviewQuery, [comentario, nota, newUserId, midia_id]);
    await client.query('COMMIT');

    return { novoUsuarioId: newUserId };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro na transação, ROLLBACK executado:', error);
    throw new Error('Não foi possível criar o usuário e a avaliação.');
  } finally {
    client.release();
  }
};
