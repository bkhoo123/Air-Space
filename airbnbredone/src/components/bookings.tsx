import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/router';

export default function Bookings({spot, avg, values, userId}) {
    const router = useRouter()
    const [bookings, setBookings] = useState([])
    const [date1, setDate1] = useState(new Date())
    const date1WeekLater = new Date(date1);
    date1WeekLater.setDate(date1.getDate() + 7);
    const [selectedDates, setSelectedDates] = useState([])
    const [guests, setGuests] = useState(1)
    
    const {spotId} = router.query

    useEffect(() => {
      
      const fetchData = async () => {
        const response = await axios.get(`/api/spots/bookings`, {
          params: {
            spotId: spotId,
          },
        });
        setBookings(response.data);
      };
      if (spotId) {
        fetchData();
      }
    }, [spotId]);
    
    // <button className={userId == booking.userId ? "bg-rose-400 p-2 text-white font-semibold rounded-md " : `hidden`}>Edit</button>

    const handleDateSelection = (date: any) => {
      if (selectedDates.length === 2) {
        setSelectedDates([date]);
      } else if (selectedDates.length === 0) {
        setSelectedDates([date]);
      } else {
        const newDates = [...selectedDates];
        newDates[1] = date;
        setSelectedDates(newDates.sort((a, b) => a - b));
      }
    };
    console.log(selectedDates)
    console.log(bookings)

    const handleReserve = async (e: any) => {
      e.preventDefault();
      const payload = {
        startDate: selectedDates[0],
        endDate: selectedDates[1],
        spotId: spotId,
        userId: userId,
        guests: guests,
      };
      

      try {
        const response = await axios.post(`/api/spots/bookings`, payload);
         router.reload();
      } catch (error) {
        console.error("Error in reserve request:", error);
      }
    };

    const handleDelete = async (bookingId: any) => {
      try {
        const response = await axios.delete('/api/spots/bookings', {
          params: { bookingId },
        });
        await router.reload()
        // Handle successful response
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    };
    
    
    
  const checkInDate = selectedDates.length > 0 ? selectedDates[0].toLocaleDateString() : 'Not selected';
  const checkOutDate = selectedDates.length > 1 ? selectedDates[1].toLocaleDateString() : 'Not selected';


    return (
        <div className="col-span-5 border border-stone-300 rounded-md h-auto p-5 shadow-lg shadow-slate-200" >
              <span className="flex flex-row justify-between items-center">
                <span>
                  <span className="text-xl font-bold">${spot?.price}</span>
                  <span>  night</span>
                </span>
                <span className="text-sm">
                <span>⭐ {avg || "No reviews yet"} • {values.length} Reviews • {spot?.location}</span>
                </span>
              </span>

                <div className="mt-5 border border-stone-400 grid grid-cols-2 m-4 rounded-md">

                  <div className="border-r border-gray-300 p-3">
                    <div className="text-xs font-bold">CHECK-IN</div>
                    <div className="text-sm">{checkInDate}</div>
                  </div>

                  <div className="p-3">
                    <div className="text-xs font-bold">CHECKOUT</div>    
                    <div className="text-sm">{checkOutDate}</div>
                  </div>
                  <input 
                  className="border-t col-span-2 border-gray-300 text-sm p-3 border-bt"
                  placeholder="Put the number of guests here"
                  value={guests}
                  type="integer"
                  onChange={(e: any) => setGuests(e.target.value)}
                  />
                </div>

                <div className="text-center col-span-5 p-3">
                  <button onClick={handleReserve} className="border w-full rounded-md p-2 bg-rose-400 text-white font-bold hover:bg-stone-400">Reserve</button>
                  <div className="mt-2">You wont be charged yet</div>
                </div>

                <div className="flex justify-between px-4">
                    <div>
                      <div className="underline">${spot?.price}</div>
                      <div className="underline">Cleaning Fee</div>
                      <div className="underline">AirBK Service Fee</div>
                    </div>

                    <div>
                        <div>$2020</div>
                        <div>$180</div>
                        <div>$311</div>
                    </div>
                </div>
                <div className="mt-5 mx-12">
                <Calendar value={selectedDates} onClickDay={(date) => handleDateSelection(date)} className="rounded-md" />
                </div>

                <div className="text-center mt-5">
                  <div className="font-bold text-lg underline">
                  Current Bookings
                  </div>
                <div className ="text-center mt-5 flex flex-col gap-3">
                  {bookings.map((booking, index) =>(
                    <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between">Start Date: {booking.startDate}  </div>
                    <div className="flex justify-between">End Date: {booking.endDate} <button onClick={() => handleDelete(booking._id)} className={userId == booking.userId ? "bg-rose-400 p-2 text-white font-semibold rounded-md" : `hidden`}>Delete</button></div>
                    </div>
                  ))}
                </div>
                </div>
            </div>
  )
}
