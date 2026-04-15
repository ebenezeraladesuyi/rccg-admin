import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { url } from '../../utils/Api'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null)

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    console.log("token", token)
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message })
    setTimeout(() => setToast(null), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const token = localStorage.getItem('adminToken')
  if (!token) {
    showToast('error', 'Authentication Error', 'No token found. Please login again.')
    setTimeout(() => navigate('/'), 2000)
    return
  }
  
  const validationErrors = validateForm()
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    showToast('error', 'Validation Error', 'Please fix the errors before submitting')
    return
  }
  
  setLoading(true)
  
  try {
    const response = await axios.put(
      `${url}/admin/change-password`,
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword  // Add this field
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (response.data.success) {
      showToast('success', 'Success', 'Password changed successfully')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } else {
      showToast('error', 'Error', response.data.message || 'Failed to change password')
    }
  } catch (error: any) {
    console.error('Password change error:', error)
    if (error.response?.status === 401) {
      showToast('error', 'Error', 'Current password is incorrect')
    } else if (error.response?.status === 403) {
      showToast('error', 'Error', 'Invalid or expired token. Please login again.')
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      setTimeout(() => navigate('/'), 2000)
    } else {
      showToast('error', 'Error', error.response?.data?.message || 'Failed to change password')
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="p-8">
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
              ×
            </button>
          </div>
        </motion.div>
      )}

      <div className="max-w-2xl mx-auto mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-[#28166f] to-[#3a2a8a] p-3 rounded-lg">
              <FaLock className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none transition-all duration-300 pr-12`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#28166f]"
                >
                  {showCurrentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none transition-all duration-300 pr-12`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#28166f]"
                >
                  {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none transition-all duration-300 pr-12`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#28166f]"
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ChangePassword