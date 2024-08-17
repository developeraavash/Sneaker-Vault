import { createContext, useLayoutEffect, useState } from "react";
import API from "../utils";

type User = {
  id: string;
  name: string;
  email: string;
};
export const AuthContext = createContext<User | null>(null);

export default function PublicRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  async function authToken(token: string) {
    try {
      const res = await API("/auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        window.location.href  = '/'
      }
      if (res.status !== 200) {
        window.location.href = "/signin";
        // navigate("/signin", { replace: true });
      }
    } catch (err) {
    } finally {
    }
  }
  const [user, setUser] = useState<User | null>(null);
  useLayoutEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      // navigate("/signin", { replace: true });
    } else {
      authToken(token);
    }
  }, []);
  // if(!isLoading)
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
  // else return <div>Loading...</div>
}
