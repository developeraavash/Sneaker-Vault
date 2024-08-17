import { createContext, useEffect, useState } from "react";
import API from "./utils";

const AuthContext = createContext<{} | null>(null);
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchAuthStatus() {
      try {
        const token = window.localStorage.getItem("token");
        const res = await API("/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setIsLoggedIn(res.data);
        } else {
          console.error("Authentication failed", res.statusText);
        }
      } catch (err) {
        console.error("Error fetching authentication status", err);
      } finally {
        setIsLoading(false);
      }
      fetchAuthStatus();
    }
  }, []);
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
