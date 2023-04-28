import React, {useState, useEffect, useRef} from 'react'
import Image from 'next/image'
import Logo from './bk-logo.png'
import Dropdown from './menu (1).png'
import User from './user.png'
import Link from 'next/link'
import { useUser } from '<prefix>/context/UserContext'
import axios from 'axios'
import { useRouter } from 'next/router'
import Search from './search.png'

export default function NavBar() {
  const [dropdown, setDropDown] = useState<boolean>(false)
  const {currentUser, setCurrentUser} = useUser()
  const router = useRouter()
  const [search, setSearch] = useState<string>("")
  const [spots, setSpots] = useState([])
  const [filteredSuggestions, setFilteredSuggestions] = useState([
    
  ])
  const [spotModal, toggleSpotModal] = useState(false)

  const [spotFormData, setSpotFormData] = useState({
    title: '',
    location: '',
    description: '',
    spotImages: [],
    price: 0,
    distance: 0,
    userId: currentUser?.id
  })


  const handleDropDown = () => {
    setDropDown(!dropdown)
  }

  const handleSearch = (event: any) => {
    if (event.key === "Enter") {
      const searchTerm = event.target.value.toLowerCase().trim();
      const matchingSpot = spots.find(
        (spot: any) => spot.title.toLowerCase().includes(searchTerm)
      );
      if (matchingSpot) {
        router.push(`/spots/${matchingSpot._id}`);
      }
    }
  }

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setSpotFormData({ ...spotFormData, [name]: value });
  };

  const handleImageChange = (e: any, index: number) => {
    const { value } = e.target;
    const updatedImages = [...spotFormData.spotImages];
    updatedImages[index] = value;
    setSpotFormData({ ...spotFormData, spotImages: updatedImages });
  }


  const handleLogout = async () => {
    localStorage.removeItem('currentUser');

    setCurrentUser(null);
    router.push('/')
  }

  const handleDemoUser = async (event: any) => {
    event.preventDefault()
    const credential = "jasonwong123"
    const password = "jason"
    
    try {
      const response = await axios.post(`/api/auth/signin`, {
        credential, 
        password
      })
      setCurrentUser(response.data.user)
      localStorage.setItem('currentUser', JSON.stringify(response.data.user))
      router.push(`/`)

    } catch (error) {
      console.error('error logging in demo', error)
    }
  }


  const handleSubmit = async (e:any) => {
    e.preventDefault()

    try {
      const response = await axios.post('/api/spots', spotFormData)
      
      const createdSpot = response.data.spot;
      // gotta navigate

      setSpotFormData({
        title: '',
        location: '',
        description: '',
        spotImages: [],
        price: 0,
        distance: 0,
        userId: currentUser?.id
      });
      
      toggleSpotModal(false)
      router.push(`/spots/${createdSpot._id}`)


    } catch (error) {
      console.error("Error creating spot:", error)
    }
  }



  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    axios.get(`/api/spots`).then((response) => {
      setSpots(response.data)
    })

  }, []);


  useEffect(() => {
    if (search) {
      setFilteredSuggestions(
        spots
          .filter((spot: any) =>
            spot.title.toLowerCase().startsWith(search.toLowerCase())
          )
      );
    } else {
      setFilteredSuggestions([]);
    }
  }, [search]);
  

  // let suggestions: any = []

  // spots.forEach((ele: any) => {
  //   suggestions.push(ele.title)
  // })


  console.log(filteredSuggestions, 'filter')
  
  const handleSuggestionClick = async (suggestion: any) => {
    console.log(suggestion)
    setSearch(suggestion.title);
    setFilteredSuggestions([]);
    router.push(`/spots/${suggestion._id}`).then(() => router.reload());
    
  };

  return (
    <div className="h-20 flex w-full justify-between items-center px-8">
      <Link
      href="/"
      >
        <div className="flex items-center gap-x-2 cursor-pointer">
        <Image
        src={Logo}
        alt="Missing Page"
        width={80}
        height={80}
        className="rounded-3xl"
        />
        AirBK
        </div>
        </Link>

        <form onSubmit={handleSubmit} className="flex gap-x-3 cursor-pointer border rounded-full p-3">
          <input 
          className="border-none focus:outline-none pl-2"  
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          
          />
            <div>
              <Image
              src={Search}
              alt="missing image"
              width={24}
              height={24}
              />
            </div>
            <div
          className={
              filteredSuggestions.length
                ? 'absolute z-10 top-16 mt-2 w-98 bg-white border border-gray-200 rounded shadow-md'
                : 'hidden'
            }
          >
{filteredSuggestions.map((suggestion: any, index) => (
  <div
    key={index}
    className="p-2 hover:bg-gray-200 cursor-pointer"
    onClick={() => {
      handleSuggestionClick(suggestion);
    }}
  >
    {suggestion.title}
  </div>
))}

        </div>
        </form>
        
        <div className="flex items-center gap-x-3 cursor-pointer">
            <div onClick={() => toggleSpotModal(!spotModal)}>AirBK Your Home</div>

            <form  onSubmit={handleSubmit} className={spotModal ? 'flex gap-4 flex-col absolute top-[25%] left-[25%] h-auto w-1/2 bg-cyan-950 rounded-lg p-10 z-30' : "hidden"}>
                <label className="flex flex-col gap-2 text-white">
                  Title:
                <input 
                  type="text" 
                  name="title"
                  placeholder="Give your location a title"
                  className="border-2 border-rose-300 p-2 rounded-lg text-black"
                  value={spotFormData.title}
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
                  className="border-2 border-rose-300 p-2 rounded-lg text-black "
                  value={spotFormData.location}
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
                  value={spotFormData.description}
                  onChange={handleChange}
                  required
                  />
                </label>

                <label className="flex flex-col gap-2 text-white">
                  Spot Images (up to 5):
                  {[...Array(5)].map((_, index) => (
                    <input
                      key={index}
                      type="url"
                      name={`image_url_${index}`}
                      placeholder={`Image URL ${index + 1}`}
                      className="border-2 border-rose-300 p-2 rounded-lg text-black mt-2"
                      value={spotFormData.spotImages[index] || ""}
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  ))}
                </label>


                <label className="flex flex-col gap-2 text-white">
                  Price:
                <input 
                  type="text" 
                  name="price"
                  placeholder="How much do you want to charge per night?"
                  className="border-2 border-rose-300 p-2 rounded-lg text-black"
                  value={spotFormData.price}
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
                  value={spotFormData.distance}
                  onChange={handleChange}
                  required
                  />
                </label>
                
                
                <div className="text-center">
                <button type="submit" className="text-white mt-5 text-xl border p-3 rounded-lg hover:bg-white hover:text-black " >Create Hosting</button>
                </div>
                
            </form>


            <div className="flex">
                <div onClick={handleDropDown} className="z-15 flex gap-x-2 border-2 border-rose-400 rounded-xl p-2.5">

                        <Image
                        src={Dropdown}
                        alt=""
                        width={25}
                        height={25}
                        />

                        <Image
                        src={User}
                        alt=""
                        width={25}
                        height={25}
                        />


                      {currentUser 
                        ? 
                        <div  className={dropdown ? "z-1 absolute top-20 right-5 bg-white h-auto pb-3 w-60 border-2 border-slate-100 rounded-xl shadow-xl " : "hidden"}>
                            <div className="flex flex-col mx-5 pt-5 rounded-md gap-3">
                              <div>User: {currentUser.username}</div>
                              <div>Name: {currentUser.name}</div>
                              

                              <button onClick={handleLogout} className="bg-stone-200 hover:bg-gray-100 py-2 px-4 rounded-md">Logout</button>
                              <Link href="/spots/current" className="bg-stone-200 hover:bg-gray-100 py-2 px-4 rounded-md text-center">Hosted Home Dashboard</Link>
                              <Link href="/spots/favorites" className="bg-stone-200 hover:bg-gray-100 py-2 px-4 rounded-md text-center">Favorites</Link>
                              <Link href="/spots/bookings" className="bg-stone-200 hover:bg-gray-100 py-2 px-4 rounded-md text-center">Bookings</Link>
                              <div className="bg-stone-200 hover:bg-gray-100 py-2 px-4 rounded-md text-center">Account</div>
                            </div>
                         </div>
                        
                        :
                        <div   className={dropdown ? "z-1 absolute top-20 right-5 bg-white h-44 w-60 border-2 border-slate-100 rounded-xl shadow-xl " : "hidden"}>
                          <div className="flex flex-col pl-5 pt-5 ">
                            <Link href="/signup" className="bg-stone-200 hover:bg-gray-100 py-2 px-4 ">Sign Up</Link>
                            <Link href="/auth/signin" className="bg-stone-200 hover:bg-gray-100 py-2 px-4 ">Login</Link>
                            <div onClick={handleDemoUser} className="bg-stone-200 hover:bg-gray-100 py-2 px-4 ">Demo User</div>
                          </div>
                        </div>
                      }
                </div>
            </div>
        </div>
    </div>

  )
}
