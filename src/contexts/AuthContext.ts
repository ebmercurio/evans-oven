import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import IUser from '../interfaces/IUser';

// Define the context type
interface UserContextType {
  currentUser: IUser | null;
  firebaseUser: User | null;
  setCurrentUser: (user: IUser) => void;
  signup: (email: string, password: string, displayName: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  resetPassword: (email: string) => void;
  // updateEmailAddress: (email: string) => void;
  // updatePassword: (password: string) => void;
  // updateDisplayName: (name: string) => void;
}

// Create the context
const CurrentUserContext = createContext<UserContextType>({
  currentUser: null,
  firebaseUser: null,
  setCurrentUser: () => {},
  signup: () => {},
  login: () => {},
  logout: () => {},
  resetPassword: () => {},
  // updateEmailAddress: () => {},
  // updatePassword: () => {},
  // updateDisplayName: () => {},
});

export default CurrentUserContext;

export function useAuth() {
  return useContext(CurrentUserContext);
}
