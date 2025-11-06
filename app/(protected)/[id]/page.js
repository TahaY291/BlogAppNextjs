// app/(protected)/[id]/page.js
import BlogDetail from "@/components/BlogDtails"
import { headers } from "next/headers";

async function getBlogData(id) {
  try {
    const headersInstance = await headers(); 
    const cookieHeader = headersInstance.get("cookie") || "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      }
    })
    
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to fetch blog')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error in getBlogData:', error)
    throw error
  }
}

export default async function BlogPage({ params }) {
   const headersInstance = await headers(); 
    const host = headersInstance.get("cookie") || "";
  try {
    const { id } =await params
    const blog = await getBlogData(id)

    if (!blog || blog.message === "Blog not found") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
            <p className="text-gray-600">The blog you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      )
    }

    return <BlogDetail host={host} initialBlog={blog} />
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }
}