import React, {useState, useEffect} from 'react'
import { useUser } from '<prefix>/context/UserContext'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Bookings() {
    const router = useRouter()
    const {currentUser, setCurrentUser} = useUser()
    const [bookings, setBookings] = useState([])
    const [spots, setSpots] = useState([])
    const [toggle, setToggle] = useState(false)


    useEffect(() => {

        const userData = localStorage.getItem('currentUser');
        if (userData) {
        setCurrentUser(JSON.parse(userData));
        }
        axios.get(`/api/spots`).then((response) => {
            setSpots(response.data)
        })
        axios.get(`/api/spots/allbookings`).then((response) => {
            setBookings(response.data)
        })
    }, [])

    let filter = spots.filter((spot) => {
        return spot.userId === currentUser?.id 
    })

    


    const handleBookings = async (e:any) => {
        e.preventDefault()

    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-2 justify-items-center gap-7">
            {filter.map(spot => (
            <div className="flex flex-col gap-5 ">
              <div className="text-lg font-bold">{spot.title}</div>
              <img onClick={() => router.push(`/spots/${spot._id}`)}  className="h-72 w-96 rounded-md hover:scale-105 hover:cursor-pointer transition duration-300 ease-in" src={spot.spotImages[0]} alt="No Image" />
              <span>{spot.location}</span>
              <div className="flex gap-5">
                <button onClick={() => alert("Add your bookings on the spot details page")} className="border-2 border-violet-400 p-2 rounded-md hover:bg-purple-100 cursor-pointer">Bookings</button>
              </div>
              <div className="absolute h-auto w-4/6 top-30 left-30 z-50 bg-teal-100">

            </div>
            </div>
          ))}

            

            </div>

            
        </div>
    )
}
