// pages/api/spots/addReview.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

interface AddReviewRequestBody {
  rating: number;
  comment: string;
  userId: string;
  name: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { spotId } = req.body;
    const { comment, userId, name } = req.body as AddReviewRequestBody;
    const rating = parseFloat(req.body.rating)

    try {
      const db = await connectToDatabase();
      const spotsCollection = db.collection("spots");

      const result = await spotsCollection.updateOne(
        { _id: new ObjectId(spotId as string) },
        {
          $push: {
            reviews: {
              rating,
              comment,
              name,
              userId
            },
          },
        }
      );

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ success: false, message: "Error adding review" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};

export default handler;
