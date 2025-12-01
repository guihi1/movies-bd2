import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

export const findPersonById = async (pessoaId) => {
  try {
    const db = client.db();

    const person = await db.collection('pessoas').findOne(
      { _id: new ObjectId(pessoaId) },
      {
        projection: {
          nome: 1,
          data_de_nascimento: 1,
          altura: 1,
          local_de_nascimento: 1
        }
      }
    );

    if (person) {
      person.id = person._id;
    }

    return person || null;

  } catch (error) {
    console.error(`Erro ao buscar dados de pessoa pelo ID (${pessoaId}):`, error);
    throw error;
  }
};
