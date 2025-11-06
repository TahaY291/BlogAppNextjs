"use client";
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { common, createLowlight } from 'lowlight';
import upload_area from '@/public/upload_area.png'


const lowlight = createLowlight(common);

const initialState = {
    title: '',
    content: '',
    tags: '',
    image: null
};

const WriteBlog = () => {

    const editorRef = useRef(null)
    const [quillInstance, setQuillInstance] = useState(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState(initialState)

    const handleQuillTextChange = (quillEditor) => {
        const html = quillEditor.root.innerHTML;
        if (html === '<p><br></p>') {
            setFormData((prev) => ({ ...prev, content: '' }));
        } else {
            setFormData((prev) => ({ ...prev, content: html }));
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev) => ({ ...prev, image: files[0] }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const latestContent = quillInstance?.root.innerHTML || formData.content;

        try {
            const fd = new FormData();

            Object.entries({ ...formData, content: latestContent }).forEach(([key, value]) => {
                if (key === 'content' && value === '<p><br></p>') {
                    // Do nothing for empty content
                } else if (value) {
                    fd.append(key, value);
                }
            });

            const res = await fetch("/api/posts", {
                method: "POST",
                body: fd,
            });

            const data = await res.json()

            if (!res.ok) {
                const serverError = data.error;

                let errorMessage = "Post submission failed. Check your inputs.";

                if (serverError && serverError.fieldErrors) {

                    const fieldErrorMessages = Object.entries(serverError.fieldErrors)
                        .flatMap(([key, errors]) =>
                            errors.map(errorMsg => `${key.toUpperCase()}: ${errorMsg}`)
                        );

                    const formErrors = serverError.formErrors || [];

                    errorMessage = [
                        ...formErrors,
                        ...fieldErrorMessages
                    ].join(' | ');

                } else if (data.message) {
                    errorMessage = data.message;
                } else if (typeof serverError === 'string') {
                    errorMessage = serverError;
                }

                throw new Error(errorMessage);
            }

            alert("Blog posted successfully!");
            setFormData(initialState)
            quillInstance?.setText('');
        } catch (error) {
            console.log("Client Catch Error:", error)
            setError(error.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        import('quill').then(({ default: Quill }) => {
            if (editorRef.current && !quillInstance) {

                const toolbarOptions = [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                ];

                const quill = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                        toolbar: toolbarOptions,
                    },
                    placeholder: 'Start writing your blog content here...',
                });

                setQuillInstance(quill);

                quill.on('text-change', (delta, oldDelta, source) => {
                    if (source === 'user') {
                        handleQuillTextChange(quill);
                    }
                });

                if (formData.content) {
                    quill.root.innerHTML = formData.content;
                }
            }
        });

        return () => {

        }
    }, [quillInstance , formData.content]);

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">
                        Write Your <span className="text-green-600">Story</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Share your knowledge and insights with the DevSphere community
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-200">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                            <p className="font-semibold mb-1">Error:</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-lg font-semibold text-gray-800 mb-3">
                                Blog Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Enter an eye-catching title..."
                                onChange={handleChange}
                                value={formData.title}
                                required
                                className="w-full border border-gray-300 p-4 rounded-md text-base focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600"
                            />
                        </div>

                        <div className=''>
                            <label htmlFor="image" className="block text-lg font-semibold text-gray-800 mb-3 cursor-pointer">
                                <Image
                                    src={
                                        !formData.image
                                            ? upload_area
                                            : URL.createObjectURL(formData.image)
                                    }
                                    alt='upload'
                                    className="object-contain rounded-[2xl] max-h-64 w-auto mx-auto"
                                    width={500}
                                    height={500}
                                />
                            </label>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                            <p className="text-gray-500 text-sm mt-2">
                                Upload a cover image for your blog post (JPG, PNG)
                            </p>
                        </div>

                        <div className='relative'>
                            <label htmlFor="content" className="block text-lg  font-semibold text-gray-800 mb-3">Write Blog Content</label>
                            <div
                                ref={editorRef}
                                className="max-h-[60vh] overflow-y-auto bg-white border border-gray-300 rounded-md"
                            >
                                {/* Quill editor initializes here */}
                            </div>
                        </div>


                        <div>
                            <label htmlFor="tags" className="block text-lg font-semibold text-gray-800 mb-3">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                id="tags"
                                placeholder="javascript, react, web-development"
                                onChange={handleChange}
                                value={formData.tags}
                                required
                                className="w-full border border-gray-300 p-4 rounded-md text-base focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600"
                            />
                            <p className="text-gray-500 text-sm mt-2">
                                Separate tags with commas (e.g., AI, Machine Learning, Python). Max 10 tags.
                            </p>
                        </div>

                        <div className="bg-green-50 border border-green-200 p-6 rounded-md">
                            <h3 className="text-base font-semibold text-green-900 mb-3">
                                📝 Writing Tips
                            </h3>
                            <ul className="text-green-800 text-sm space-y-2">
                                <li>• Use clear and concise language</li>
                                <li>• Break content into sections with headings</li>
                                <li>• Include relevant examples and code snippets</li>
                                <li>• Proofread before publishing</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-green-800 hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-md text-base font-medium transition-colors duration-200"
                            >
                                {loading ? "Publishing..." : "Publish Blog"}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-serif text-black mb-4">Community Guidelines</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        All content must be original and follow our community standards. Plagiarism, offensive content,
                        or spam will result in content removal and potential account suspension. Let&apos;ss keep DevSphere
                        a respectful and valuable resource for everyone.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default WriteBlog;