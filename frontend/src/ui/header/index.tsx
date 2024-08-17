import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
export default function Header() {
  const auth = useAuth()
    return (
      <div className=" p-1 text-xs flex justify-end items-center gap-x-2">
      {
        auth ? <div>
          <button onClick={()=>auth.logout()}>
            Log out
          </button>
        </div> : 
        <>
        <Link className="hover:text-gray-500" to={"/joinus"}>
          Join Us
        </Link>
        <span>|</span>
        <Link className="hover:text-gray-500" to={"/signin"}>
          Sign In
        </Link>
        </>
      }
      </div>
       )
}
