import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { iBlog } from '../../types/Interface'
import axios from 'axios'
import { url } from '../../utils/Api'
import { DatasIsaLoading } from '../isLoading/DataIsLoading'
import { FaTrash, FaSpinner } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface BlogSummary {
    _id: string
    title: string
    author: string
    createdAt: string
    blogImage?: string
}

const UploadBlog = () => {
    const [formData, setFormData] = useState<iBlog>({
        blogImage: '',
        author: '',
        title: '',
        details: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [blogs, setBlogs] = useState<BlogSummary[]>([])
    const [loadingBlogs, setLoadingBlogs] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Fetch blog summaries
    const fetchBlogSummaries = async () => {
        setLoadingBlogs(true)
        try {
            const response = await axios.get(`${url}/blog/getblogsummary`)
            setBlogs(response.data)
        } catch (error) {
            console.error('Failed to fetch blog summaries:', error)
            toast.error('Failed to load blog list')
        } finally {
            setLoadingBlogs(false)
        }
    }

    useEffect(() => {
        fetchBlogSummaries()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Create FormData to send both file and other form data
            const formDataToSend = new FormData()
            formDataToSend.append('title', formData.title)
            if (formData.blogImage) {
                formDataToSend.append('blogImage', formData.blogImage)
            }
            formDataToSend.append('author', formData.author)
            formDataToSend.append('details', formData.details)

            const response = await axios.post(`${url}/blog/creatblog`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.log('Blog uploaded successfully:', response.data)

            // Reset form
            setFormData({
                blogImage: '',
                author: '',
                title: '',
                details: '',
            })
            setError(null)

            // Refresh blog list
            fetchBlogSummaries()

            toast.success('Blog uploaded successfully!')

        } catch (error) {
            console.error('Failed to upload blog:', error)
            setError('Failed to upload blog')
            toast.error('Error uploading blog. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target

        // For file input, update formData with the file itself
        if (name === 'blogImage' && files) {
            setFormData({ ...formData, blogImage: files[0] })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleDeleteBlog = async (id: string, title: string) => {
        // Confirmation using react-toastify
        toast(
            ({ closeToast }) => (
                <div className="flex flex-col gap-3 p-2">
                    <h3 className="font-bold text-lg text-gray-800">Delete Confirmation</h3>
                    <p className="text-gray-600">
                        Are you sure you want to delete the blog: <br />
                        <span className="font-semibold text-red-600">"{title}"</span>?
                    </p>
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => {
                                closeToast()
                                performDelete(id)
                            }}
                            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Yes, Delete
                        </button>
                        <button
                            onClick={closeToast}
                            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
                className: "w-full max-w-md"
            }
        )
    }

    const performDelete = async (id: string) => {
        setDeletingId(id)
        // console.log("to-delete-id", id)
        try {
            await axios.delete(`${url}/blog/deleteoneblog/${id}`)
            
            // Remove from local state
            setBlogs(prev => prev.filter(blog => blog._id !== id))
            
            toast.success('Blog deleted successfully!')
            
        } catch (error) {
            console.error('Failed to delete blog:', error)
            toast.error('Failed to delete blog. Please try again.')
        } finally {
            setDeletingId(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="md:w-[80%] min-h-screen bg-white p-6 mt-[100px] ml-[100px] text-[#000000]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
                    <p className="text-gray-600">Upload new blogs and manage existing ones</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Upload Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Blog</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#23a1db] focus:ring-2 focus:ring-[#23a1db]/20 outline-none transition-all duration-300 bg-white"
                                    placeholder="Enter blog title"
                                />
                            </div>

                            {/* Author */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#23a1db] focus:ring-2 focus:ring-[#23a1db]/20 outline-none transition-all duration-300 bg-white"
                                    placeholder="Enter author name"
                                />
                            </div>

                            {/* Image File */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Blog Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    name="blogImage"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#23a1db] focus:ring-2 focus:ring-[#23a1db]/20 outline-none transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#23a1db] file:text-white hover:file:bg-[#1c8cc7]"
                                />
                            </div>

                            {/* Details */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Details</label>
                                <input
                                    type="text"
                                    name="details"
                                    value={formData.details}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#23a1db] focus:ring-2 focus:ring-[#23a1db]/20 outline-none transition-all duration-300 bg-white"
                                    placeholder="Enter blog details/content"
                                />
                            </div>

                            {/* Submit Button */}
                            {loading ? (
                                <div className="w-full flex items-center justify-center py-4">
                                    <DatasIsaLoading />
                                </div>
                            ) : (
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#23a1db] to-[#33a866] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Upload Blog
                                </motion.button>
                            )}

                            {error && (
                                <p className="text-red-600 text-sm text-center mt-2">{error}</p>
                            )}
                        </form>
                    </motion.div>

                    {/* Right Column - Blog List */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 h-fit"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Existing Blogs</h2>
                            <button
                                onClick={fetchBlogSummaries}
                                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Refresh
                            </button>
                        </div>

                        {loadingBlogs ? (
                            <div className="flex justify-center items-center py-12">
                                <DatasIsaLoading />
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-5xl mb-4">📝</div>
                                <h3 className="text-gray-600 font-medium mb-2">No blogs yet</h3>
                                <p className="text-gray-500 text-sm">Upload your first blog to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                <AnimatePresence>
                                    {blogs.map((blog, index) => (
                                        <motion.div
                                            key={blog._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                {/* Blog Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        {blog.blogImage && (
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                                <img
                                                                    src={blog.blogImage}
                                                                    alt={blog.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 truncate">
                                                                {blog.title}
                                                            </h3>
                                                            <div className="flex items-center gap-4 mt-1">
                                                                <span className="text-sm text-gray-600">
                                                                    By {blog.author}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {formatDate(blog.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-mono">
                                                        ID: {blog._id.substring(0, 12)}...
                                                    </p>
                                                </div>

                                                {/* Delete Button */}
                                                <div className="flex-shrink-0">
                                                    <motion.button
                                                        onClick={() => handleDeleteBlog(blog._id, blog.title)}
                                                        disabled={deletingId === blog._id}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete Blog"
                                                    >
                                                        {deletingId === blog._id ? (
                                                            <FaSpinner className="animate-spin" />
                                                        ) : (
                                                            <FaTrash />
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Stats */}
                        {blogs.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Total Blogs: <span className="font-bold">{blogs.length}</span></span>
                                    <span className="text-xs text-gray-500">
                                        Click the trash icon to delete a blog
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default UploadBlog