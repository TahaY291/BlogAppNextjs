'use client'
import Image from "next/image";
import React  from "react";
import Link from "next/link";
import BlogCard from "./BlogCard";
import { useState } from "react";
import { useSession } from "next-auth/react";
import pencile from '@/public/pencile.svg'
import profileImg from "@/public/profileImg.jpg"

export const UserDetail = ({ user, posts }) => {
    const { data: session, status } = useSession();

    const isOwner = session?.user?.id === user._id || session?.user?.email === user.email;

    const avgLikes = () => {
        if (!posts || posts.length === 0) return 0;
        const totalLikes = posts.reduce(
            (sum, post) => sum + (post.likesCount || 0),
            0
        );
        return Math.round(totalLikes / posts.length);
    };

    const avgViews = () => {
        if (!posts || posts.length === 0) return 0;
        const totalViews = posts.reduce(
            (sum, post) => sum + (post.views || 0),
            0
        );
        return Math.round(totalViews / posts.length);
    };

    const totalLikes = () => {
        if (!posts || posts.length === 0) return 0;
        return posts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
    };

    const totalViews = () => {
        if (!posts || posts.length === 0) return 0;
        return posts.reduce((sum, post) => sum + (post.views || 0), 0);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Profile Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Profile Image */}
                        <div className="relative">
                            <Image
                                src={user.image || profileImg}
                                alt={`${user.username}'s profile`}
                                width={200}
                                height={200}
                                className="rounded-full object-cover border-4 border-gray-100 shadow-lg"
                            />
                            {isOwner &&
                            <Link href={'/userProfileUpdate'}>
                            <Image src={pencile} alt={"update the profile"} className="absolute top-0 right-2 cursor-pointer"/>
                            </Link>
                            }
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-serif font-bold text-black mb-3">
                                {user.username}
                            </h1>
                            {user.bio && (
                                <p className="text-gray-600 text-lg leading-relaxed mb-6 max-w-2xl">
                                    {user.bio}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-700">
                                        {posts.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-700">
                                        {totalLikes()}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Likes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-700">
                                        {totalViews()}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Views</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            {posts.length > 0 && (
                <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-6 py-10">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6 tracking-wide">
                            Performance Analytics
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-600 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-green-700 text-2xl font-bold">{avgLikes()}</div>
                                        <div className="text-green-500 text-sm">Avg Likes/Post</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-600 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-green-700 text-2xl font-bold">{avgViews()}</div>
                                        <div className="text-green-500 text-sm">Avg Views/Post</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-600 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-green-700 text-2xl font-bold">
                                            {posts.length > 0 ? Math.round((totalLikes() / totalViews()) * 100) || 0 : 0}%
                                        </div>
                                        <div className="text-green-500 text-sm">Engagement Rate</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-600 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-green-700 text-2xl font-bold">{posts.length}</div>
                                        <div className="text-green-00 text-sm">Total Articles</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts Section */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-serif font-bold text-black mb-8">
                    {posts.length > 0 ? 'Published Articles' : 'No Articles Yet'}
                </h2>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-serif text-black mb-2">No blogs yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {user.username} hasn't published any articles yet. Check back later for new content!
                        </p>
                        <Link href="/createBlog">
                            <button className="bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200">
                                Write a Blog
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};