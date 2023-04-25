// /pages/api/spots/[spotId].js or /pages/api/spots/[spotId].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb"
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { spotId },
    method,
  } = req;

  if (typeof spotId !== "string") {
    res.status(400).json({ success: false, message: "Invalid spotId." });
    return;
  }

  const db = await connectToDatabase();
  const spots = await db.collection("spots");

  switch (method) {
    case "GET":
      try {
        const spot = await spots.findOne({ _id: new ObjectId(spotId) });

        if (!spot) {
          return res.status(404).json({ success: false, message: "Spot not found." });
        }

        res.status(200).json({ spot });
      } catch (error) {
        res.status(400).json({ success: false, message: "Something went wrong." });
      }
      break;

    case "PUT":
      try {
        const { title, location, description, spotImages, price, distance } = req.body;

        const updatedSpot = {
          title,
          location,
          description,
          price: parseFloat(price),
          distance: parseFloat(distance),
        };

        const updateResult = await spots.updateOne(
          { _id: new ObjectId(spotId) },
          { $set: updatedSpot }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ success: false, message: "Spot not found." });
        }

        res.status(200).json({ success: true, message: "Spot updated successfully." });
      } catch (error) {
        res.status(400).json({ success: false, message: "Something went wrong." });
      }
      break;

    case "DELETE":
      try {
        const deleteResult = await spots.deleteOne({ _id: new ObjectId(spotId) });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ success: false, message: "Spot not found." });
        }

        res.status(200).json({ success: true, message: "Spot deleted successfully." });
      } catch (error) {
        res.status(400).json({ success: false, message: "Something went wrong." });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;

