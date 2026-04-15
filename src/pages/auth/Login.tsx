import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaUserShield, FaUser } from 'react-icons/fa'
import axios from 'axios'
import { url } from '../../utils/Api'
import logo from "../../assets/images/Rccg_logo.png"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
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
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showToast('error', 'Validation Error', 'Please fill all required fields correctly')
      return
    }
    
    setLoading(true)
    setErrors({})
    
    try {
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      }
      
      console.log('Logging in:', loginData.email)
      
      const response = await axios.post(`${url}/admin/login`, loginData)
      
    //   console.log('Login response:', response.data)
      
      if (response.data.success) {
        // Store token and admin data in localStorage
        if (response.data.token) {
          localStorage.setItem('adminToken', response.data.token)
        }
        if (response.data.admin) {
          localStorage.setItem('adminData', JSON.stringify(response.data.admin))
        }
        
        // Show role-specific success message
        const role = response.data.admin?.role
        const roleMessage = role === 'superAdmin' 
          ? 'Welcome Super Administrator!' 
          : 'Welcome Administrator!'
        
        showToast('success', 'Login Successful', `${roleMessage} Redirecting to dashboard...`)
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
    //         if (response.data.success) {
    // if (response.data.token) {
    //     localStorage.setItem('adminToken', response.data.token)
    //     console.log('Token stored:', response.data.token.substring(0, 20) + '...')
    // }
    // if (response.data.admin) {
    //     localStorage.setItem('adminData', JSON.stringify(response.data.admin))
    //     console.log('Admin data stored:', response.data.admin)
    // }
      } else {
        showToast('error', 'Login Failed', response.data.message || 'Invalid email or password')
      }
      
    } catch (error: any) {
      console.error('Login error:', error)
      
      if (error.response) {
        const { status, data } = error.response
        
        if (status === 401) {
          showToast('error', 'Authentication Failed', 'Invalid email or password')
        } else if (status === 404) {
          showToast('error', 'Not Found', 'Admin account not found')
        } else {
          showToast('error', `Error ${status}`, data.message || 'Login failed. Please try again.')
        }
      } else if (error.request) {
        showToast('error', 'Connection Error', 'No response from server. Please check your connection.')
      } else {
        showToast('error', 'Login Error', 'Failed to login. Please try again.')
      }
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#ffffff] bg-gradient-to-br from-[#28166f via-[#3a2a8a to-[#23a1db] flex items-center justify-center px-4">
      {/* Toast Notification */}
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
              {toast.type === 'success' ? '✓' : '✗'}
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#28166f] to-[#3a2a8a] p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full mb-4"
            >
              <img src={logo} className='w-[80px]' alt="RCCG Logo" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-200">RCCG Open Heavens, Dublin</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email Field */}
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
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none transition-all duration-300 bg-white text-gray-900`}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
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
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none transition-all duration-300 bg-white text-gray-900 pr-12`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#28166f] transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <FaUserShield size={12} />
                Super Admin
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FaUser size={12} />
                Admin
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login