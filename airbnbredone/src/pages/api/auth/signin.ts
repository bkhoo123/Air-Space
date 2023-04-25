import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodb';
import bcrypt from 'bcrypt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { credential, password } = req.body;

  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({
      $or: [{ email: credential }, { username: credential }],
    });
    

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.status(200).json({
        message: 'Authentication successful',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
        },
      });
  } catch (error) {
    console.error('Error signing in user', error);
    res.status(500).json({ message: 'Error signing in user' });
  }
};

export default handler;
