import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

const getDb = () => client.db();

export const findAllProducers = async () => {
  try {
    const db = getDb();
    const producers = await db.collection('pessoas')
      .find({ funcoes: 'Produtor' })
      .project({ id: '$_id', nome: 1, _id: 0 })
      .sort({ nome: 1 })
      .toArray();

    return producers;
  } catch (error) {
    console.error('Erro ao buscar todas as pessoas produtoras:', error);
    throw error;
  }
};

export const findPersonByProducerId = async (pessoaProdutoraId) => {
  try {
    const db = getDb();
    const person = await db.collection('pessoas').findOne(
      { _id: new ObjectId(pessoaProdutoraId) },
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
    console.error(`Erro ao buscar dados de pessoa pelo ID (${pessoaProdutoraId}):`, error);
    throw error;
  }
};

export const findAllProducersGrouped = async () => {
  try {
    const db = getDb();

    const producers = await db.collection('pessoas')
      .find({ funcoes: 'Produtor' })
      .project({ id: '$_id', nome: 1, local_de_nascimento: 1 })
      .sort({ nome: 1 })
      .toArray();

    const groupedProducers = {};

    producers.forEach(producer => {
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
        if (!groupedProducers['#']) {
          groupedProducers['#'] = [];
        }
        groupedProducers['#'].push(producer);
      }
    });

    return groupedProducers;
  } catch (error) {
    console.error('Erro ao buscar e agrupar todas as pessoaprodutoras:', error);
    throw error;
  }
};

const getProductionsByPersonId = async (id) => {
  const db = getDb();
  const pId = new ObjectId(id);

  const pipeline = [
    {
      $match: { "produtores.pessoa_id": pId }
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
        data_de_publicacao: 1,

        serie_id: { $arrayElemAt: ['$serie_info._id', 0] },
        serie_nome: { $arrayElemAt: ['$serie_info.nome', 0] },

        _id: 0
      }
    }
  ];

  return await db.collection('midias').aggregate(pipeline).toArray();
};

export const findMediaByProducerId = async (pessoaProdutoraId) => {
  try {
    return await getProductionsByPersonId(pessoaProdutoraId);
  } catch (error) {
    console.error(`Erro ao buscar filmografia pelo ID do produtor (${pessoaProdutoraId}):`, error);
    throw error;
  }
};

export const findProductionsByPersonId = async (pessoaId) => {
  try {
    return await getProductionsByPersonId(pessoaId);
  } catch (error) {
    console.error(`Erro ao buscar produções pelo ID da pessoa (${pessoaId}):`, error);
    throw error;
  }
};
