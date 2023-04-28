import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();
  const bookings = db.collection("Bookings");

  if (req.method === "PUT") {
    const { startDate, endDate, guests, bookingId } = req.body;

    try {
      const updatedBooking = {
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        guests,
      };

      const updateResult = await bookings.updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: updatedBooking }
      );

      if (updateResult.modifiedCount === 1) {
        res.status(200).json({ message: "Booking updated successfully", booking: updatedBooking });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Error updating booking", error: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid request method. Use PUT to update a booking." });
  }
};

export default handler;
