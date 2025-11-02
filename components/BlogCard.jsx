import React from "react";
import Image from "next/image";
import Link from "next/link";
import unliked from "@/public/unliked.svg";
import liked from "@/public/liked.svg";
import comment from "@/public/comment.svg";

const BlogCard = ({ blog }) => {
    console.log(blog.tags)
    return (
        <>
            <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                {/* Cover Image */}
                <Link href={`/${blog._id}`} key={blog._id}>
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                        <Image
                            src={blog.coverImg}
                            fill
                            alt={blog.title}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </Link>
                {/* Content */}
                <div className="p-6">
                    {/* Tags */}
                    {blog.tags && (
                        <div className="flex flex-wrap gap-2 mb-3">
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

                    <Link href={`/${blog._id}`} key={blog._id}>
                        <h3 className="text-xl font-serif font-semibold text-black mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                            {blog.title}
                        </h3>

                        {blog.content && (
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {blog.content.replace(/<[^>]*>/g, "").substring(0, 120)}
                                ...
                            </p>
                        )}

                    </Link>
                    {/* Author & Date */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                {!blog.isLiked ? <Image src={unliked} alt="unlike" /> : <Image src={liked} alt="likes" />}
                                <span className="absolute -right-2 bottom-0">{blog.likesCount > 0 ? `  ${blog.likesCount} 
                            `: ""}</span>
                            </div>
                        </div>
                        {blog.createdAt && <div className="relative">
                            <Image src={comment} alt="comment" />
                            <span className="absolute -right-2 bottom-0">{blog.commentsCount > 0 ? `  ${blog.commentsCount} 
                            `: ""}</span>
                        </div>}
                    </div>
                </div>
            </article>

        </>
    );
};

export default BlogCard;
