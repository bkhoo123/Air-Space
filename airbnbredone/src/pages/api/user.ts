import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  const db = await connectToDatabase();
  const { id } = req.query;

  try {
    const user = await db.collection('Users').findOne({ _id: new ObjectId(id as string) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default handler;
