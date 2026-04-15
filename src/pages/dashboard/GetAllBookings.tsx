import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaCalendarAlt, 
  FaUser, 
//   FaEnvelope, 
//   FaPhone, 
//   FaUsers, 
  FaClock, 
//   FaInfoCircle,
//   FaChurch,
  FaSearch,
  FaTimes,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
//   FaChartBar,
//   FaFilter,
//   FaDownload,
//   FaThumbsUp,
//   FaThumbsDown,
  FaBan,
//   FaUndo,
//   FaBuilding,
//   FaCalendarCheck,
//   FaPercent,
//   FaArrowLeft
} from 'react-icons/fa'
import axios from 'axios'
import { url } from '../../utils/Api'

interface Booking {
  _id: string
  name: string
  email: string
  contactNumber: string
  proposedDate: string
  eventType: string
  expectedGuests: number
  eventStartTime: string
  eventEndTime: string
  additionalNotes?: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  adminNotes?: string
  referenceId: string
  createdAt: string
  updatedAt: string
}

interface BookingStats {
  total: number
  pending: number
  approved: number
  rejected: number
  cancelled: number
  monthlyStats: Array<{
    month: string
    count: number
  }>
  recentActivity: Array<{
    action: string
    bookingId: string
    userName: string
    timestamp: string
  }>
}

const GetAllBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<BookingStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [statusUpdateData, setStatusUpdateData] = useState<{
    bookingId: string;
    status: string;
    adminNotes: string;
  }>({ bookingId: '', status: '', adminNotes: '' })
  const [actionLoading, setActionLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null)

  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToast({ show: true, type, title, message })
    setTimeout(() => setToast(null), 5000)
  }

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/book/admin`)
      if (response.data.success) {
        setBookings(response.data.data)
      }
      console.log("all-book", response)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      showToast('error', 'Error', 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  // Fetch booking statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${url}/book/admin/stats`)
      if (response.data.success) {
        setStats(response.data.data)
      }
      console.log("stats", response)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Update booking status
  const updateBookingStatus = async () => {
    if (!statusUpdateData.bookingId || !statusUpdateData.status) return
    
    setActionLoading(true)
    try {
      const response = await axios.put(
        `${url}/book/admin/${statusUpdateData.bookingId}/status`,
        {
          status: statusUpdateData.status,
          adminNotes: statusUpdateData.adminNotes
        }
      )

      console.log('status', response)
      
      if (response.data.success) {
        showToast('success', 'Success', `Booking ${statusUpdateData.status} successfully`)
        fetchBookings()
        fetchStats()
        setShowStatusModal(false)
        setStatusUpdateData({ bookingId: '', status: '', adminNotes: '' })
      }
    } catch (error: any) {
      console.error('Error updating status:', error)
      showToast('error', 'Error', error.response?.data?.message || 'Failed to update status')
    } finally {
      setActionLoading(false)
    }
  }

  // Delete booking
  const deleteBooking = async () => {
    if (!selectedBooking) return
    
    setActionLoading(true)
    try {
      const response = await axios.delete(`${url}/book/admin/${selectedBooking._id}`)

      console.log('deleted', response)
      
      if (response.data.success) {
        showToast('success', 'Deleted', 'Booking deleted successfully')
        fetchBookings()
        fetchStats()
        setShowDeleteModal(false)
        setSelectedBooking(null)
      }
    } catch (error: any) {
      console.error('Error deleting booking:', error)
      showToast('error', 'Error', error.response?.data?.message || 'Failed to delete booking')
    } finally {
      setActionLoading(false)
    }
  }

  // Get single booking details
  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await axios.get(`${url}/book/admin/${id}`)
      if (response.data.success) {
        setSelectedBooking(response.data.data)
        setShowDetailsModal(true)
      }
      console.log('book-details', response)
    } catch (error) {
      console.error('Error fetching booking details:', error)
      showToast('error', 'Error', 'Failed to fetch booking details')
    }
  }

  useEffect(() => {
    fetchBookings()
    fetchStats()
  }, [])

  // Filter and search bookings
  const filteredBookings = bookings.filter(booking => {
  const matchesSearch = 
    (booking.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (booking.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (booking.referenceId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (booking.eventType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  
  const matchesStatus = statusFilter === 'all' || (booking.status && booking.status === statusFilter)
  
  return matchesSearch && matchesStatus
})

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
      approved: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: FaTimes },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: FaBan }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2 ${config.color}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-mont">
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
      <div className="bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white py-8 px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Booking Management</h1>
          <p className="text-gray-200">Manage and track all facility booking requests</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaCalendarAlt className="text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaClock className="text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCheckCircle className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <FaTimes className="text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <FaBan className="text-gray-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, reference ID, or event type..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setCurrentPage(1)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">S/N</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Guests</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FaSpinner className="animate-spin mx-auto text-4xl text-[#28166f]" />
                    </td>
                  </tr>
                ) : currentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  currentBookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {booking.eventType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div>{formatDate(booking.proposedDate)}</div>
                        <div className="text-xs text-gray-500">
                          {formatTime(booking.eventStartTime)} - {formatTime(booking.eventEndTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {booking.expectedGuests}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => fetchBookingDetails(booking._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => {
                              setStatusUpdateData({
                                bookingId: booking._id,
                                status: booking.status,
                                adminNotes: booking.adminNotes || ''
                              })
                              setShowStatusModal(true)
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Update Status"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                <FaChevronLeft className="inline mr-1" size={12} />
                Previous
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Next
                <FaChevronRight className="inline ml-1" size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Booking Details</h2>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>
                  <p className="text-gray-200 mt-1">Booking ID: <span className='text-[#93d412]'>{selectedBooking._id}</span></p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FaUser className="text-[#28166f]" />
                        Personal Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p className='text-[#000000]'><strong className="text-[#000000]">Name:</strong> {selectedBooking.name}</p>
                        <p className='text-[#000000]'><strong className="text-gray-700">Email:</strong> {selectedBooking.email}</p>
                        <p className='text-[#000000]'><strong className="text-gray-700">Contact:</strong> {selectedBooking.contactNumber}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FaCalendarAlt className="text-[#28166f]" />
                        Event Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p className='text-[#000000]'><strong className="text-gray-700">Event Type:</strong> {selectedBooking.eventType}</p>
                        <p className='text-[#000000]'><strong className="text-gray-700">Date:</strong> {formatDate(selectedBooking.proposedDate)}</p>
                        <p className='text-[#000000]'><strong className="text-gray-700">Time:</strong> {formatTime(selectedBooking.eventStartTime)} - {formatTime(selectedBooking.eventEndTime)}</p>
                        <p className='text-[#000000]'><strong className="text-gray-700">Expected Guests:</strong> {selectedBooking.expectedGuests}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedBooking.additionalNotes && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">Additional Notes</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{selectedBooking.additionalNotes}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Status Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className='text-[#000000]'><strong className="text-gray-700">Current Status:</strong> <StatusBadge status={selectedBooking.status} /></p>
                      {selectedBooking.adminNotes && (
                        <p className='text-[#000000]'><strong className="text-gray-700">Admin Notes:</strong> {selectedBooking.adminNotes}</p>
                      )}
                      <p  className='text-[#000000]'><strong className="text-gray-700">Submitted:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                      <p className='text-[#000000]'><strong className="text-gray-700">Last Updated:</strong> {new Date(selectedBooking.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Update Status Modal */}
        <AnimatePresence>
          {showStatusModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowStatusModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Update Booking Status</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Status</label>
                    <select
                      value={statusUpdateData.status}
                      onChange={(e) => setStatusUpdateData({ ...statusUpdateData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Admin Notes (Optional)</label>
                    <textarea
                      value={statusUpdateData.adminNotes}
                      onChange={(e) => setStatusUpdateData({ ...statusUpdateData, adminNotes: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#28166f] focus:ring-2 focus:ring-[#28166f]/20 outline-none resize-none"
                      placeholder="Add notes about this status update..."
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowStatusModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateBookingStatus}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-70"
                    >
                      {actionLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Update Status'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Delete Booking</h2>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete this booking from <strong>{selectedBooking.name}</strong>?
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    This action cannot be undone.
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={deleteBooking}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70"
                    >
                      {actionLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Delete'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GetAllBookings