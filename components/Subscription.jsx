'use client'
import React, { useState } from 'react'

const Newsletter = () => {
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setEmail('')
    }

    return (
        <section className="bg-[#153619] py-20 px-6">
            <div className="ml-auto pr-[10%] flex flex-col w-[45%] text-center">
                <h2 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
                    Get the best sent to your inbox, every month
                </h2>
                
                <p className="text-green-100 text-lg mb-8 max-w-2xl ml-auto">
                    Join our community of curious minds and get exclusive insights into technology, people, and culture delivered straight to your email.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-end items-start sm:items-center">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white sm:w-96 px-6 py-4 rounded-md text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-[#B8E6C3]"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-[#B8E6C3] hover:bg-green-700 text-[#153619] font-medium rounded-md transition-colors duration-200 whitespace-nowrap"
                    >
                        Subscribe
                    </button>
                </form>

                <p className="text-green-200 text-sm mt-4">
                    Once monthly, no spam
                </p>
            </div>
        </section>
    )
}

export default Newsletter