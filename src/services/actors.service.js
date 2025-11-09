import pool from '../config/db.js';

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

export const findAllActorsGrouped = async () => {
    try {
        const query =`
          SELECT p.id, p.nome, p.local_de_nascimento 
          FROM ator a
          JOIN pessoa p ON a.pessoa_id = p.id
          ORDER BY p.nome;
        `;
        
        const { rows } = await pool.query(query);

        const groupedActors = {};

        rows.forEach(actor => {
            const firstLetter = actor.nome
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .charAt(0)
                .toUpperCase();
            if (firstLetter >= 'A' && firstLetter <= 'Z') {
                if (!groupedActors[firstLetter]) {
                    groupedActors[firstLetter] = [];
                }
                
                groupedActors[firstLetter].push(actor);
            }
            else {
              if(!groupedActors['#']){
                groupedActors['#'] = [];
              }
              groupedActors['#'].push(actor);
            }
        });

        return groupedActors;
    } catch (error) {
        console.error('Erro ao buscar e agrupar todos os atores:', error.stack);
        throw error;
    }
};


export const findMediaByActorId = async (atorId) => {
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

export const findActingsByPersonId = async (pessoaId) => {
  try {
    const query = `
      SELECT 
        m.id AS midia_id,
        m.titulo,
        m.tipo,
        m.data_de_publicacao,
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
      JOIN ator a
        ON atu.ator_id = a.id
      LEFT JOIN episodio e 
        ON m.id = e.midia_id
      LEFT JOIN temporada t 
        ON e.temporada_id = t.id
      LEFT JOIN serie s 
        ON t.serie_id = s.id
      WHERE a.pessoa_id = $1
      ORDER BY m.data_de_publicacao DESC;
    `;
    
    const { rows } = await pool.query(query, [pessoaId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar atuações pelo ID da pessoa (${pessoaId}):`, error.stack);
    throw error;
  }
};


export const findActingAwardsByPersonId = async (pessoaId) => {
  try {
    const query = `
      SELECT 
        pr.id AS premio_id,
        pr.nome,
        pr.ano,
        pr.categoria,
        pr.organizacao,
        pr.descricao,
        ia.id AS indicado_id,
        atu.personagem 
      FROM premiacao pr
      JOIN indicado_atuacao ia 
        ON ia.premiacao_id = pr.id
      JOIN atuacao atu
        ON ia.atuacao_id = atu.id
      JOIN ator a
        ON atu.ator_id = a.id
      WHERE a.id = $1; 
    `;
    const { rows } = await pool.query(query, [pessoaId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar prêmios de atuação pelo ID da pessoa (${pessoaId}):`, error.stack);
    throw error;
  }
};