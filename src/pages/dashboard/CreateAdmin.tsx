import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaUserPlus, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaTimes,
  FaUserShield,
  FaUser,
//   FaTrash,
//   FaEdit,
  FaSearch
} from 'react-icons/fa'
import axios from 'axios'
import { url } from '../../utils/Api'

interface Admin {
  _id: string
  email: string
  role: 'superAdmin' | 'admin'
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

const CreateAdmin = () => {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null)

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message })
    setTimeout(() => setToast(null), 5000)
  }

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      const response = await axios.get(`${url}/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.data.success) {
        setAdmins(response.data.admins)
        console.log("admins", response)
      }
    } catch (error: any) {
      console.error('Error fetching admins:', error)
      showToast('error', 'Error', error.response?.data?.message || 'Failed to fetch admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm the password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showToast('error', 'Validation Error', 'Please fix the errors before submitting')
      return
    }
    
    setSubmitting(true)
    const token = localStorage.getItem('adminToken')
    
    try {
      const response = await axios.post(
        `${url}/admin/create`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.data.success) {
        showToast('success', 'Success', `Admin created successfully with role: ${formData.role}`)
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          role: 'admin'
        })
        setShowCreateModal(false)
        fetchAdmins()
      }
    } catch (error: any) {
      console.error('Create admin error:', error)
      if (error.response?.status === 409) {
        showToast('error', 'Error', 'Admin with this email already exists')
      } else if (error.response?.status === 403) {
        showToast('error', 'Access Denied', 'Only Super Administrators can create new admins')
      } else {
        showToast('error', 'Error', error.response?.data?.message || 'Failed to create admin')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Filter admins based on search
  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    if (role === 'superAdmin') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          <FaUserShield size={10} />
          Super Admin
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        <FaUser size={10} />
        Admin
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 pt-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast?.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 w-96 rounded-xl shadow-2xl p-4 ${
              toast.type === 'success' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500'
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {toast.type === 'success' ? <FaCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{toast.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
              </div>
              <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#28166f] to-[#3a2a8a] rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUserShield className="text-3xl" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Admin Management</h1>
                <p className="text-gray-200 mt-1">Manage system administrators and their roles</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
            >
              <FaUserPlus />
              Create Admin
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none"
            />
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">S/N</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <FaSpinner className="animate-spin mx-auto text-4xl text-[#28166f]" />
                    </td>
                  </tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin, index) => (
                    <motion.tr
                      key={admin._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{admin.email}</td>
                      <td className="px-6 py-4">{getRoleBadge(admin.role)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(admin.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Admin Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Create New Admin</h2>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>
                  <p className="text-gray-200 mt-1">Add a new administrator to the system</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="bloc text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaEnvelope className="text-[#28166f]" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none`}
                      placeholder="admin@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="bloc text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaLock className="text-[#28166f]" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        } focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none pr-10`}
                        placeholder="Enter password (min. 6 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#28166f]"
                      >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="bloc text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaLock className="text-[#28166f]" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        } focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none pr-10`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#28166f]"
                      >
                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="bloc text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FaUserShield className="text-[#28166f]" />
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="superAdmin">Super Admin</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Super Admins have full access including creating other admins
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaUserPlus />
                          Create Admin
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CreateAdmin