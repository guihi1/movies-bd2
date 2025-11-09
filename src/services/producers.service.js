import pool from '../config/db.js';

export const findAllProducers = async () => {
  try {
    const query = `
      SELECT a.id, p.nome 
      FROM pessoaprodutora a
      JOIN pessoa p ON a.pessoa_id = p.id
      ORDER BY p.nome;
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar todas as pessoas produtoras:', error.stack);
    throw error;
  }
};

export const findPersonByProducerId = async (pessoaProdutoraId) => {
  try {
    const query = `
      SELECT p.id, p.nome, p.data_de_nascimento, p.altura, p.local_de_nascimento
      FROM pessoa p
      JOIN pessoaprodutora a ON p.id = a.pessoa_id
      WHERE a.id = $1;
    `;
    const { rows } = await pool.query(query, [pessoaProdutoraId]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar dados de pessoa pelo ID do pessoaprodutora (${pessoaProdutoraId}):`, error.stack);
    throw error;
  }
};

export const findAllProducersGrouped = async () => {
    try {
        const query =`
          SELECT p.id, p.nome, p.local_de_nascimento 
          FROM pessoaprodutora ppr
          JOIN pessoa p ON ppr.pessoa_id = p.id
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
        console.error('Erro ao buscar e agrupar todas as pessoaprodutoras:', error.stack);
        throw error;
    }
};

export const findMediaByProducerId = async (pessoaProdutoraId) => {
  try {
    const query = `
      SELECT 
        m.id AS midia_id,
        m.titulo,
        m.tipo,
        CASE 
          WHEN m.tipo = 'Filme' THEN NULL
          ELSE s.id
        END AS serie_id,
        CASE 
          WHEN m.tipo = 'Filme' THEN NULL
          ELSE s.nome
        END AS serie_nome
      FROM midia m
      LEFT JOIN episodio e 
        ON m.id = e.midia_id
      LEFT JOIN temporada t 
        ON e.temporada_id = t.id
      LEFT JOIN serie s 
        ON t.serie_id = s.id
      WHERE atu.pessoaprodutora_id = $1
      ORDER BY m.data_de_publicacao DESC;
    `;
    
    const { rows } = await pool.query(query, [pessoaProdutoraId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar filmografia pelo ID do pessoaprodutora (${pessoaProdutoraId}):`, error.stack);
    throw error;
  }
};

export const findProductionsByPersonId = async (pessoaId) => {
  try {
    const query = `
      SELECT 
        m.id AS midia_id,
        m.titulo,
        m.tipo,
        m.data_de_publicacao,
        CASE 
          WHEN m.tipo = 'Filme' THEN NULL
          ELSE s.id
        END AS serie_id,
        CASE 
          WHEN m.tipo = 'Filme' THEN NULL
          ELSE s.nome
        END AS serie_nome
      FROM midia m
      JOIN produz pz 
        ON m.id = pz.midia_id
      JOIN pessoaprodutora pp
        ON pz.pessoa_produtora_id = pp.id 
      LEFT JOIN episodio e 
        ON m.id = e.midia_id
      LEFT JOIN temporada t 
        ON e.temporada_id = t.id
      LEFT JOIN serie s 
        ON t.serie_id = s.id
      WHERE pp.pessoa_id = $1 -- FILTRO PELO ID DA PESSOA
      ORDER BY m.data_de_publicacao DESC;
    `;
    
    const { rows } = await pool.query(query, [pessoaId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar produções pelo ID da pessoa (${pessoaId}):`, error.stack);
    throw error;
  }
};

