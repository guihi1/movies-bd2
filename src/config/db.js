import { MongoClient } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGODB_URL);

async function connect() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB com sucesso.");
    return client.db();
  } catch (err) {
    console.error("Erro ao conectar:", err);
    process.exit(-1);
  }
}

export { client, connect };
