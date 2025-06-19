import '../firebase.js'
import { createContext, useContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import {auth} from '../firebase.js'
import { initializeUserDocument } from '../databaseStorage/userStorage.js';

const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email, password, firstName, lastName) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      await initializeUserDocument(userCredential.user.uid);
      return { success: true, user: userCredential.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await initializeUserDocument(userCredential.user.uid);
      return { success: true, user: userCredential.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      await initializeUserDocument(result.user.uid);
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signInWithGithub = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, githubProvider);
      await initializeUserDocument(result.user.uid);
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  return (<AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signInWithGithub,
        logout
      }}>{children}</AuthContext.Provider>);
};

export const useAuth = () => useContext(AuthContext);