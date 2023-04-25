import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState<string>('');

  const createUser = async (event: any) => {
    event.preventDefault();

    try {
      const response = await axios.post(`/api/signup`, {
        name,
        username,
        email,
        password,
      });
      

      setMessage(response.data.message);
      setEmail('');
      setUserName('');
      setPassword('');

      router.push('/auth/signin');
    } catch (error) {
      console.error('Error creating user', error);
      setMessage('Error creating user');
    }
  };

  return (
    <div onSubmit={createUser} className="flex flex-col items-center mt-15 h-screen content-center">
      <form className="flex flex-col items-center justify-center mt-10 gap-4">
        <h1 className="text-2xl mb-10 text-red-400 ">Sign Up</h1>

        <label className="flex flex-col gap-2 text-center">
          Email
          <input
            className="border-2 border-indigo-400 rounded-md text-center h-10 w-72"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email here"
            required
          />
        </label>

        <label className="flex flex-col text-center gap-2">
          Username
          <input
            className="border-2 border-indigo-400 rounded-md text-center h-10 w-72"
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </label>

        <label className="flex flex-col text-center gap-2">
          Name
          <input
            className="border-2 border-indigo-400 rounded-md text-center h-10 w-72"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your Name"
            required
          />
        </label>

        <label className="flex flex-col text-center gap-2">
          Password
          <input
            className="border-2 border-indigo-400 rounded-md text-center h-10 w-72 "
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </label>

        <button type="submit" className="border-2 border-purple-300 p-2 rounded-md hover:bg-purple-200">Register</button>

      </form>
    </div>
  )
}
