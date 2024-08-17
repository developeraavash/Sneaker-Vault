

import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";


export default function ProtectedRoute({children}:{children:React.ReactNode}){
  const auth = useAuth()
  console.log(auth,'auth')
  if(!auth){
    // window.location.href = '/signin'
  }
  return (
    <>{children}</>
  )
}