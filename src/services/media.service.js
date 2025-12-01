import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

const getDb = () => client.db();


export const findMovies = async () => {
  try {
    const db = getDb();
    const movies = await db.collection('midias')
      .find({ tipo: { $regex: /^filme$/i } })
      .sort({ data_de_publicacao: 1 })
      .toArray();

    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const findMovieById = async (id) => {
  try {
    const db = getDb();
    const movie = await db.collection('midias').findOne({ _id: new ObjectId(id) });
    return movie || null;
  } catch (error) {
    console.error(`Erro ao buscar filme por ID (${id}):`, error);
    throw error;
  }
};

export const findAllMoviesGrouped = async () => {
  try {
    const db = getDb();
    const rows = await db.collection('midias')
      .find({ tipo: { $regex: /^filme$/i } })
      .sort({ titulo: 1 })
      .toArray();

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
        if (!groupedMovies['#']) {
          groupedMovies['#'] = [];
        }
        groupedMovies['#'].push(movie);
      }
    });

    return groupedMovies;
  } catch (error) {
    console.error('Erro ao buscar e agrupar todos os filmes:', error);
    throw error;
  }
};

export const findEpisodeById = async (episodeId) => {
  try {
    const db = getDb();

    const pipeline = [
      { $match: { _id: new ObjectId(episodeId) } },
      {
        $lookup: {
          from: 'series',
          localField: 'info_serie.serie_id',
          foreignField: '_id',
          as: 'serie_info'
        }
      },
      { $unwind: '$serie_info' },
      {
        $project: {
          episodio_id: '$_id',
          enredo: 1,
          titulo: 1,
          data_de_publicacao: 1,
          pais_de_origem: 1,
          faixa_etaria_indicada: 1,
          tempo_de_duracao: 1,
          faturamento: 1,

          serie_id: '$serie_info._id',
          serie_nome: '$serie_info.nome',
          serie_sinopse: '$serie_info.sinopse',
          ano_de_inicio: '$serie_info.ano_de_inicio',
          ano_de_fim: '$serie_info.ano_de_fim',

          temporada_numero: '$info_serie.temporada',

          dados_temporada: {
            $filter: {
              input: '$serie_info.temporadas',
              as: 'temp',
              cond: { $eq: ['$$temp.numero', '$info_serie.temporada'] }
            }
          }
        }
      },
      {
        $project: {
          episodio_id: 1, enredo: 1, titulo: 1, data_de_publicacao: 1,
          pais_de_origem: 1, faixa_etaria_indicada: 1, tempo_de_duracao: 1, faturamento: 1,
          serie_id: 1, serie_nome: 1, serie_sinopse: 1, ano_de_inicio: 1, ano_de_fim: 1,

          temporada_id: { $arrayElemAt: ['$dados_temporada.numero', 0] },
          ano_temporada: { $arrayElemAt: ['$dados_temporada.ano', 0] },
          numero_de_episodios: { $arrayElemAt: ['$dados_temporada.episodios', 0] }
        }
      }
    ];

    const rows = await db.collection('midias').aggregate(pipeline).toArray();
    return rows[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar episódio por ID (${episodeId}):`, error);
    throw error;
  }
};

export const findShows = async () => {
  try {
    const db = getDb();
    const shows = await db.collection('series').find().sort({ nome: 1 }).toArray();
    return shows;
  } catch (error) {
    console.error("Error fetching shows:", error);
    throw error;
  }
};

export const findAllShowsGrouped = async () => {
  try {
    const db = getDb();
    const rows = await db.collection('series').find().sort({ nome: 1 }).toArray();
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
        if (!groupedShows['#']) {
          groupedShows['#'] = [];
        }
        groupedShows['#'].push(show);
      }
    });

    return groupedShows;
  } catch (error) {
    console.error('Erro ao buscar e agrupar todas as séries:', error);
    throw error;
  }
};

export const findShowById = async (id) => {
  try {
    const db = getDb();
    const show = await db.collection('series').findOne({ _id: new ObjectId(id) });
    return show || null;
  } catch (error) {
    console.error(`Erro ao buscar serie por ID (${id}):`, error);
    throw error;
  }
};

export const findSeasonsAndEpisodesByShowId = async (id) => {
  try {
    const db = getDb();
    const serieId = new ObjectId(id);

    const serie = await db.collection('series').findOne({ _id: serieId });
    if (!serie) return null;

    const episodios = await db.collection('midias')
      .find({ "info_serie.serie_id": serieId })
      .sort({ "info_serie.temporada": 1, data_de_publicacao: 1 })
      .toArray();

    if (episodios.length === 0) return null;

    const temporadasMap = serie.temporadas.map(temp => ({
      id: temp.numero,
      ano: temp.ano,
      numero_de_episodios: temp.episodios,
      serie_id: serie._id,
      serie_nome: serie.nome,
      serie_sinopse: serie.sinopse,
      ano_de_inicio: serie.ano_de_inicio,
      ano_de_fim: serie.ano_de_fim,
      episodios: []
    }));

    episodios.forEach(ep => {
      const tempIndex = temporadasMap.findIndex(t => t.id === ep.info_serie.temporada);
      if (tempIndex !== -1) {
        temporadasMap[tempIndex].episodios.push({
          id: ep._id,
          titulo: ep.titulo,
          data_de_publicacao: ep.data_de_publicacao,
          tempo_de_duracao: ep.tempo_de_duracao
        });
      }
    });

    return temporadasMap;

  } catch (error) {
    console.error(`Erro ao buscar temporadas e episodios:`, error);
    throw error;
  }
};

const getPeopleFromMediaField = async (mediaId, arrayField, roleFieldInArray = null) => {
  const db = getDb();
  const pipeline = [
    { $match: { _id: new ObjectId(mediaId) } },
    { $unwind: `$${arrayField}` },

    {
      $lookup: {
        from: 'pessoas',
        localField: `${arrayField}.pessoa_id`,
        foreignField: '_id',
        as: 'detalhes_pessoa'
      }
    },
    { $unwind: '$detalhes_pessoa' },

    {
      $project: {
        pessoa_id: '$detalhes_pessoa._id',
        nome: '$detalhes_pessoa.nome',
        data_de_nascimento: '$detalhes_pessoa.data_de_nascimento',
        personagem: roleFieldInArray ? `$${arrayField}.${roleFieldInArray}` : null
      }
    },
    { $sort: { nome: 1 } }
  ];

  return await db.collection('midias').aggregate(pipeline).toArray();
};

export const findActorsByMediaId = async (mediaId) => {
  try {
    const rows = await getPeopleFromMediaField(mediaId, 'elenco', 'personagem');
    return rows.map(r => ({
      pessoa_id: r.pessoa_id,
      nome_ator: r.nome,
      data_de_nascimento: r.data_de_nascimento,
      personagem: r.personagem
    }));
  } catch (error) {
    console.error(`Erro ao buscar atores por ID de mídia (${mediaId}):`, error);
    throw error;
  }
};

export const findDirectorsByMediaId = async (mediaId) => {
  try {
    const rows = await getPeopleFromMediaField(mediaId, 'diretores');
    return rows.map(r => ({
      pessoa_id: r.pessoa_id,
      nome_diretor: r.nome,
      data_de_nascimento: r.data_de_nascimento
    }));
  } catch (error) {
    console.error(`Erro ao buscar diretores por ID de mídia (${mediaId}):`, error);
    throw error;
  }
};

export const findWritersByMediaId = async (mediaId) => {
  try {
    const rows = await getPeopleFromMediaField(mediaId, 'roteiristas');
    return rows.map(r => ({
      pessoa_id: r.pessoa_id,
      nome_roteirista: r.nome,
      data_de_nascimento: r.data_de_nascimento
    }));
  } catch (error) {
    console.error(`Erro ao buscar roteiristas por ID de mídia (${mediaId}):`, error);
    throw error;
  }
};

export const findProducersByMediaId = async (mediaId) => {
  try {
    const rows = await getPeopleFromMediaField(mediaId, 'produtores');
    return rows.map(r => ({
      pessoa_id: r.pessoa_id,
      nome_pessoa_produtora: r.nome,
      data_de_nascimento: r.data_de_nascimento
    }));
  } catch (error) {
    console.error(`Erro ao buscar produtores por ID de mídia (${mediaId}):`, error);
    throw error;
  }
};

const getPeopleFromShow = async (showId, arrayField, roleFieldInArray = null) => {
  const db = getDb();
  const pipeline = [
    { $match: { "info_serie.serie_id": new ObjectId(showId) } },

    { $unwind: `$${arrayField}` },

    {
      $lookup: {
        from: 'pessoas',
        localField: `${arrayField}.pessoa_id`,
        foreignField: '_id',
        as: 'detalhes_pessoa'
      }
    },
    { $unwind: '$detalhes_pessoa' },

    {
      $group: {
        _id: '$detalhes_pessoa._id',
        nome: { $first: '$detalhes_pessoa.nome' },
        data_de_nascimento: { $first: '$detalhes_pessoa.data_de_nascimento' },
        personagem: roleFieldInArray ? { $first: `$${arrayField}.${roleFieldInArray}` } : { $first: null }
      }
    },

    { $sort: { nome: 1 } },

    {
      $project: {
        pessoa_id: '$_id',
        nome: 1,
        data_de_nascimento: 1,
        personagem: 1,
        _id: 0
      }
    }
  ];

  return await db.collection('midias').aggregate(pipeline).toArray();
};

export const findActorsByShowId = async (showId) => {
  try {
    const rows = await getPeopleFromShow(showId, 'elenco', 'personagem');
    return rows.map(r => ({ ...r, nome_ator: r.nome }));
  } catch (error) {
    console.error(`Erro ao buscar atores por ID da série (${showId}):`, error);
    throw error;
  }
};

export const findDirectorsByShowId = async (showId) => {
  try {
    const rows = await getPeopleFromShow(showId, 'diretores');
    return rows.map(r => ({ ...r, nome_diretor: r.nome }));
  } catch (error) {
    console.error(`Erro ao buscar diretores por ID da série (${showId}):`, error);
    throw error;
  }
};

export const findWritersByShowId = async (showId) => {
  try {
    const rows = await getPeopleFromShow(showId, 'roteiristas');
    return rows.map(r => ({ ...r, nome_roteirista: r.nome }));
  } catch (error) {
    console.error(`Erro ao buscar roteiristas por ID da série (${showId}):`, error);
    throw error;
  }
};

export const findProducersByShowId = async (showId) => {
  try {
    const rows = await getPeopleFromShow(showId, 'produtores');
    return rows.map(r => ({ ...r, nome_pessoa_produtora: r.nome }));
  } catch (error) {
    console.error(`Erro ao buscar produtores por ID da série (${showId}):`, error);
    throw error;
  }
};

export const findReviewsByMediaId = async (mediaId) => {
  try {
    const db = getDb();
    const pipeline = [
      { $match: { midia_id: new ObjectId(mediaId) } },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'user_id',
          foreignField: '_id',
          as: 'usuario_info'
        }
      },
      { $unwind: '$usuario_info' },
      {
        $project: {
          nota: 1,
          comentario: 1,
          nome_usuario: '$usuario_info.nome_usuario',
          _id: 0
        }
      }
    ];

    return await db.collection('avaliacoes').aggregate(pipeline).toArray();
  } catch (error) {
    console.error(`Erro ao buscar avaliações por ID de mídia (${mediaId}):`, error);
    throw error;
  }
};

export const findGenreByMediaId = async (mediaId) => {
  try {
    const db = getDb();
    const media = await db.collection('midias').findOne(
      { _id: new ObjectId(mediaId) },
      { projection: { generos: 1 } }
    );

    if (!media || !media.generos) return [];

    return media.generos.map(g => ({ genero: g }));

  } catch (error) {
    console.error(`Erro ao buscar generos por ID de mídia (${mediaId}):`, error);
    throw error;
  }
};

export const findGenreByShowId = async (serieId) => {
  try {
    const db = getDb();
    
    // 1. Buscamos na coleção 'series', não 'midias'
    const show = await db.collection('series').findOne(
      { _id: new ObjectId(serieId) },
      // 2. O campo agora se chama 'genero' (conforme sua última solicitação)
      { projection: { _id: 0, generos: 1 } } 
    );

    // Verifica se a série existe e se tem o array de gêneros
    if (!show || !show.generos) return [];

    // Retorna formatado como você queria
    return show.generos.map(g => ({ genero: g }));

  } catch (error) {
    console.error(`Erro ao buscar gêneros da série (${serieId}):`, error);
    throw error;
  }
};
