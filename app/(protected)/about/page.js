import Image from 'next/image'
import React from 'react'
import blog1 from '@/public/blog1.jpg'
import blog2 from '@/public/blog2.jpg'
import Subscription from '@/components/Subscription'

const AboutUs = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-4xl md:text-5xl font-serif text-black mb-6  max-w-4xl mx-auto">
                        Inform, inspire, and connect. The three foundations of our written content.
                    </p>
                </div>
            </section>

            <section>
                <div className='flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 py-10 px-6'>
                    <Image
                        src={blog1}
                        alt='Tech blog illustration 1'
                        width={500}
                        height={400}
                        className="rounded-lg w-full md:w-auto max-w-md object-cover"
                    />
                    <Image
                        src={blog2}
                        alt='Tech blog illustration 2'
                        width={500}
                        height={400}
                        className="rounded-lg w-full md:w-auto max-w-md object-cover"
                    />
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Our Story */}
                    <article className=" p-5 rounded-lg ">
                        <h2 className="text-4xl md:text-5xl font-serif text-black mb-6">Our story</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            DevSphere began as a small group of passionate writers and tech enthusiasts who believed in the power of storytelling. We noticed a gap in the media landscape where deep, thoughtful exploration of technology, people, and culture was missing.
                        </p>
                    </article>

                    {/* Wide-reaching Experience */}
                    <article className=" p-5 rounded-lg ">
                        <h2 className="text-3xl md:text-4xl font-serif text-black mb-6">Wide-reaching experience</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            With diverse backgrounds in journalism, technology, and cultural studies, we set out to create a platform that bridges these worlds, providing a space for in-depth analysis, personal stories, and cultural insights. Our journey started in a modest co-working space, but our vision was always expansive – to reach and resonate with a global audience.
                        </p>
                    </article>

                    {/* Where We're Heading */}
                    <article className=" p-5 rounded-lg ">
                        <h2 className="text-3xl md:text-4xl font-serif text-black mb-6">Where are we heading</h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            Over the years, DevSphere has grown from a niche blog to a widely recognised source of thoughtful content. Our team has expanded, bringing in experts and storytellers from various fields, all committed to our mission. We've covered stories from the rise of AI and its ethical implications to the personal narratives of unsung community heroes.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Each article, interview, and feature we publish is crafted with the intention of sparking curiosity, fostering understanding, and encouraging dialogue among our readers.
                        </p>
                    </article>

                    {/* Our Commitment to Quality */}
                    <article className=" p-5 rounded-lg ">
                        <h2 className="text-3xl md:text-4xl font-serif text-black mb-6">Our commitment to quality</h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            At DevSphere, we are dedicated to maintaining the highest standards of quality in our content. Each piece undergoes rigorous research and editorial processes to ensure accuracy and depth. We believe in the importance of diverse perspectives and strive to feature voices from different backgrounds and experiences.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Our commitment to quality is not just about producing well-written articles; it's about creating a trustworthy and engaging space where readers can explore complex topics and find inspiration.
                        </p>
                    </article>



                </div>
            </section>

            <Subscription/>

        </div>
    )
}

export default AboutUs