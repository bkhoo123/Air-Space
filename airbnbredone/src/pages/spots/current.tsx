import React, {useState, useEffect} from 'react'
import { useUser } from '<prefix>/context/UserContext'
import axios from 'axios'
import { useRouter } from 'next/router'

interface Spot {
  _id: string;
  title: string;
  location: string;
  description: string;
  spotImages: string[];
  rating: number;
  reviews: object[];
  price: number;
  distance: number;
  userId: string;
}




export default function Current() {
    const router = useRouter()
    const [spots, setSpots] = useState<Spot[]>([])
    const {currentUser, setCurrentUser} = useUser()

    

    useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    axios.get(`/api/spots`).then((response) => {
      setSpots(response.data)
    })
    }, [])

    let filter = spots.filter((spot) => {
      return spot.userId === currentUser?.id
    })

    const handleDelete = async (e: any, spotId: any) => {
      e.preventDefault()
      axios.delete(`/api/spots/${spotId}`)
      .then(() => router.reload())
    }

   

    return (
      <div className="px-10 pt-5">
        <div className="grid grid-cols-2 justify-items-center gap-7">
          {filter.map(spot => (
            <div className="flex flex-col gap-5 ">
              <div className="text-lg font-bold">{spot.title}</div>
              <img onClick={() => router.push(`/spots/${spot._id}`)} className="h-72 w-96 rounded-md hover:scale-105 hover:cursor-pointer transition duration-300 ease-in" src={spot.spotImages[0]} alt="No Image" />
              <span>{spot.location}</span>
              <div className="flex gap-5">
                {/* <button className="border-2 border-sky-400 p-2 rounded-md hover:bg-blue-100">Edit Hosting</button> */}
                <button onClick={(e) => handleDelete(e, spot._id)} className="border-2 border-rose-400 p-2 rounded-md hover:bg-red-100">Delete Hosting</button>
                {/* <button className="border-2 border-violet-400 p-2 rounded-md hover:bg-purple-100">Bookings</button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}
