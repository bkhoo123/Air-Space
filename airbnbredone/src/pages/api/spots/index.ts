import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();
  const spots = await db.collection('spots');

  if (req.method === 'POST') {
    try {
      // Extract spot data from request body
      const spotData = req.body;

      // Insert the new spot into the collection
      const result = await spots.insertOne(spotData);

      // Return the created spot
      const createdSpot = await spots.findOne({ _id: new ObjectId(result.insertedId) });

      res.status(201).json({ message: 'Spot created', spot: createdSpot });

    } catch (error) {
      console.error('Error creating spot:', error);
      res.status(500).json({ message: 'Error creating spot' });
    }

  } else if (req.method === 'GET') {
    try {
      const allDocuments = await spots.find().toArray();

      if (!spots) {
        res.status(404).json({ message: 'All spots not found' });
        return;
      }

      return res.json(allDocuments);

    } catch (error) {
      console.error('Error fetching all spots:', error);
      res.status(500).json({ message: 'Error finding all spots' });
    }

  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
