import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { login } from "../../api/authApi";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
   const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData)
      if (response.status === 200) {
        const data = response.data;
        navigate("/")
        
      }
    } catch (error) {
        console.error(err);
        setErrorMsg(err.response?.data?.message || "Login failed")
    }finally{
        setLoading(false)
    }
  };
  return (
    <>
       <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-2xl rounded-3xl p-10 w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        {errorMsg && (
          <div className="mb-4 text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium tracking-wide"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/80 outline-none border border-white/30 focus:border-white transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium tracking-wide"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/80 outline-none border border-white/30 focus:border-white transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-bold rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
