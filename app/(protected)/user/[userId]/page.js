import { UserDetail } from '@/components/UserDetail'
import React from 'react'
import { headers } from "next/headers";

async function getUserData(id) {
  try {
    const headersInstance = await headers(); 
    const cookieHeader = headersInstance.get("cookie") || "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/user/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      }
    })
    
    if (!res.ok) {
      const error = await res.json()
      console.log(error)
      throw new Error(error.message || 'Failed to fetch userData')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error in getBlogData:', error)
    throw error
  }
}


const page = async ({ params }) => {
  const { userId } =await params; 
  const userData = await getUserData(userId);
  return (
    <div>
      <UserDetail user={userData.user} posts={userData.posts} />
    </div>
  );
};


export default page
