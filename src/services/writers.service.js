import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

const getDb = () => client.db();

export const findAllWriters = async () => {
  try {
    const db = getDb();
    const writers = await db.collection('pessoas')
      .find({ funcoes: 'Roteirista' })
      .project({ id: '$_id', nome: 1, _id: 0 })
      .sort({ nome: 1 })
      .toArray();

    return writers;
  } catch (error) {
    console.error('Erro ao buscar todos os roteiristas:', error);
    throw error;
  }
};

export const findPersonByWriterId = async (roteiristaId) => {
  try {
    const db = getDb();
    const person = await db.collection('pessoas').findOne(
      { _id: new ObjectId(roteiristaId) },
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
    console.error(`Erro ao buscar dados de pessoa pelo ID do roteirista (${roteiristaId}):`, error);
    throw error;
  }
};

export const findAllWritersGrouped = async () => {
  try {
    const db = getDb();

    const writers = await db.collection('pessoas')
      .find({ funcoes: 'Roteirista' })
      .project({ id: '$_id', nome: 1, local_de_nascimento: 1 })
      .sort({ nome: 1 })
      .toArray();

    const groupedWriters = {};

    writers.forEach(writer => {
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
        if (!groupedWriters['#']) {
          groupedWriters['#'] = [];
        }
        groupedWriters['#'].push(writer);
      }
    });

    return groupedWriters;
  } catch (error) {
    console.error('Erro ao buscar e agrupar todos os roteiristas:', error);
    throw error;
  }
};

const getPlaysByPersonId = async (id) => {
  const db = getDb();
  const pId = new ObjectId(id);

  const pipeline = [
    {
      $match: { "roteiristas.pessoa_id": pId }
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
};

export const findMediaByWriterId = async (roteiristaId) => {
  try {
    return await getPlaysByPersonId(roteiristaId);
  } catch (error) {
    console.error(`Erro ao buscar filmografia pelo ID do roteirista (${roteiristaId}):`, error);
    throw error;
  }
};

export const findPlaysByPersonId = async (pessoaId) => {
  try {
    return await getPlaysByPersonId(pessoaId);
  } catch (error) {
    console.error(`Erro ao buscar roteiros pelo ID da pessoa (${pessoaId}):`, error);
    throw error;
  }
};

export const findPlayAwardsByPersonId = async (pessoaId) => {
  try {
    const db = getDb();
    const pId = new ObjectId(pessoaId);

    const pipeline = [
      {
        $match: { "indicados.pessoa_id": pId }
      },

      { $unwind: "$indicados" },

      { $match: { "indicados.pessoa_id": pId } },

      {
        $project: {
          premio_id: '$_id',
          nome: 1,
          ano: 1,
          categoria: 1,
          organizacao: 1,
          descricao: 1,
          _id: 0
        }
      },
      { $sort: { ano: -1 } }
    ];

    return await db.collection('premiacoes').aggregate(pipeline).toArray();

  } catch (error) {
    console.error(`Erro ao buscar prêmios de roteiro pelo ID da pessoa (${pessoaId}):`, error);
    throw error;
  }
};
