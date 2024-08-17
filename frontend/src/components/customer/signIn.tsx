import { useForm } from "react-hook-form";
import AppLogo from "../../ui/logo";
import { Link, Navigate, useNavigate } from "react-router-dom";
import API from "../../utils";
import { useAuth } from "../../hooks/useAuth";

interface SignInForm {
  email: string;
  password: string;
}

export default function SignIn() {
  const auth = useAuth()
  if(auth) {
    window.location.href = '/'
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>();
  async function onSubmit(data: SignInForm) {
    try {
      const res = await API.post("/signin", data);
      if (res.status === 200) {
        const { token } = res.data;
        if (token) {
          window.localStorage.setItem("token", token);
          window.location.href = '/collections'
        }
      }
    } catch (error) {}
  }
  return (
    <div className="flex text-gray-700 items-center text-sm p-4 justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <div className="flex items-center justify-center">
          <AppLogo />
        </div>
        <div className="flex flex-col gap-y-1">
          <label className="">Email</label>
          <input
            className="border rounded p-2"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <p>
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Password</label>
          <input
          type="password"
            className="border rounded p-2"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p>
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            </p>
          )}
          <div className="text-end">
          <Link className="text-xs text-gray-600 hover:underline"  to={'/forgot-password'} >Forgot password?</Link>
        </div>
        </div>
        
        <div className="text-center">
          <button
            className="bg-gray-700 rounded text-white p-2 px-4 hover:bg-gray-800"
            type="submit"
          >
            Sign In
          </button>
        </div>
       
        <div>
          <p className="">
            Already have an account?{" "}
            <Link className="hover:underline" to={"/joinus"}>
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
