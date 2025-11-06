'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import upload_area from '@/public/upload_area.png'
import Image from 'next/image'

const EditProfilePage = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [formData, setFormData] = useState({
        bio: '',
        image: null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [user, setUser] = useState(null)

    // Fetch user data on mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.id) return

            try {
                const res = await fetch(`/api/user/${session.user.id}`)
                const data = await res.json()
                setUser(data)
                setFormData({
                    bio: data.user.bio || '',
                    image: null
                })
            } catch (error) {
                console.error('Failed to fetch user data:', error)
            }
        }

        fetchUserData()
    }, [session])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const fd = new FormData()
            fd.append('bio', formData.bio)
            if (formData.image) {
                fd.append("image", formData.image);
            }

            const res = await fetch(`/api/user/${session.user.id}`, {
                method: 'PUT',
                body: fd,
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || 'Failed to update profile')
            }

            const data = await res.json()

            // Redirect to profile page
            router.push(`/user/${session.user.id}`)
        } catch (error) {
            console.error('Failed to update profile:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (files) {
            setFormData((prev) => ({ ...prev, image: files[0] }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleCancel = () => {
        router.back()
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Please login to edit your profile</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">
                        Edit Your <span className="text-green-600">Profile</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Update your profile information
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-200">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                            <p className="font-semibold mb-1">Error:</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Current Profile Image Preview */}
                        {user?.image && !formData.image && (
                            <div className="text-center">
                                <label className="block text-lg font-semibold text-gray-800 mb-3">
                                    Current Profile Picture
                                </label>
                                <Image
                                    src={user.image}
                                    alt="Current profile"
                                    width={150}
                                    height={150}
                                    className="rounded-full object-cover mx-auto border-4 border-gray-100"
                                />
                            </div>
                        )}

                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="block text-lg font-semibold text-gray-800 mb-3">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                id="bio"
                                rows={5}
                                placeholder="Tell us about yourself..."
                                onChange={handleChange}
                                value={formData.bio}
                                required
                                className="w-full border border-gray-300 p-4 rounded-md text-base focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600 resize-none"
                            />
                            <p className="text-gray-500 text-sm mt-2">
                                {formData.bio.length} characters
                            </p>
                        </div>

                        {/* Profile Picture Upload */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-800 mb-3">
                                Upload New Profile Picture
                            </label>
                            <label htmlFor="image" className="cursor-pointer block">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-600 transition-colors">
                                    <Image
                                        src={
                                            formData.image
                                                ? URL.createObjectURL(formData.image)
                                                : upload_area
                                        }
                                        alt="upload"
                                        className="object-contain rounded-lg max-h-64 w-auto mx-auto"
                                        width={500}
                                        height={500}
                                    />
                                </div>
                            </label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                            <p className="text-gray-500 text-sm mt-2 text-center">
                                Click to upload a new profile picture (JPG, PNG, max 5MB)
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-green-50 border border-green-200 p-6 rounded-md">
                            <h3 className="text-base font-semibold text-green-900 mb-3">
                                💡 Profile Tips
                            </h3>
                            <ul className="text-green-800 text-sm space-y-2">
                                <li>• Write a compelling bio that showcases your expertise</li>
                                <li>• Use a professional profile picture</li>
                                <li>• Keep your information up to date</li>
                                <li>• Make your profile engaging and authentic</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-green-800 hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-md text-base font-medium transition-colors duration-200"
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 py-4 rounded-md text-base font-medium transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>

                {/* Guidelines */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-serif text-black mb-4">Profile Guidelines</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Your profile represents you in the DevSphere community. Please ensure your bio and profile picture
                        are appropriate and professional. Inappropriate content will result in profile removal.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EditProfilePage