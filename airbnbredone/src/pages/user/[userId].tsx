import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  images: string[];
}

const UserDetails: React.FC = () => {
  const router = useRouter();
  const { userId } = router.query;
    
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const images = user?.images
  console.log(images)

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get<User>(`/api/user?id=${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Details</h1>
      {user ? (
        <div>
          <h2>Name: {user.name}</h2>
          <p>Email: {user.email}</p>
          
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserDetails;
