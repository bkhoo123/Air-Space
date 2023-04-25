import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async (req: any, res: any) => {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    const databaseId = '809c7fde4c734369b1d1d66fe858f750';

    const newItem = {
      'Name': {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      'Email': {
        email: email,
      },
      'Message': {
        rich_text: [
          {
            text: {
              content: message,
            },
          },
        ],
      },
    };

    try {
      const response = await notion.pages.create({
        parent: {
          database_id: databaseId,
        },
        properties: newItem,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
