import pool from "../config/db.js";

export const findMovies = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM midia WHERE tipo = 'Filme' ORDER BY data_de_publicacao`
    );
    return rows;
  } catch (error) {
    console.error("Error fetching movies:", error.stack);
    throw error;
  }
};

export const findMovieById = async (id) => {
  try {
    // const { rows } = await pool.query(`SELECT * FROM midia WHERE id = $1 AND tipo = 'Filme'`, [id]);
    const { rows } = await pool.query(`SELECT * FROM midia WHERE id = $1`, [
      id,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar filme por ID (${id}):`, error.stack);
    throw error;
  }
};

export const findAllMoviesGrouped = async () => {
    try {
        const query = `SELECT * FROM midia WHERE tipo = 'Filme' ORDER BY titulo ASC;`;
        
        const { rows } = await pool.query(query);

        const groupedMovies = {};

        rows.forEach(movie => {
            const firstLetter = movie.titulo
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .charAt(0)
                .toUpperCase();
            if (firstLetter >= 'A' && firstLetter <= 'Z') {
                if (!groupedMovies[firstLetter]) {
                    groupedMovies[firstLetter] = [];
                }
                
                groupedMovies[firstLetter].push(movie);
            }
            else {
              if(!groupedMovies['#']){
                groupedMovies['#'] = [];
              }
              groupedMovies['#'].push(movie);
            }
        });

        return groupedMovies;
    } catch (error) {
        console.error('Erro ao buscar e agrupar todos os filmes:', error.stack);
        throw error;
    }
};

