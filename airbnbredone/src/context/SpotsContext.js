import { createContext, useState, useContext, useReducer } from 'react';
import axios from 'axios'

export const SpotsContext = createContext()
export const useSpots = () => useContext(SpotsContext)



export default function SpotsProvider({children}) {
    const [spot, setSpots] = useState([])

    


    return (
      <div>SpotsContext</div>
    )
}
