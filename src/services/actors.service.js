import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

const getDb = () => client.db();

export const findPersonByActorId = async (atorId) => {
  try {
    const db = getDb();
    
    const person = await db.collection('pessoas').findOne(
      { _id: new ObjectId(atorId) },
      { 
        projection: {
          id: '$_id',
          nome: 1,
          data_de_nascimento: 1,
          altura: 1,
          local_de_nascimento: 1
        }
      }
    );

    return person || null;
  } catch (error) {
    console.error(`Erro ao buscar dados de pessoa pelo ID (${atorId}):`, error);
    throw error;
  }
};

export const findAllActorsGrouped = async () => {
    try {
        const db = getDb();

        const actors = await db.collection('pessoas')
            .find({ funcoes: 'Ator' }) 
            .project({ id: '$_id', nome: 1, local_de_nascimento: 1 })
            .sort({ nome: 1 })
            .toArray();

        const groupedActors = {};

        actors.forEach(actor => {
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
        console.error('Erro ao buscar e agrupar todos os atores:', error);
        throw error;
    }
};

export const findMediaByActorId = async (atorId) => {
  return findActingsByPersonId(atorId);
};

export const findActingsByPersonId = async (pessoaId) => {
  try {
    const db = getDb();
    const pId = new ObjectId(pessoaId);

    const pipeline = [
      { 
        $match: { "elenco.pessoa_id": pId } 
      },
      
      {
        $lookup: {
          from: 'series',
          localField: 'info_serie.serie_id',
          foreignField: '_id',
          as: 'serie_info'
        }
      },

      { $unwind: "$elenco" },

      { 
        $match: { "elenco.pessoa_id": pId } 
      },

      { $sort: { data_de_publicacao: -1 } },

      {
        $project: {
          _id: 0,
          midia_id: '$_id',
          titulo: 1,
          tipo: 1, 
          data_de_publicacao: 1,
          personagem: '$elenco.personagem',
          serie_id: { $arrayElemAt: ['$serie_info._id', 0] }, 
          serie_nome: { $arrayElemAt: ['$serie_info.nome', 0] }
        }
      }
    ];

    const rows = await db.collection('midias').aggregate(pipeline).toArray();
    return rows;

  } catch (error) {
    console.error(`Erro ao buscar atuações pelo ID da pessoa (${pessoaId}):`, error);
    throw error;
  }
};

export const findActingAwardsByPersonId = async (pessoaId) => {
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
        $lookup: {
          from: 'midias',
          localField: 'indicados.midia_id',
          foreignField: '_id',
          as: 'midia_detalhes'
        }
      },
      
      {
         $project: {
           premio_id: '$_id',
           nome: 1,
           ano: 1,
           categoria: 1,
           organizacao: 1,
           descricao: 1,
           midia_elenco: { $arrayElemAt: ['$midia_detalhes.elenco', 0] } 
         }
      },
      
      {
        $project: {
          premio_id: 1, nome: 1, ano: 1, categoria: 1, organizacao: 1, descricao: 1,
          personagem_info: {
            $filter: {
              input: "$midia_elenco",
              as: "ator",
              cond: { $eq: ["$$ator.pessoa_id", pId] }
            }
          }
        }
      },
      
      {
        $project: {
          premio_id: 1, nome: 1, ano: 1, categoria: 1, organizacao: 1, descricao: 1,
          personagem: { $arrayElemAt: ['$personagem_info.personagem', 0] }
        }
      }
    ];

    const rows = await db.collection('premiacoes').aggregate(pipeline).toArray();
    return rows;

  } catch (error) {
    console.error(`Erro ao buscar prêmios de atuação pelo ID da pessoa (${pessoaId}):`, error);
    throw error;
  }
};