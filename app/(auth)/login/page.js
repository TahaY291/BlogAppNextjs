"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono text-black">
            Dev<span className="text-green-600">Sphere</span>
          </h1>
          <p className="text-gray-600 text-sm mt-2">Welcome back! Please login to your account.</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-black mb-6">Login</h2>

          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="your@email.com"
                required
                className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Login
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-green-700 hover:text-green-800 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <Link
            href="/forgot-password"
            className="text-gray-600 hover:text-black text-sm transition-colors duration-200"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}