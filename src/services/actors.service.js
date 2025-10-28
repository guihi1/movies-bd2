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

// export const findMediaByActorId = async (atorId) => {
//   try {
//     const query = `
//       WITH filmografia_raw AS (
//           SELECT m.id AS id_destino, m.nome AS titulo_principal, a.personagem, 'Filme' AS tipo_midia
//           FROM atuacao a
//           JOIN midia m ON a.midia_id = m.id
//           LEFT JOIN episodio e ON m.id = e.midia_id 
//           WHERE a.pessoa_id = $1 AND e.midia_id IS NULL
          
//           UNION ALL
          
//           SELECT s.id AS id_destino, s.nome AS titulo_principal, a.personagem, 'Serie' AS tipo_midia
//           FROM atuacao a
//           JOIN episodio e ON a.midia_id = e.midia_id 
//           JOIN temporada t ON e.temporada_id = t.id
//           JOIN serie s ON t.serie_id = s.id          
//           WHERE a.pessoa_id = $1
//       )
//       SELECT * FROM filmografia_raw ORDER BY titulo_principal, tipo_midia DESC;
//     `;
    
//     // O array de parâmetros [$1] permanece o mesmo.
//     const { rows } = await pool.query(query, [atorId]);
//     return rows;
//   } catch (error) {
//     console.error(`Erro ao buscar filmografia pelo ID do ator (${atorId}):`, error.stack);
//     // É uma boa prática lançar o erro para que o controller possa lidar com ele (ex: página 500)
//     throw error;
//   }
// };