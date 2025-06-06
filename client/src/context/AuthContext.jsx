import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  const logout = () => signOut(auth);

  return <AuthContext.Provider value={{ user , logout}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
