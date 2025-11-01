// app/page.js
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import main from '@/public/main.jpg'
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // if no user logged in → redirect to login
    redirect("/login");
  }

  return (
    <main>
      <section className="min-h-screen">
        <div className="relative w-full h-[80vh]">
          {/* Image */}
          <Image 
            src={main} 
            alt='DevSphere Hero Image' 
            fill
            className="object- rounded-xl"
            priority
          />
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0  rounded-xl"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 max-w-4xl leading-tight">
              Welcome to DevSphere, we write about technology, people and culture
            </h1>
            <Link href={'/createBlog'}>
            <button  className="cursor-pointer bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-md text-base font-medium transition-colors duration-200">
              Write Blog
            </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}