import { client } from '../config/db.js';
import { ObjectId } from 'mongodb';

export const createUserAndReview = async (nome_usuario, comentario, nota, midia_id) => {
  const session = client.startSession();

  try {
    session.startTransaction();

    const db = client.db();

    const userResult = await db.collection('usuarios').insertOne(
      {
        nome_usuario: nome_usuario,
        email: `random_${Math.random()}@email.com`,
        senha: 'senhasecreta'
      },
      { session }
    );

    const newUserId = userResult.insertedId;

    await db.collection('avaliacoes').insertOne(
      {
        comentario: comentario,
        nota: nota,
        user_id: newUserId,
        midia_id: new ObjectId(midia_id),
        data: new Date()
      },
      { session }
    );

    await session.commitTransaction();
    console.log('Transação concluída com sucesso.');

    return { novoUsuarioId: newUserId };

  } catch (error) {
    console.error('Erro na transação, abortando:', error);
    await session.abortTransaction();
    throw new Error('Não foi possível criar o usuário e a avaliação.');

  } finally {
    await session.endSession();
  }
};
