"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        bio: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) fd.append(key, value);
            });

            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: fd,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to register");

            alert("Registration successful!");
            router.push("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12">
            <div className="w-full max-w-md px-6">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-mono text-black">
                        Dev<span className="text-green-600">Sphere</span>
                    </h1>
                    <p className="text-gray-600 text-sm mt-2">Create your account and start blogging.</p>
                </div>

                {/* Register Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
                >
                    <h2 className="text-2xl font-semibold text-black mb-6">Sign Up</h2>

                    <div className="flex flex-col gap-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="johndoe"
                                onChange={handleChange}
                                value={formData.username}
                                required
                                className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="your@email.com"
                                onChange={handleChange}
                                value={formData.email}
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
                                onChange={handleChange}
                                value={formData.password}
                                required
                                className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                            />
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                Bio <span className="text-gray-500 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                name="bio"
                                id="bio"
                                placeholder="Tell us about yourself..."
                                onChange={handleChange}
                                value={formData.bio}
                                rows="3"
                                className="w-full border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 resize-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Picture <span className="text-gray-500 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm">or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{" "}
                            <Link 
                                href="/login" 
                                className="text-green-700 hover:text-green-800 font-medium transition-colors duration-200"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}   