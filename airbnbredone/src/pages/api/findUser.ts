import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'bson';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  // Other fields as needed
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id } = req.body;

  if (!_id) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {
    const db = await connectToDatabase();
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(_id) });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
}
