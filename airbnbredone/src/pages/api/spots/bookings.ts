import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();
  const bookings = db.collection("Bookings");

  // Check for GET method
  if (req.method === "GET") {
    const { spotId } = req.query;

    try {
      const allBookings = await bookings
        .find({ spotId: spotId })
        .toArray();

      if (allBookings.length === 0) {
        res.status(404).json({ message: "All Bookings not found" });
        return;
      }

      return res.json(allBookings);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      res.status(500).json({ message: "Error finding all spots" });
    }
  } 

  
  // Check for POST method
  else if (req.method === "POST") {
    const { userId, spotId, startDate, endDate, guests} = req.body;

    try {
      // Create a new booking
      const newBooking = {
        userId,
        spotId,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        guests
      };

      const result = await bookings.insertOne(newBooking);

      if (result.insertedId) {
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
      } else {
        res.status(500).json({ message: "Error creating booking" });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Error creating booking", error: error.message });
    }
  } else if (req.method === "DELETE") {
    const bookingId = Array.isArray(req.query.bookingId) ? req.query.bookingId[0] : req.query.bookingId;
    
  
    try {
      const result = await bookings.deleteOne({ _id: new ObjectId(bookingId) });
  
      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Booking deleted successfully" });
      } else {
        res.status(404).json({ message: "Booking not found" });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ message: "Error deleting booking"});
    }
  }
  else {
    res.status(400).json({ message: "Invalid request method. Use GET to fetch bookings or POST to create a booking." });
  }
};

export default handler;
