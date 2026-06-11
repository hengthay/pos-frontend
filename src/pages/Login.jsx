import React, { useState } from "react";
import { CiLogin } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import EyeToggleIcon from "../components/Helper/EyeToggleIcon";
import { GrMoney } from "react-icons/gr";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { fetchUser, loginUser } from "../feature/auth/authSlice";
import { API_BASE_URL } from "../components/APIConfig";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(null);
  const [isError, setIsError] = useState(null);

  const [isCheckedPassword, setIsCheckedPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const togglePasswordVisibility = () => setIsCheckedPassword((prev) => !prev);
  const handleFocus = (fieldName) => setFocusedField(fieldName);
  const handleBlur = () => setFocusedField(null);

  const shouldNameLabelFloat = focusedField === "name" || formData.name.length > 0;
  const shouldPasswordLabelFloat = focusedField === "password" || formData.password.length > 0;

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name] : value
    }))
  }

  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if(!formData.name || !formData.password) {
        setIsError("Please fill out the box!");
        setIsLoading(false);
        return;
      }

      const payload = {...formData};

      await dispatch(loginUser({ payload })).unwrap();

      Swal.fire({
        title: "Successfully",
        text: "Your login is successfully!",
        icon: 'success',
        timer: 2000,
      })
      const timeOut = setTimeout(() => {
        navigate('/');
      }, 2000);

      // Clear form
      setFormData({name: "", password: ""})

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: "Your login is not success!",
        icon: 'error',
        timer: 2000,
      })
      console.log('Error to make login - ',error.message);
    } finally {
      setIsLoading(false);
      setFormData({name: "", password: ""})
    }
  }

  // console.log(formData);
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
            <GrMoney size={28} className="text-cyan-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Sign in to continue managing your POS system.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSumbit}>
          <div className="relative">
            <label
              htmlFor="name"
              className={`absolute transition-all duration-200 px-2 bg-white
              ${
                shouldNameLabelFloat
                  ? "-top-2 left-3 text-xs text-cyan-600 font-medium"
                  : "top-3 left-3 text-slate-400"
              }`}
            >
              Username
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />

            <FaRegUser
              size={18}
              className="absolute right-4 top-4 text-slate-400"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className={`absolute transition-all duration-200 px-2 bg-white
              ${
                shouldPasswordLabelFloat
                  ? "-top-2 left-3 text-xs text-cyan-600 font-medium"
                  : "top-3 left-3 text-slate-400"
              }`}
            >
              Password
            </label>

            <input
              type={isCheckedPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onFocus={() => handleFocus("password")}
              onBlur={handleBlur}
              onChange={handleChange}
              className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />

            <EyeToggleIcon
              isChecked={isCheckedPassword}
              onClick={togglePasswordVisibility}
              shouldPasswordLabelFloat={shouldPasswordLabelFloat}
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 cursor-pointer rounded-xl bg-cyan-600 text-white font-semibold transition-all duration-300 hover:bg-cyan-700 active:scale-[0.98]"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {/* Error */}
          {isError && (
            <p className="text-sm text-red-500 text-center">
              {isError}
            </p>
          )}
        </form>
        
        {/* Check if role admin then shown this create account */}
        {/* <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-cyan-600 hover:text-cyan-700"
            >
              Create Account
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;