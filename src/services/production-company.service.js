import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

const getDb = () => client.db();

export const findProductionCompanyById = async (id) => {
  try {
    const db = getDb();

    const company = await db.collection('produtoras').findOne(
      { _id: new ObjectId(id) },
      {
        projection: {
          id: '$_id',
          nome: 1,
          cnpj: 1,
          data_de_fundacao: 1,
          sede: 1,
          descricao: 1,
          _id: 0
        }
      }
    );

    return company || null;
  } catch (error) {
    console.error(`Erro ao buscar produtora por ID (${id}):`, error);
    throw error;
  }
};

export const findMediaByProductionCompanyId = async (id) => {
  try {
    const db = getDb();
    const companyId = new ObjectId(id);

    const pipeline = [
      {
        $match: { "produtoras_distribuicao.produtora_id": companyId }
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

    const rows = await db.collection('midias').aggregate(pipeline).toArray();
    return rows;

  } catch (error) {
    console.error(`Erro ao buscar mídia por id da produtora (${id}):`, error);
    throw error;
  }
};
