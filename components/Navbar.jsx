'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useSession } from "next-auth/react";
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="bg-white border-b border-gray-200 py-5">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div>
                        <Link href={'/'}>
                        <h1 className="text-2xl  font-serif text-black tracking-tight">
                            Dev<span className="text-[#153619]">Sphere</span>
                        </h1>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex justify-center inter-link">
                        <ul className="flex items-center gap-8">
                            <Link href={'/'}>
                                <li className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer text-sm">
                                    Home
                                </li>
                            </Link>
                            <Link href={'/allBlogs'}>
                                <li className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer text-sm">
                                    Blogs
                                </li>
                            </Link>
                            <Link href={'/about'}>
                                <li className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer text-sm">
                                    About
                                </li>
                            </Link>
                            <Link href={'/contact'}>
                                <li className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer text-sm">
                                    Contact
                                </li>
                            </Link>
                            <Link href={'/subscription'}>
                                <li className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer text-sm">
                                    Subscription
                                </li>
                            </Link>
                            <button   onClick={() => signOut({ callbackUrl: "/login" })} className="bg-[#153619] hover:bg-green-900 text-white px-6 py-2 rounded text-sm font-medium transition-colors duration-200">
                                Signout
                            </button>
                        </ul>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-black transition-colors duration-200"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                        <ul className="flex flex-col gap-4">
                            <li className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer text-sm py-2">
                                Home
                            </li>
                            <li className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer text-sm py-2">
                                Blogs
                            </li>
                            <li className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer text-sm py-2">
                                About
                            </li>
                            <li className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer text-sm py-2">
                                Contact
                            </li>
                            <li className='flex gap-4 items-center justify-center'>
                                <button className="w-full bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded text-sm font-medium transition-colors duration-200">
                                    Signout
                                </button>
                                <Link href={`/user/${blogId}`}>
                                <button className="w-full bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded text-sm font-medium transition-colors duration-200" >Profile</button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default function NavbarWrapper() {
  const { data: session } = useSession();
  return session ? <Navbar /> : null;
}