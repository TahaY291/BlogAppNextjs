"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// ----------------------------------------------------------------------
// 1. Define the fetch utility function OUTSIDE the component.
// It now accepts the postId and the state setter (setComments)
const fetchCommentsData = async (id, setComments) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    
    try {
        const res = await fetch(
            `${apiUrl}/api/comments/${id}`,
            {
                cache: "no-store",
            }
        );

        if (!res.ok) {
            const error = await res.json();
            const errorMessage = error.message || `Failed to fetch comments (Status: ${res.status})`;
            throw new Error(errorMessage);
        }

        const responseData = await res.json();
        // Assuming your API returns { data: [...] } or just an array
        const comments = responseData.data || responseData; 
        
        // 2. Correctly set the state with the fetched array
        if (Array.isArray(comments)) {
            setComments(comments);
        } else if (Array.isArray(comments.comments)) {
            // Fallback in case the API structure is slightly nested (e.g., { comments: [...] })
            setComments(comments.comments);
        } else {
            console.error("Fetched data is not a valid array of comments.");
        }


    } catch (error) {
        console.error("Error fetching comments:", error);
        // Note: We don't re-throw here, as this function is called inside useEffect.
    }
};
// ----------------------------------------------------------------------

export default function BlogDetail({ initialBlog }) {
    const [blog, setBlog] = useState(initialBlog);
    const [liked, setLiked] = useState(initialBlog.isLiked || false);
    const [comment, setComment] = useState("");
    
    // Initialize comments with data fetched from the initial server render
    const [comments, setComments] = useState(blog.comments || []);

    // 3. Fetch comments when the component mounts (client-side)
    useEffect(() => {
        // Use the utility function defined above
        fetchCommentsData(blog._id, setComments);
    }, [blog._id]); // Run once when the component mounts

    const handleLike = async () => {
        try {
            const res = await fetch(`/api/likes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId: blog._id }),
            });

            if (!res.ok) throw new Error("Failed to like post");

            const data = await res.json();
            setLiked(data.liked);
            setBlog((prev) => ({
                ...prev,
                likesCount: Math.max(
                    0,
                    data.liked ? prev.likesCount + 1 : prev.likesCount - 1
                ),
            }));
        } catch (error) {
            console.error("Failed to like:", error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const res = await fetch(`/api/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: blog._id, 
                    comment,
                }),
            });

            if (!res.ok) throw new Error("Failed to post comment");

            const data = await res.json();

            // Ensure the comment object has the necessary 'user' structure 
            // before adding it, if your API response includes user details.
            if (data.comment) {
                setComments((prev) => [data.comment, ...prev]); // Prepend new comment
                setBlog((prev) => ({
                    ...prev,
                    commentsCount: prev.commentsCount + 1,
                }));
            }
            setComment("");
        } catch (error) {
            console.error("Failed to comment:", error);
        }
    };
    
    // Removed the inline fetchComments function and the onClick handler 
    // on the <h2>, as fetching is now done on mount (useEffect)

    return (
        <div className="bg-gray-50 min-h-screen">
            <article className="max-w-4xl mx-auto px-6 py-12">
                {/* Cover Image */}
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
                    <Image
                        src={blog.coverImg}
                        fill
                        alt={blog.title}
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Blog Header */}
                <div className="bg-white rounded-lg p-8 mb-6 shadow-sm border border-gray-200">
                    {/* Tags */}
                    {blog.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
                        {blog.title}
                    </h1>

                    {/* Author Info */}
                    <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
                        <div className="flex items-center gap-3">
                            {blog.author?.image && (
                                <Image
                                    src={blog.author.image}
                                    width={48}
                                    height={48}
                                    alt={blog.author.username}
                                    className="rounded-full"
                                />
                            )}
                            <div>
                                <p className="font-semibold text-black">
                                    {blog.author?.username || "Anonymous"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${liked
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill={liked ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span className="font-medium">{blog.likesCount || 0}</span>
                        </button>
                    </div>
                </div>

                {/* Blog Content */}
                <div className="bg-white rounded-lg p-8 mb-6 shadow-sm border border-gray-200">
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                    {/* The fetch is now handled in useEffect, so no onClick needed here */}
                    <h2
                        className="text-2xl font-serif font-bold text-black mb-6"
                    >
                        Comments ({comments.length})
                    </h2>

                    {/* Comment Form */}
                    <form onSubmit={handleComment} className="mb-8">
                        <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts..."    
                            className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600 resize-none"
                            required
                        />
                        <button
                            type="submit"
                            className="mt-3 bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                        >
                            Post Comment
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map((c, index) => (
                                <div
                                    key={index}
                                    className="border-b border-gray-200 pb-4 last:border-0"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* FIX: Changed c.user to c.userId based on API response */}
                                        {c.userId?.profilePic && (
                                            <Image
                                                src={c.userId.profilePic}
                                                width={40}
                                                height={40}
                                                alt={c.userId.username}
                                                className="rounded-full"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-black">
                                                    {/* FIX: Changed c.user to c.userId */}
                                                    {c.userId?.username || "Anonymous"}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {/* FIX: Changed c.text to c.comment based on API response */}
                                            <p className="text-gray-700">{c.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
}
