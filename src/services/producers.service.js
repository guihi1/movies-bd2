import pool from '../config/db.js';

export const findAllProducers = async () => {
  try {
    const query = `
      SELECT a.id, p.nome 
      FROM produtor a
      JOIN pessoa p ON a.pessoa_id = p.id
      ORDER BY p.nome;
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar todos os produtores:', error.stack);
    throw error;
  }
};

export const findPersonByProducerId = async (produtorId) => {
  try {
    const query = `
      SELECT p.id, p.nome, p.data_de_nascimento, p.altura, p.local_de_nascimento
      FROM pessoa p
      JOIN produtor a ON p.id = a.pessoa_id
      WHERE a.id = $1;
    `;
    const { rows } = await pool.query(query, [produtorId]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar dados de pessoa pelo ID do produtor (${produtorId}):`, error.stack);
    throw error;
  }
};

export const findAllProducersGrouped = async () => {
    try {
        const query =`
          SELECT a.id, p.nome, p.local_de_nascimento 
          FROM produtor a
          JOIN pessoa p ON a.pessoa_id = p.id
          ORDER BY p.nome;
        `;
        
        const { rows } = await pool.query(query);

        const groupedProducers = {};

        rows.forEach(producer => {
            const firstLetter = producer.nome
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .charAt(0)
                .toUpperCase();
            if (firstLetter >= 'A' && firstLetter <= 'Z') {
                if (!groupedProducers[firstLetter]) {
                    groupedProducers[firstLetter] = [];
                }
                
                groupedProducers[firstLetter].push(producer);
            }
            else {
              if(!groupedProducers['#']){
                groupedProducers['#'] = [];
              }
              groupedProducers['#'].push(producer);
            }
        });

        return groupedProducers;
    } catch (error) {
        console.error('Erro ao buscar e agrupar todos os produtores:', error.stack);
        throw error;
    }
};

// export const findMediaByProducerId = async (produtorId) => {
//   try {
//     const query = `
//       SELECT m.id, m.titulo, m.tipo, atu.personagem
//       FROM midia m
//       JOIN atuacao atu ON m.id = atu.midia_id
//       WHERE atu.produtor_id = $1
//       ORDER BY m.data_de_publicacao DESC;
//     `;
//     const { rows } = await pool.query(query, [produtorId]);
//     return rows;
//   } catch (error) {
//     console.error(`Erro ao buscar filmografia pelo ID do produtor (${produtorId}):`, error.stack);
//     throw error;
//   }
// };

export const findMediaByProducerId = async (produtorId) => {
  try {
    const query = `
      SELECT 
        m.id AS midia_id,
        m.titulo,
        m.tipo,
        atu.personagem,
        CASE 
          WHEN m.tipo = 'Filme' THEN NULL
          ELSE s.id
        END AS serie_id,
        CASE 
          WHEN m.tipo = 'Filme' THEN NULL
          ELSE s.nome
        END AS serie_nome
      FROM midia m
      JOIN atuacao atu 
        ON m.id = atu.midia_id
      LEFT JOIN episodio e 
        ON m.id = e.midia_id
      LEFT JOIN temporada t 
        ON e.temporada_id = t.id
      LEFT JOIN serie s 
        ON t.serie_id = s.id
      WHERE atu.produtor_id = $1
      ORDER BY m.data_de_publicacao DESC;
    `;
    
    const { rows } = await pool.query(query, [produtorId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar filmografia pelo ID do produtor (${produtorId}):`, error.stack);
    throw error;
  }
};

export const findAwardsByProducerId = async (produtorId) => {
  try {
    const query = `
      SELECT 
        pr.id AS premio_id,
        pr.nome AS nome_premio,
        pr.ano,
        pr.categoria,
        pr.organizacao,
        pr.descricao,
        ia.id AS indicado_id,
        a.personagem
      FROM premiacao pr
      JOIN indicado_atuacao ia 
        ON ia.premiacao_id = pr.id
      JOIN atuacao a 
        ON ia.atuacao_id = a.id
      WHERE a.produtor_id = $1
      ORDER BY pr.ano DESC;
    `;
    const { rows } = await pool.query(query, [produtorId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar premiações pelo ID do produtor (${produtorId}):`, error.stack);
    throw error;
  }
};

