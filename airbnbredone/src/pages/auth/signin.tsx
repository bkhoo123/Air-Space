import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useUser } from '<prefix>/context/UserContext';

export default function SignIn() {
  const { setCurrentUser } = useUser();
  const router = useRouter();
  const [credential, setCredential] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const signin = async (event: any) => {
    event.preventDefault();

    try {
      const response = await axios.post(`/api/auth/signin`, {
        credential,
        password,
      });

      setMessage(response.data.message);
      setCredential('');
      setPassword('');
      setCurrentUser(response.data.user);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      router.push(`/`);
    } catch (error) {
      console.error('Error signing in', error);
      setMessage('Invalid Credentials, please try again');
    }
  };

  return (
    <form onSubmit={signin} className="flex flex-col justify-center items-center mt-10">
      <h3 className="text-red-400 text-2xl mb-5">Login</h3>
      <div className="mb-5 text-blue-600">{message}</div>
      <label className="flex flex-col text-center gap-2">
        Credentials
        <input
          className="border-2 border-indigo-400 rounded-md text-center h-10 w-72"
          placeholder="Login Email / Username"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
        />
      </label>

      <label className="flex flex-col text-center mt-3 gap-2">
        Password
        <input
          className="border-2 border-indigo-400 rounded-md text-center h-10 w-72"
          placeholder="Enter your password here"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button
        type="submit"
        className="mt-5 border-2 border-violet-400 px-5 py-2 rounded-md hover:bg-violet-200"
      >
        Sign In
      </button>
    </form>
  );
}
