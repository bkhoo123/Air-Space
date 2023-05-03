import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await connectToDatabase()
    const bookings = db.collection("Bookings")

    const allBookingsCursor = bookings.find();
    const allBookings = await allBookingsCursor.toArray();

    return res.json(allBookings)
}

export default handler