export const findEpisodeById = async (episodeId) => {
  try {
    const query = `
      SELECT
        m.id AS episodio_id,
        m.enredo,
        m.titulo,
        m.data_de_publicacao,
        m.pais_de_origem,
        m.faixa_etaria_indicada,
        m.tempo_de_duracao,
        m.faturamento,

        t.id AS temporada_id,
        t.ano AS ano_temporada,
        t.numero_de_episodios,

        s.id AS serie_id,
        s.nome AS serie_nome,
        s.sinopse AS serie_sinopse,
        s.ano_de_inicio,
        s.ano_de_fim
      FROM midia m
      JOIN episodio e ON m.id = e.midia_id
      JOIN temporada t ON e.temporada_id = t.id
      JOIN serie s ON t.serie_id = s.id
      WHERE m.id = $1;
    `;

    const { rows } = await pool.query(query, [episodeId]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar episódio por ID (${episodeId}):`, error.stack);
    throw error;
  }
};

export const findShows = async () => {
  try {
    const { rows } = await pool.query(`SELECT * FROM serie ORDER BY nome`);
    return rows;
  } catch (error) {
    console.error("Error fetching shows:", error.stack);
    throw error;
  }
};

export const findAllShowsGrouped = async () => {
    try {
        const query = `SELECT * FROM serie ORDER BY nome ASC;`;
        
        const { rows } = await pool.query(query);

        const groupedShows = {};

        rows.forEach(show => {
            const firstLetter = show.nome
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .charAt(0)
                .toUpperCase();
            if (firstLetter >= 'A' && firstLetter <= 'Z') {
                if (!groupedShows[firstLetter]) {
                    groupedShows[firstLetter] = [];
                }
                
                groupedShows[firstLetter].push(show);
            }
            else {
              if(!groupedShows['#']){
                groupedShows['#'] = [];
              }
              groupedShows['#'].push(show);
            }
        });

        return groupedShows;
    } catch (error) {
        console.error('Erro ao buscar e agrupar todas as séries:', error.stack);
        throw error;
    }
};

export const findShowById = async (id) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM serie WHERE id = $1`, [
      id,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar serie por ID (${id}):`, error.stack);
    throw error;
  }
};

export const findSeasonsAndEpisodesByShowId = async (id) => {
  const query = `
    SELECT
        s.id AS serie_id,
        s.nome AS serie_nome,
        s.sinopse AS serie_sinopse,
        s.ano_de_inicio,
        s.ano_de_fim,

        t.id AS temporada_id,
        t.ano AS ano_temporada,
        t.numero_de_episodios,

        m.id AS episodio_id,
        m.titulo AS titulo_episodio,
        m.data_de_publicacao,
        m.tempo_de_duracao
    FROM serie s
    JOIN temporada t ON s.id = t.serie_id
    JOIN episodio e ON t.id = e.temporada_id
    JOIN midia m ON e.midia_id = m.id
    WHERE s.id = $1
    ORDER BY t.ano ASC, m.data_de_publicacao ASC;
  `;

  const { rows } = await pool.query(query, [id]);

  if (rows.length === 0) {
    return null;
  }

  const temporadasMap = new Map();

  rows.forEach((row) => {
    if (!temporadasMap.has(row.temporada_id)) {
      temporadasMap.set(row.temporada_id, {
        id: row.temporada_id,
        ano: row.ano_temporada,
        numero_de_episodios: row.numero_de_episodios,
        serie_id: row.serie_id,
        serie_nome: row.serie_nome,
        serie_sinopse: row.serie_sinopse,
        ano_de_inicio: row.ano_de_inicio,
        ano_de_fim: row.ano_de_fim,
        episodios: [],
      });
    }

    temporadasMap.get(row.temporada_id).episodios.push({
      id: row.episodio_id,
      titulo: row.titulo_episodio,
      data_de_publicacao: row.data_de_publicacao,
      tempo_de_duracao: row.tempo_de_duracao,
    });
  });

  return Array.from(temporadasMap.values());
};

export const findActorsByMediaId = async (mediaId) => {
  try {
    const query = `
      SELECT DISTINCT
          p.id AS pessoa_id,
          p.nome AS nome_ator,
          p.data_de_nascimento,
          atu.personagem
      FROM pessoa p
      JOIN ator ON p.id = ator.pessoa_id
      JOIN atuacao atu ON ator.id = atu.ator_id
      WHERE atu.midia_id = $1
      ORDER BY p.nome;
    `;

    const { rows } = await pool.query(query, [mediaId]);
    return rows;
  } catch (error) {
    console.error(
      `Erro ao buscar atores por ID de mídia (${mediaId}):`,
      error.stack
    );
    throw error;
  }
};

export const findDirectorsByMediaId = async (mediaId) => {
  try {
    const query = `
      SELECT DISTINCT
          p.id AS pessoa_id,
          p.nome AS nome_diretor,
          p.data_de_nascimento
      FROM pessoa p
      JOIN diretor ON p.id = diretor.pessoa_id
      JOIN direcao dir ON diretor.id = dir.diretor_id
      WHERE dir.midia_id = $1
      ORDER BY p.nome;
    `;

    const { rows } = await pool.query(query, [mediaId]);
    return rows;
  } catch (error) {
    console.error(
      `Erro ao buscar diretores por ID de mídia (${mediaId}):`,
      error.stack
    );
    throw error;
  }
};

export const findWritersByMediaId = async (mediaId) => {
  try {
    const query = `
      SELECT DISTINCT
          p.id AS pessoa_id,
          p.nome AS nome_roteirista,
          p.data_de_nascimento
      FROM pessoa p
      JOIN roteirista ON p.id = roteirista.pessoa_id
      JOIN roteiro rot ON roteirista.id = rot.roteirista_id
      WHERE rot.midia_id = $1
      ORDER BY p.nome;
    `;

    const { rows } = await pool.query(query, [mediaId]);
    return rows;
  } catch (error) {
    console.error(
      `Erro ao buscar roteiristas por ID de mídia (${mediaId}):`,
      error.stack
    );
    throw error;
  }
};

export const findProducersByMediaId = async (mediaId) => {
  try {
    const query = `
      SELECT DISTINCT
          p.id AS pessoa_id,
          p.nome AS nome_produtor,
          p.data_de_nascimento
      FROM pessoa p
      JOIN pessoaprodutora ON p.id = pessoaprodutora.pessoa_id
      JOIN produz prod ON pessoaprodutora.id = prod.pessoa_produtora_id
      WHERE prod.midia_id = $1
      ORDER BY p.nome;
    `;

    const { rows } = await pool.query(query, [mediaId]);
    return rows;
  } catch (error) {
    console.error(
      `Erro ao buscar pessoas produtoras por ID de mídia (${mediaId}):`,
      error.stack
    );
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
    console.error(
      `Erro ao buscar atores por ID da série (${showId}):`,
      error.stack
    );
    throw error;
  }
};

export const findDirectorsByShowId = async (showId) => {
  try {
    const query = `
      SELECT DISTINCT
          P.id AS pessoa_id,
          P.nome AS nome_diretor,
          P.data_de_nascimento
      FROM serie S
      JOIN temporada T ON S.id = T.serie_id
      JOIN episodio E ON T.id = E.temporada_id
      JOIN midia M ON E.midia_id = M.id
      JOIN direcao D ON M.id = D.midia_id
      JOIN diretor DRT ON D.diretor_id = DRT.id
      JOIN pessoa P ON DRT.pessoa_id = P.id
      WHERE S.id = $1
      ORDER BY P.nome;
    `;

    const { rows } = await pool.query(query, [showId]);
    return rows;
  } catch (error) {
    console.error(
      `Erro ao buscar diretores por ID da série (${showId}):`,
      error.stack
    );
    throw error;
  }
};

export const findWritersByShowId = async (showId) => {
  try {
    const query = `
      SELECT DISTINCT
          P.id AS pessoa_id,
          P.nome AS nome_roteirista,
          P.data_de_nascimento
      FROM serie S
      JOIN temporada T ON S.id = T.serie_id
      JOIN episodio E ON T.id = E.temporada_id
      JOIN midia M ON E.midia_id = M.id
      JOIN roteiro R ON M.id = R.midia_id
      JOIN roteirista RTR ON R.roteirista_id = RTR.id
      JOIN pessoa P ON RTR.pessoa_id = P.id
      WHERE S.id = $1
      ORDER BY P.nome;
    `;

    const { rows } = await pool.query(query, [showId]);
    return rows;
  } catch (error) {
    console.error(
      `Erro ao buscar roteiristaes por ID da série (${showId}):`,
      error.stack
    );
    throw error;
  }
};

export const findProducersByShowId = async (showId) => {
  try {
    const query = `
      SELECT DISTINCT
          P.id AS pessoa_id,
          P.nome AS nome_pessoa_produtora,
          P.data_de_nascimento
      FROM serie S
      JOIN temporada T ON S.id = T.serie_id
      JOIN episodio E ON T.id = E.temporada_id
      JOIN midia M ON E.midia_id = M.id
      JOIN produz PR ON M.id = PR.midia_id
      JOIN pessoaprodutora PROD ON PR.pessoa_produtora_id = PROD.id
      JOIN pessoa P ON PROD.pessoa_id = P.id
      WHERE S.id = $1
      ORDER BY P.nome;
    `;

    const { rows } = await pool.query(query, [showId]);
    return rows;
  } catch (error) {
    console.error(
      `Erro ao buscar pessoas produtoras por ID da série (${showId}):`,
      error.stack
    );
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
    console.error(
      `Erro ao buscar avaliações por ID de mídia (${mediaId}):`,
      error.stack
    );
    throw error;
  }
};
