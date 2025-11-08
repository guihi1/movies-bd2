import pool from '../config/db.js';

export const findAllWriters = async () => {
  try {
    const query = `
      SELECT a.id, p.nome 
      FROM roteirista a
      JOIN pessoa p ON a.pessoa_id = p.id
      ORDER BY p.nome;
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar todos os roteiristas:', error.stack);
    throw error;
  }
};

export const findPersonByWriterId = async (roteiristaId) => {
  try {
    const query = `
      SELECT p.id, p.nome, p.data_de_nascimento, p.altura, p.local_de_nascimento
      FROM pessoa p
      JOIN roteirista a ON p.id = a.pessoa_id
      WHERE a.id = $1;
    `;
    const { rows } = await pool.query(query, [roteiristaId]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar dados de pessoa pelo ID do roteirista (${roteiristaId}):`, error.stack);
    throw error;
  }
};

export const findAllWritersGrouped = async () => {
    try {
        const query =`
          SELECT a.id, p.nome, p.local_de_nascimento 
          FROM roteirista a
          JOIN pessoa p ON a.pessoa_id = p.id
          ORDER BY p.nome;
        `;
        
        const { rows } = await pool.query(query);

        const groupedWriters = {};

        rows.forEach(writer => {
            const firstLetter = writer.nome
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .charAt(0)
                .toUpperCase();
            if (firstLetter >= 'A' && firstLetter <= 'Z') {
                if (!groupedWriters[firstLetter]) {
                    groupedWriters[firstLetter] = [];
                }
                
                groupedWriters[firstLetter].push(writer);
            }
            else {
              if(!groupedWriters['#']){
                groupedWriters['#'] = [];
              }
              groupedWriters['#'].push(writer);
            }
        });

        return groupedWriters;
    } catch (error) {
        console.error('Erro ao buscar e agrupar todos os roteiristas:', error.stack);
        throw error;
    }
};

// export const findMediaByWriterId = async (roteiristaId) => {
//   try {
//     const query = `
//       SELECT m.id, m.titulo, m.tipo, atu.personagem
//       FROM midia m
//       JOIN atuacao atu ON m.id = atu.midia_id
//       WHERE atu.roteirista_id = $1
//       ORDER BY m.data_de_publicacao DESC;
//     `;
//     const { rows } = await pool.query(query, [roteiristaId]);
//     return rows;
//   } catch (error) {
//     console.error(`Erro ao buscar filmografia pelo ID do roteirista (${roteiristaId}):`, error.stack);
//     throw error;
//   }
// };

export const findMediaByWriterId = async (roteiristaId) => {
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
      WHERE atu.roteirista_id = $1
      ORDER BY m.data_de_publicacao DESC;
    `;
    
    const { rows } = await pool.query(query, [roteiristaId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar filmografia pelo ID do roteirista (${roteiristaId}):`, error.stack);
    throw error;
  }
};

export const findAwardsByWriterId = async (roteiristaId) => {
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
      WHERE a.roteirista_id = $1
      ORDER BY pr.ano DESC;
    `;
    const { rows } = await pool.query(query, [roteiristaId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar premiações pelo ID do roteirista (${roteiristaId}):`, error.stack);
    throw error;
  }
};

