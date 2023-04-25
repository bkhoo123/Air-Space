import Image from 'next/image'
import { useUser } from '<prefix>/context/UserContext'
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Link from 'next/link'


interface Spot {
  _id: string;
  title: string;
  location: string;
  description: string;
  spotImages: string[];
  rating: number;
  reviews: number;
  price: number;
  distance: number;
  userId: string;
}

export default function Home() {
  const {currentUser, setCurrentUser} = useUser()
  const [allSpots, setAllSpots] = useState<Spot[]>([])
  
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    axios.get(`/api/spots`).then((response) => {
      setAllSpots(response.data)
    })

  }, []);

  console.log(allSpots)


  return (
    <main className="mx-auto">
      <div className="flex flex-row flex-wrap gap-5 mt-6 justify-center content-center items-center">
      {allSpots.map(spot => (
        <div>
          <Link href={`/spots/${spot._id}`}>
          <img className="h-64 w-72 rounded-lg hover:scale-105 hover:cursor-pointer transition duration-300 ease-in-out" src={spot.spotImages[0]} alt="" />
          </Link>
          <div className="flex justify-between my-2 mx-1">
            <div>{spot.location}</div>
            <div> ⭐ {spot.rating}</div>
          </div>
          <div className="mx-1">{spot.distance} miles away</div>
          <div className="my-2 mx-1"><span className="font-semibold">${spot.price}</span> <span>night</span></div>
        </div>
      ))}
      </div>
    </main>
  )
}
