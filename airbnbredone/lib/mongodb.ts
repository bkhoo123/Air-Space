import { MongoClient, Db } from 'mongodb';

const uri = "mongodb+srv://khoobrian123:gjOn81ysO88PXdYR@airbnbredone.ggbyhb2.mongodb.net/test" ;


let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri);
  const db = client.db('AirbnbRedone');
  cachedDb = db;

  return db;
}

export { connectToDatabase };
