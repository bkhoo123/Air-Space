import { createContext, useState, useContext } from 'react';

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  id: string;
  // Add more fields as needed
}

interface UserContextData {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextData>({
  currentUser: null,
  setCurrentUser: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

