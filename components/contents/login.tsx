"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie
import axios from "axios";
import { Eye, EyeOff, LockIcon, Mail } from "lucide-react"; // Import eye icons
import Image from "next/image";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const LOGIN_API_URL = `${API_BASE_URL}/login`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        LOGIN_API_URL,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { token } = response.data;
      Cookies.set("token", token, { expires: 7 });
      console.log("Login success, token saved. Redirecting to Dashboard...");
      router.push("/dashboard"); // Redirect ke dashboard Dashboard
    } catch (err) {
      // Tangani error dan tampilkan pesan error
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data.message ||
          "Login failed. Please check your credentials.";
        setError(errorMessage);
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen w-full bg-black flex items-center justify-center md:justify-start flex-col`}
    >
      <div className="flex flex-row items-center w-full">
        <div className="relative flex flex-col justify-between w-full p-12 mx-48 my-24">
          <div className="relative w-full max-w-xl flex flex-col gap-y-2 text-white mb-6">
            <h1 className="text-4xl">Sign In</h1>
            <h1 className="text-lg">Please login to your account</h1>
          </div>
          <form onSubmit={handleSubmit} className="bg-black">
            <div className="mb-6 relative">
              <label htmlFor="email" className="block text-white mb-2">
                Email
              </label>
              <Mail
                className="absolute left-3 top-11 text-gray-500"/>
              <input
                type="email"
                id="email"
                placeholder="Enter your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-12 py-3 rounded-xs border-0 border-b bg-black border-gray-600 text-white focus:bg-black"
                required
              />
            </div>
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-white mb-2"
              >
                Password
              </label>
              <LockIcon
                className="absolute left-3 top-11 text-gray-500"/>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-12 py-3 rounded-xs border-0 border-b bg-black border-gray-600 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {error && (
              <div className="mb-4 text-red-500" aria-live="assertive">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-6 text-white bg-primary rounded-[12px] ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-accent-foreground"
              } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-300`}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
        <div className="w-full max-w-[767px] min-w-1/3 h-screen bg-white rounded-tl-[71px] overflow-hidden">
            <Image
              src={`/background.jpg`}
              alt="Weather Condition Image"
              width={1100}
              height={800}
              className="w-full h-full object-cover object-center"
            />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
