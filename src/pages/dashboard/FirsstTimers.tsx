import React, { useEffect } from 'react'
import { iFirst } from "../../types/Interface";
import axios from 'axios';
import { url } from '../../utils/Api';
import { DatasIsaLoading } from '../isLoading/DataIsLoading';
import { FaUser, FaMapMarkerAlt, FaBuilding, FaBriefcase, FaPhone, FaMobileAlt, FaEnvelope, FaQuestionCircle, FaPrayingHands, FaTimes, FaUsers, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FirsstTimers = () => {
  const [allFirst, setAllFirst] = React.useState<iFirst[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTimer, setSelectedTimer] = React.useState<iFirst | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    const fetchFirstTimers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/firsttimer/allfirsttimers`);
        setAllFirst(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error getting images:", error);
        setLoading(false);
      }
    };
    fetchFirstTimers();
  }, []);

  // Filter based on search
  const filteredFirstTimers = allFirst.filter(timer => 
    timer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timer?.county?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-[#23a1db] to-[#1e8bc3] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-3xl" />
              <h1 className="text-3xl md:text-4xl font-bold">First-Timers Database</h1>
            </div>
            <p className="text-gray-100">Manage and track all first-time visitors to our church</p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or county..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#23a1db] focus:ring-2 focus:ring-[#23a1db]/20 outline-none transition-all duration-300 bg-white"
            />
          </div>
        </motion.div>

        {/* Stats Cards */}
        {/* <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">Accepted Jesus</p>
      <p className="text-2xl font-bold text-green-600">
        {allFirst.filter(t => t?.haveJesus?.toLowerCase() === 'yes').length}
      </p>
    </div>
    <div className="bg-green-100 p-3 rounded-full">
      <FaCross className="text-green-600 text-xl" />
    </div>
  </div>
</div> */}

{/* <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">Requested Visit</p>
      <p className="text-2xl font-bold text-purple-600">
        {allFirst.filter(t => t?.pastorVisit?.toLowerCase() === 'yes').length}
      </p>
    </div>
    <div className="bg-purple-100 p-3 rounded-full">
      <FaChurch className="text-purple-600 text-xl" />
    </div>
  </div>
</div> */}

        {/* Content */}
        {loading ? (
          <div className='w-full flex justify-center items-center py-20'>
            <DatasIsaLoading />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFirstTimers && filteredFirstTimers.map((timers, index) => (
              <motion.div
                key={timers._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#23a1db] to-[#1e8bc3] p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <FaUser className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{timers?.name || 'N/A'}</h3>
                      <p className="text-sm text-gray-100">{timers?.email || 'No email'}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <FaMapMarkerAlt className="text-[#23a1db] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">Address:</span>
                      <span className="text-gray-600 ml-1">{timers?.address || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <FaBuilding className="text-[#23a1db] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">County:</span>
                      <span className="text-gray-600 ml-1">{timers?.county || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <FaBriefcase className="text-[#23a1db] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">Occupation:</span>
                      <span className="text-gray-600 ml-1">{timers?.occupation || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <FaPhone className="text-[#23a1db] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">Tel (Home):</span>
                      <span className="text-gray-600 ml-1">{timers?.telHome || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <FaPhone className="text-[#23a1db] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">Tel (Work):</span>
                      <span className="text-gray-600 ml-1">{timers?.telWork || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <FaMobileAlt className="text-[#23a1db] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">Mobile:</span>
                      <span className="text-gray-600 ml-1">{timers?.mobile || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <FaEnvelope className="text-[#23a1db] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700">Email:</span>
                      <span className="text-gray-600 ml-1">{timers?.email || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  {/* Status Badges */}
<div className="pt-3 border-t border-gray-100 space-y-2">
  <div className="flex items-center justify-between text-sm">
    <span className="font-semibold text-gray-700">Visiting or Staying:</span>
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      timers?.visitOrStay === 'staying' 
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      {timers?.visitOrStay || 'N/A'}
    </span>
  </div>

  <div className="flex items-center justify-between text-sm">
    <span className="font-semibold text-gray-700">Accepted Jesus:</span>
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      timers?.haveJesus?.toLowerCase() === 'yes'
        ? 'bg-green-100 text-green-700'
        : 'bg-gray-100 text-gray-700'
    }`}>
      {timers?.haveJesus === 'yes' ? 'Yes' : 'No'}
    </span>
  </div>

  <div className="flex items-center justify-between text-sm">
    <span className="font-semibold text-gray-700">Request Pastor Visit:</span>
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      timers?.pastorVisit?.toLowerCase() === 'yes'
        ? 'bg-purple-100 text-purple-700'
        : 'bg-gray-100 text-gray-700'
    }`}>
      {timers?.pastorVisit === 'yes' ? 'Yes' : 'No'}
    </span>
  </div>
</div>

                  {/* Prayer Request */}
                  {timers?.prayerRequest && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <FaPrayingHands className="text-[#23a1db] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-gray-700 text-sm">Prayer Request:</span>
                          <p className="text-gray-600 text-sm mt-1">{timers.prayerRequest}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedTimer(timers);
                      setShowModal(true);
                    }}
                    className="w-full py-2 bg-[#23a1db] text-white rounded-lg hover:bg-[#1e8bc3] transition-colors text-sm font-medium"
                  >
                    View Full Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredFirstTimers.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
              <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No first-timers found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Full Details */}
      {showModal && selectedTimer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-[#23a1db] to-[#1e8bc3] text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Visitor Details</h2>
                <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200">
                  <FaTimes size={24} />
                </button>
              </div>
              <p className="text-gray-100 mt-1">Complete information about {selectedTimer.name}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-[#23a1db]" />
                    Personal Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong className="text-gray-700">Name:</strong> {selectedTimer.name}</p>
                    <p><strong className="text-gray-700">Email:</strong> {selectedTimer.email}</p>
                    <p><strong className="text-gray-700">Address:</strong> {selectedTimer.address}</p>
                    <p><strong className="text-gray-700">County:</strong> {selectedTimer.county}</p>
                    <p><strong className="text-gray-700">Occupation:</strong> {selectedTimer.occupation}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaPhone className="text-[#23a1db]" />
                    Contact Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong className="text-gray-700">Tel (Home):</strong> {selectedTimer.telHome || 'N/A'}</p>
                    <p><strong className="text-gray-700">Tel (Work):</strong> {selectedTimer.telWork || 'N/A'}</p>
                    <p><strong className="text-gray-700">Mobile:</strong> {selectedTimer.mobile || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaQuestionCircle className="text-[#23a1db]" />
                  Spiritual Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
  <span className="font-semibold text-gray-700">Accepted Jesus as Saviour:</span>
  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
    selectedTimer.haveJesus?.toLowerCase() === 'yes'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700'
  }`}>
    {selectedTimer.haveJesus === 'yes' ? 'Yes' : 'No'}
  </span>
</div>

<div className="flex justify-between items-center">
  <span className="font-semibold text-gray-700">Would like Pastor to visit:</span>
  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
    selectedTimer.pastorVisit?.toLowerCase() === 'yes'
      ? 'bg-purple-100 text-purple-700'
      : 'bg-gray-100 text-gray-700'
  }`}>
    {selectedTimer.pastorVisit === 'yes' ? 'Yes' : 'No'}
  </span>
</div>
                  
                  {/* <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Would like Pastor to visit:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTimer.pastorVisit === true || selectedTimer.pastorVisit === 'yes'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedTimer.pastorVisit === true || selectedTimer.pastorVisit === 'yes' ? 'Yes' : 'No'}
                    </span>
                  </div> */}

                  {selectedTimer.prayerRequest && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-start gap-2">
                        <FaPrayingHands className="text-[#23a1db] mt-0.5" />
                        <div>
                          <span className="font-semibold text-gray-700">Prayer Request:</span>
                          <p className="text-gray-600 mt-1">{selectedTimer.prayerRequest}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default FirsstTimers