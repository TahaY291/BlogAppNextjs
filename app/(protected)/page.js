import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import main from '@/public/main.jpg'
import Link from "next/link";
import { headers } from "next/headers";
import BlogCard from "@/components/BlogCard";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
const headersInstance = await headers(); 
  

  const cookieHeader = headersInstance.get("cookie") || "";
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`, {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  const { posts } = await res.json();

  return (
    <main>
      <section className="min-h-screen">
        <div className="relative w-full h-screen">
          <Image
            src={main}
            alt='DevSphere Hero Image'
            className=" object-cover w-screen h-screen rounded-xl"
            priority 
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 max-w-4xl leading-tight">
              Welcome to DevSphere — we write about technology, people, and culture
            </h1>
            <Link href="/createBlog">
              <button className="cursor-pointer bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-md text-base font-medium transition-colors duration-200">
                Write Blog
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">Latest Blogs</h2>
       <div className="max-w-6xl mx-auto px-6 py-12">
  {posts.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  ) : (
    <div className="text-center py-16">
      <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-serif text-black mb-2">No blogs found</h3>
      <p className="text-gray-500 mb-6">Be the first to share your story with the community.</p>
      <Link href="/createBlog">
        <button className="bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200">
          Write a Blog
        </button>
      </Link>
    </div>
  )}
</div>
      </section>
    </main>
  );
}
