import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017' ;


let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri);
  const db = client.db(process.env.MONGODB_DB || 'Airbnb_Redone');
  cachedDb = db;

  return db;
}

export { connectToDatabase };
