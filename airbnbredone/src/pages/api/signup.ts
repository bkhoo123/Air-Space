import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { name, username, email, password } = req.body;

  // Add input validation here, if needed.

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, username, email, password: hashedPassword };

    const db = await connectToDatabase();
    const result = await db.collection('Users').insertOne(user);

    res.status(201).json({ message: 'User created', userId: result.insertedId });
  } catch (error) {
    console.error('Error creating user', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export default handler;
