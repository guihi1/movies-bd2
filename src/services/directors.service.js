import pool from '../config/db.js';

export const findAllDirectors = async () => {
  try {
    const query = `
      SELECT p.id, p.nome 
      FROM diretor d
      JOIN pessoa p ON d.pessoa_id = p.id
      ORDER BY p.nome;
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar todos os diretores:', error.stack);
    throw error;
  }
};

export const findPersonByDirectorId = async (diretorId) => {
  try {
    const query = `
      SELECT p.id, p.nome, p.data_de_nascimento, p.altura, p.local_de_nascimento
      FROM pessoa p
      JOIN diretor a ON p.id = a.pessoa_id
      WHERE a.id = $1;
    `;
    const { rows } = await pool.query(query, [diretorId]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar dados de pessoa pelo ID do diretor (${diretorId}):`, error.stack);
    throw error;
  }
};

export const findAllDirectorsGrouped = async () => {
    try {
        const query =`
          SELECT p.id, p.nome, p.local_de_nascimento 
          FROM diretor d
          JOIN pessoa p ON d.pessoa_id = p.id
          ORDER BY p.nome;
        `;
        
        const { rows } = await pool.query(query);

        const groupedDirectors = {};

        rows.forEach(director => {
            const firstLetter = director.nome
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .charAt(0)
                .toUpperCase();
            if (firstLetter >= 'A' && firstLetter <= 'Z') {
                if (!groupedDirectors[firstLetter]) {
                    groupedDirectors[firstLetter] = [];
                }
                
                groupedDirectors[firstLetter].push(director);
            }
            else {
              if(!groupedDirectors['#']){
                groupedDirectors['#'] = [];
              }
              groupedDirectors['#'].push(director);
            }
        });

        return groupedDirectors;
    } catch (error) {
        console.error('Erro ao buscar e agrupar todos os diretores:', error.stack);
        throw error;
    }
};

// export const findMediaByDirectorId = async (diretorId) => {
//   try {
//     const query = `
//       SELECT m.id, m.titulo, m.tipo, atu.personagem
//       FROM midia m
//       JOIN direcao atu ON m.id = atu.midia_id
//       WHERE atu.diretor_id = $1
//       ORDER BY m.data_de_publicacao DESC;
//     `;
//     const { rows } = await pool.query(query, [diretorId]);
//     return rows;
//   } catch (error) {
//     console.error(`Erro ao buscar filmografia pelo ID do diretor (${diretorId}):`, error.stack);
//     throw error;
//   }
// };

export const findMediaByDirectorId = async (diretorId) => {
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
      JOIN direcao atu 
        ON m.id = atu.midia_id
      LEFT JOIN episodio e 
        ON m.id = e.midia_id
      LEFT JOIN temporada t 
        ON e.temporada_id = t.id
      LEFT JOIN serie s 
        ON t.serie_id = s.id
      WHERE atu.diretor_id = $1
      ORDER BY m.data_de_publicacao DESC;
    `;
    
    const { rows } = await pool.query(query, [diretorId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar filmografia pelo ID do diretor (${diretorId}):`, error.stack);
    throw error;
  }
};

export const findAwardsByDirectorId = async (diretorId) => {
  try {
    const query = `
      SELECT 
        pr.id AS premio_id,
        pr.nome AS nome_premio,
        pr.ano,
        pr.categoria,
        pr.organizacao,
        pr.descricao,
        ia.id AS indicado_id
      FROM premiacao pr
      JOIN indicado_direcao ia 
        ON ia.premiacao_id = pr.id
      JOIN direcao a 
        ON ia.direcao_id = a.id
      WHERE a.diretor_id = $1
      ORDER BY pr.ano DESC;
    `;
    const { rows } = await pool.query(query, [diretorId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar premiações pelo ID do diretor (${diretorId}):`, error.stack);
    throw error;
  }
};

export const findDirectionByPersonId = async (pessoaId) => {
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
      JOIN direcao dir 
        ON m.id = dir.midia_id
      JOIN diretor d
        ON dir.id = d.id
      LEFT JOIN episodio e 
        ON m.id = e.midia_id
      LEFT JOIN temporada t 
        ON e.temporada_id = t.id
      LEFT JOIN serie s 
        ON t.serie_id = s.id
      WHERE d.pessoa_id = $1 -- FILTRO PELO ID DA PESSOA
      ORDER BY m.data_de_publicacao DESC;
    `;
    
    const { rows } = await pool.query(query, [pessoaId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar direções pelo ID da pessoa (${pessoaId}):`, error.stack);
    throw error;
  }
};

export const findDirectionAwardsByPersonId = async (pessoaId) => {
  try {
    const query = `
      SELECT 
        pr.id AS premio_id,
        pr.nome,
        pr.ano,
        pr.categoria,
        pr.organizacao,
        pr.descricao
      FROM premiacao pr
      JOIN indicado_direcao idir 
        ON idir.premiacao_id = pr.id
      JOIN diretor d
        ON idir.id = d.id
      WHERE d.pessoa_id = $1; -- FILTRO PELO ID DA PESSOA
    `;
    const { rows } = await pool.query(query, [pessoaId]);
    return rows;
  } catch (error) {
    console.error(`Erro ao buscar prêmios de direção pelo ID da pessoa (${pessoaId}):`, error.stack);
    throw error;
  }
};
