"use client";

import React, { useState } from "react";
import { useAuth } from "../../contexts/auth_context";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [loginData, setLoginData] = useState({
    credential: "rifqimuzakki45@gmail.com",
    password: "password",
  });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(loginData);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-6">
      <button
        onClick={() => router.push("/")}
        className="flex items-center text-blue-900 mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali
      </button>

      <div className="max-w-md mx-auto bg-gradient-to-b from-blue-300 to-blue-400 rounded-3xl p-8 mt-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          MASUK
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-100 text-center text-sm bg-red-500/20 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-white mb-2 block">Email</label>
              <input
                name="credential"
                type="text"
                required
                className="w-full px-4 py-3 rounded-full bg-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="masukan email anda"
                value={loginData.credential}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-white mb-2 block">Kata sandi</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-full bg-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="masukan kata sandi anda"
                value={loginData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-right">
            <Link
              href="/register"
              className="text-white text-sm hover:underline"
            >
              Belum memiliki akun? Daftar sekarang
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-white font-semibold py-3 rounded-full hover:bg-yellow-300 transition-colors cursor-pointer"
          >
            Masuk
          </button>

          {/* <button
            type="button"
            className="w-full bg-white text-gray-600 font-semibold py-3 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Masuk dengan google
          </button> */}
        </form>
      </div>
    </div>
  );
}
