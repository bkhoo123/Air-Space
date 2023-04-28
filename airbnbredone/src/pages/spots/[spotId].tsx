import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useUser } from "<prefix>/context/UserContext";

import Bookings from "<prefix>/components/bookings";

export default function SpotDetails() {
  const router = useRouter();

  const [spot, setSpot] = useState<Spot | null>(null);
  const { currentUser, setCurrentUser } = useUser();
  const [user, setUser] = useState([])
  const [value, onChange] = useState(new Date());
  const [date1, setDate1] = useState(new Date())
  const [toggleModal, setToggleModal] = useState(false)
  const [reviewModal, toggleReviewModal] = useState(false)

  const [editSpot, setEditSpot] = useState({
    title: spot?.title,
    location: spot?.location,
    description: spot?.description,
    price: spot?.price,
    distance: spot?.distance,
    userId: ""
  })


  
  const { spotId } = router.query;

  interface Spot {
    _id: string;
    title: string;
    location: string;
    description: string;
    spotImages: string[];
    reviews?: any;
    rating?: number;
    price: number;
    distance: number;
    userId?: string;
  }


  useEffect(() => {
    
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
      user.push(currentUser)
    }
    if (spotId) {
      axios.get(`/api/spots/${spotId}`).then((response) => {
        const fetchedSpot = response.data.spot;
        setSpot(response.data.spot);
        setEditSpot({
          title: fetchedSpot?.title,
          location: fetchedSpot?.location,
          description: fetchedSpot?.description,
          price: fetchedSpot?.price,
          distance: fetchedSpot?.distance,
          userId: fetchedSpot?.userId, // Add this line
        });
      });
      
    }
  }, [spotId, spot?.title, spot?.location, spot?.price, spot?.distance]);


  const [reviewForm, setReviewForm] = useState({
    rating: 3,
    comment: "",
    userId: "",
    name: ""
  })

  useEffect(() => {
    if (currentUser) {
      setReviewForm({
        ...reviewForm,
        userId: currentUser.id,
        name: currentUser.name
      });
      setEditSpot({
        ...editSpot,
        userId: currentUser.id
      })
    }
  }, [currentUser]);

  

  const DEFAULT_IMAGE = "https://via.placeholder.com/250";

  const values = spot?.reviews?.map(review => review) || [];
  let sum: any = [];


  const avg = values.length > 0 ? (values.reduce((acc: any, cur: any) => acc + cur.rating, 0) / values.length).toFixed(1) : "0";


  const date1WeekLater = new Date(date1);
  date1WeekLater.setDate(date1.getDate() + 7);

 
  function randomDate(start: any, end: any) {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const randomTimestamp = startDate + Math.random() * (endDate - startDate);
    return new Date(randomTimestamp);
  }

  function formatDate(date: any) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    return `${month} ${year}`;
  }
  
  const randomDates:any = [];
  for (let i = 0; i < 50; i++) {
    const randomDateExample = randomDate("2021-01-01", "2023-05-31");
    const formattedDate = formatDate(randomDateExample);
    randomDates.push(formattedDate);
  }


  function renderStars(rating: any) {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={i}>⭐</span>);
    }
    return stars;
  }

  const handleDelete = async (e: any) => {
    e.preventDefault()
    await axios.delete(`/api/spots/${spotId}`)
    router.push('/')
  }

  const handleTransform = async (e: any) => {
    e.preventDefault()
    router.push(`${spot?.spotImages[0]}`)
  }

  const handleTransform1 = async (e: any) => {
    e.preventDefault()
    router.push(`${spot?.spotImages[1]}`)
  }

  const handleTransform2 = async (e: any) => {
    e.preventDefault()
    router.push(`${spot?.spotImages[2]}`)
  }

  const handleTransform3 = async (e: any) => {
    e.preventDefault()
    router.push(`${spot?.spotImages[3]}`)
  }

  const handleTransform4 = async (e: any) => {
    e.preventDefault()
    router.push(`${spot?.spotImages[4]}`)
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const response = await axios.put(`/api/spots/${spotId}`, editSpot)

    const editedSpot = response.data.spot;
    await router.reload()

    setToggleModal(false)
  }

  const handleChange = (e:any) => {
    const {name, value} = e.target;
    setEditSpot({...editSpot, [name]: value})
  }

  const handleReviewChange = (e:any) => {
    const {name, value} = e.target;
    setReviewForm({...reviewForm, [name]: value})
  }

  const handleCreateReview = async (e:any) => {
    e.preventDefault()
    const payload = {
      ...reviewForm,
      spotId: spotId,
    }

    const response = await axios.post(`/api/spots/createReview`, payload);
    toggleReviewModal(false);
    router.reload()
  }

  const reviewToggle = (e:any) => {
    e.preventDefault()
    toggleReviewModal(!reviewModal)
  }

  const deleteReview = async (e:any, reviewIndex: number) => {
    const payload = {
      spotId: spotId,
      reviewIndex: reviewIndex
    }

    e.preventDefault()
    await axios.put(`/api/spots/deleteReview`, payload)
    router.reload()
  }

  // <button className='p-2 border bg-rose-400 rounded-md text-white font-semibold'>Edit</button> 

  return (
      <div className="p-6 container mx-auto">
        <div className="flex flex-row justify-between">
          <div className="text-2xl font-bold">{spot?.title}</div>
          <div className={currentUser?.id === spot?.userId ? "" : "hidden"}>
            <button onClick={() => setToggleModal(!toggleModal)} className="border p-2 mr-2 bg-rose-400 rounded-md text-white font-semibold hover:bg-stone-400">Edit Spot</button>
            <button onClick={handleDelete} className="border p-2 bg-rose-400 rounded-md text-white font-semibold hover:bg-stone-400">Delete Spot</button>
          </div>
            
          </div>
          <div className="py-3"> 
            <span>⭐ {avg} • {values.length} Reviews •  {spot?.location}</span>
            
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
            <img onClick={handleTransform} className="h-[520px] w-full rounded-md hover:scale-105 transition duration-300 ease-in cursor-pointer" src={spot?.spotImages[0]} alt="" />
            </div>
            <span className="grid grid-cols-2 gap-2">
              <img onClick={handleTransform1} className="h-[250px] w-full rounded-md hover:scale-105 transition duration-250 ease-in cursor-pointer" src={spot?.spotImages[1] ?? DEFAULT_IMAGE} alt="" />
              <img onClick={handleTransform2} className="h-[250px] w-full rounded-md hover:scale-105 transition duration-250 ease-in cursor-pointer" src={spot?.spotImages[2] ?? DEFAULT_IMAGE} alt="" />
              <img onClick={handleTransform3} className="h-[250px] w-full rounded-md hover:scale-105 transition duration-250 ease-in cursor-pointer" src={spot?.spotImages[3] ?? DEFAULT_IMAGE} alt="" />
              <img onClick={handleTransform4} className="h-[250px] w-full rounded-md hover:scale-105 transition duration-250 ease-in cursor-pointer" src={spot?.spotImages[4] ?? DEFAULT_IMAGE} alt="" />
            </span>
          </div>

          <div className="pt-5 grid grid-cols-12 ">

            <div className="col-span-7 pr-5">
              <div className="decoration-solid underline font-bold">Description</div>
              <div className="py-2">5 guests • 2 bedrooms • 2 beds • 2 baths</div>
              <div>{spot?.description}</div>
              <div className="flex flex-row my-4 border-t pt-5 justify-between items-center">
              <div className=" border-stone-300  text-xl font-semibold">⭐ {avg} • {values?.length} Reviews</div>
              <div> 
                <button onClick={reviewToggle} className="border p-2.5 rounded-md bg-rose-400 text-white font-semibold hover:bg-stone-400">Write a Review</button>
                <form onSubmit={handleCreateReview} className={reviewModal ? 'absolute left-[25%] top-[50%] bg-cyan-900 h-auto w-1/2 p-12 rounded-lg flex gap-2 flex-col': 'hidden'}>
                  
                <label className="flex flex-col gap-2 text-white">
                  Review:
                <input 
                  type="text" 
                  name="comment"
                  placeholder="Write your review here"
                  className="border-2 border-rose-300 p-2 rounded-lg text-black"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  required
                  />
                </label>

                <label className="flex flex-col gap-2 text-white">
                Rating:
                <select 
                  name="rating"
                  placeholder="Select a rating"
                  className="border-2 border-rose-300 p-2 rounded-lg text-black"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                  required
                >
                  <option value="" disabled>Select a rating</option>
                  <option value="1">⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
              </label>
              <button type="submit" className="text-white mt-5 text-xl border p-3 rounded-lg hover:bg-white hover:text-black " >Post Review</button>

                </form>
                <button></button>
              </div>
              </div>
              <div className="flex gap-3 flex-col">
              {values.map((review: any, index:any) => (
                  <>
                  <div className="flex flex-row justify-between">
                  <div className="font-semibold">{review.name} • {randomDates[index]} <span className='ml-3'>{renderStars(review?.rating)}</span> </div>
                  <div className={currentUser?.id == review?.userId ? "flex gap-x-4" : "hidden"}>  <button onClick={(e) => deleteReview(e, index)} className="p-2 border bg-rose-400 rounded-md text-white font-semibold hover:bg-stone-400">Delete</button></div>
                  </div>
                  <div key={review?._id}>{review?.comment}</div>
                  
                  </>
                ))}
              </div>
            </div>

              <Bookings spot={spot} avg={avg} values={values}  userId={currentUser?.id} />  


          </div>
          
          <form onSubmit={handleSubmit} className={toggleModal ? 'absolute top-[25%] left-[25%] h-auto w-1/2 bg-cyan-900 rounded-lg p-10 z-30 flex gap-3 flex-col': 'hidden'}>
          
                <label className="flex flex-col gap-2 text-white">
                  Title:
                <input 
                  type="text" 
                  name="title"
                  placeholder="Give your location a title"
                  className="border-2 border-rose-300 p-2 rounded-lg text-black"
                  value={editSpot?.title}
                  onChange={handleChange}
                  required
                  />
                </label>

                <label className="flex flex-col gap-2 text-white">
                  Location:
                <input 
                  type="text" 
                  name="location"
                  placeholder="Where is it?"
                  className="border-2 border-rose-300 p-2 rounded-lg text-black  "
                  value={editSpot?.location}
                  onChange={handleChange}
                  required
                  />
                </label>

                <label className="flex flex-col gap-2 text-white">
                  Description:
                <input 
                  type="text" 
                  name="description"
                  placeholder="Give a brief description of your hosting"
                  className="border-2 border-rose-300 p-2 rounded-lg text-black "
                  value={editSpot?.description}
                  onChange={handleChange}
                  required
                  />
                </label>


                <label className="flex flex-col gap-2 text-white">
                  Price:
                <input 
                  type="text" 
                  name="price"
                  placeholder="How much do you want to charge per night?"
                  className="border-2 border-rose-300 p-2 rounded-lg text-black"
                  value={editSpot?.price}
                  onChange={handleChange}
                  required
                  />
                </label>

                <label className="flex flex-col gap-2 text-white">
                  Distance:
                <input 
                  type="text" 
                  name="distance"
                  placeholder="How far is your location?"
                  className="border-2 border-rose-300 p-2 rounded-lg text-black"
                  value={editSpot?.distance}
                  onChange={handleChange}
                  required
                  />
                </label>
                
                
                <div className="text-center">
                <button type="submit" className="text-white mt-5 text-xl border p-3 rounded-lg hover:bg-white hover:text-black " >Edit Hosting</button>
                </div>
                
            
          </form>

      </div>
    );
}
 