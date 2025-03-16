import React, { useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword, getAuth,
  onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail,
  signInWithEmailAndPassword, signOut,
  User,
} from 'firebase/auth';
import AuthContext from '../contexts/AuthContext';
import { createUserInFirestore, getUserData, updateUserFavorites } from '../services/DbService';
import IUser from '../interfaces/IUser'; // Your custom IUser type

interface IAuthProvierProps {
  children: React.ReactNode;
}

export function AuthProvider(props: IAuthProvierProps) {
  const { children } = props;
  const [user, setUser] = useState<IUser | null>(null); // IUser or null initially
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Fetch Firestore user data
        const firestoreUser = await getUserData(authUser);

        // Merge the Firebase Auth user data and Firestore user data
        const mergedUserData: IUser = {
          uid: authUser.uid,
          displayName: firestoreUser?.displayName ?? '',
          email: authUser.email ?? '', // Add other fields as needed
          favorites: firestoreUser?.favorites ?? [], // Handle favorites from Firestore
          photoURL: firestoreUser?.photoURL ?? '',
          // You can merge additional fields from authUser or firestoreUser here
        };

        setUser(mergedUserData); // Set merged user data
        setFirebaseUser(authUser);
      } else {
        setUser(null); // No user signed in
      }
      setLoading(false); // Stop loading
    });

    return () => unsubscribe();
  }, [auth]);

  async function signup(email: string, password: string, displayName: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    await createUserInFirestore(cred.user, displayName); // Create Firestore user document
  }

  async function updateFavorites(recipeId: string) {
    if (user) {
      // Update Firestore first
      await updateUserFavorites(user, recipeId);

      // Update local state to reflect the changes
      setUser((prevUser) => {
        if (prevUser) {
          const updatedFavorites = prevUser.favorites.includes(recipeId)
            ? prevUser.favorites.filter((id) => id !== recipeId)
            : [...prevUser.favorites, recipeId];

          return {
            ...prevUser,
            favorites: updatedFavorites,
          };
        }
        return null; // Handle case when user is null
      });
    }
  }

  const currentUserContextValue = useMemo(
    () => ({
      currentUser: user,
      firebaseUser,
      setCurrentUser: (updatedUser: IUser) => setUser(updatedUser),
      signup,
      updateFavorites,
      login: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
      logout: () => signOut(auth),
      resetPassword: (email: string) => sendPasswordResetEmail(auth, email),
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={currentUserContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => React.useContext(AuthContext);
