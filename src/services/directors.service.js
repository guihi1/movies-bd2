import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

const getDb = () => client.db();

export const findAllDirectors = async () => {
  try {
    const db = getDb();
    const directors = await db.collection('pessoas')
      .find({ funcoes: 'Diretor' })
      .project({ id: '$_id', nome: 1, _id: 0 }) // Mantendo estrutura { id, nome }
      .sort({ nome: 1 })
      .toArray();

    return directors;
  } catch (error) {
    console.error('Erro ao buscar todos os diretores:', error);
    throw error;
  }
};

export const findPersonByDirectorId = async (diretorId) => {
  try {
    const db = getDb();
    const person = await db.collection('pessoas').findOne(
      { _id: new ObjectId(diretorId) },
      {
        projection: {
          id: '$_id',
          nome: 1,
          data_de_nascimento: 1,
          altura: 1,
          local_de_nascimento: 1,
          _id: 0
        }
      }
    );
    return person || null;
  } catch (error) {
    console.error(`Erro ao buscar dados de pessoa pelo ID (${diretorId}):`, error);
    throw error;
  }
};

export const findAllDirectorsGrouped = async () => {
  try {
    const db = getDb();

    const directors = await db.collection('pessoas')
      .find({ funcoes: 'Diretor' })
      .project({ id: '$_id', nome: 1, local_de_nascimento: 1 })
      .sort({ nome: 1 })
      .toArray();

    const groupedDirectors = {};

    directors.forEach(director => {
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
        if (!groupedDirectors['#']) {
          groupedDirectors['#'] = [];
        }
        groupedDirectors['#'].push(director);
      }
    });

    return groupedDirectors;
  } catch (error) {
    console.error('Erro ao buscar e agrupar todos os diretores:', error);
    throw error;
  }
};

const getMediaByPersonId = async (id) => {
  const db = getDb();
  const pId = new ObjectId(id);

  const pipeline = [
    {
      $match: { "diretores.pessoa_id": pId }
    },

    {
      $lookup: {
        from: 'series',
        localField: 'info_serie.serie_id',
        foreignField: '_id',
        as: 'serie_info'
      }
    },

    { $sort: { data_de_publicacao: -1 } },

    {
      $project: {
        midia_id: '$_id',
        titulo: 1,
        tipo: 1,

        serie_id: { $arrayElemAt: ['$serie_info._id', 0] },
        serie_nome: { $arrayElemAt: ['$serie_info.nome', 0] },

        _id: 0
      }
    }
  ];

  return await db.collection('midias').aggregate(pipeline).toArray();
}

export const findMediaByDirectorId = async (diretorId) => {
  try {
    return await getMediaByPersonId(diretorId);
  } catch (error) {
    console.error(`Erro ao buscar filmografia pelo ID do diretor (${diretorId}):`, error);
    throw error;
  }
};

export const findDirectionByPersonId = async (pessoaId) => {
  try {
    return await getMediaByPersonId(pessoaId);
  } catch (error) {
    console.error(`Erro ao buscar direções pelo ID da pessoa (${pessoaId}):`, error);
    throw error;
  }
};

const getAwardsByPersonId = async (id) => {
  const db = getDb();
  const pId = new ObjectId(id);

  const pipeline = [
    {
      $match: { "indicados.pessoa_id": pId }
    },

    { $unwind: "$indicados" },

    { $match: { "indicados.pessoa_id": pId } },

    {
      $project: {
        premio_id: '$_id',
        nome_premio: '$nome',
        nome: 1,
        ano: 1,
        categoria: 1,
        organizacao: 1,
        descricao: 1,
        indicado_id: '$indicados.midia_id',
        _id: 0
      }
    },
    { $sort: { ano: -1 } }
  ];

  return await db.collection('premiacoes').aggregate(pipeline).toArray();
}

export const findAwardsByDirectorId = async (diretorId) => {
  try {
    return await getAwardsByPersonId(diretorId);
  } catch (error) {
    console.error(`Erro ao buscar premiações pelo ID do diretor (${diretorId}):`, error);
    throw error;
  }
};

export const findDirectionAwardsByPersonId = async (pessoaId) => {
  try {
    return await getAwardsByPersonId(pessoaId);
  } catch (error) {
    console.error(`Erro ao buscar prêmios de direção pelo ID da pessoa (${pessoaId}):`, error);
    throw error;
  }
};
