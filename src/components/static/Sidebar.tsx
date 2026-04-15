// import React from 'react'
import { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { LuFileAudio } from "react-icons/lu";
import { AiTwotonePicture } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { FiLogOut, FiLock, FiUserPlus } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import axios from 'axios';
import { url } from '../../utils/Api';

const Sidebar = () => {
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      navigate('/');
      return;
    }

    setLogoutLoading(true);
    
    try {
      const response = await axios.post(
        `${url}/admin/logout`,
        { Token: token },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/');
      } else {
        console.error('Logout failed:', response.data.message);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      navigate('/');
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] p-[20px] text-white font-bold flex flex-col gap-6 pt-[120px] bg-[#23a1db bg-[#28166f]">
      <NavLink 
        to="/dashboard"
        end
        className={({ isActive }) => 
          isActive ? "bg-white/20 rounded-lg px-3 py-2" : "px-3 py-2 hover:bg-white/10 rounded-lg transition-all duration-200"
        }
      >
        <ol className="cursor-pointer text-white flex gap-2 items-center">
          <span className=""><FaUsers /></span>All First Timers
        </ol>
      </NavLink>

      <NavLink 
        to="/dashboard/upload"
        className={({ isActive }) => 
          isActive ? "bg-white/20 rounded-lg px-3 py-2" : "px-3 py-2 hover:bg-white/10 rounded-lg transition-all duration-200"
        }
      >
        <ol className="cursor-pointer text-white flex gap-2 items-center">
          <span className=""><AiTwotonePicture /></span>Upload Gallery
        </ol>
      </NavLink>

      <NavLink 
        to="/dashboard/uploadblog"
        className={({ isActive }) => 
          isActive ? "bg-white/20 rounded-lg px-3 py-2" : "px-3 py-2 hover:bg-white/10 rounded-lg transition-all duration-200"
        }
      >
        <ol className="cursor-pointer text-white flex gap-2 items-center">
          <span className=""><LuFileAudio /></span>Upload Blog
        </ol>
      </NavLink>

      <NavLink 
        to="/dashboard/bookings"
        className={({ isActive }) => 
          isActive ? "bg-white/20 rounded-lg px-3 py-2" : "px-3 py-2 hover:bg-white/10 rounded-lg transition-all duration-200"
        }
      >
        <ol className="cursor-pointer text-white flex gap-2 items-center">
          <span className=""><TbBrandBooking /></span>All Bookings
        </ol>
      </NavLink>

      {/* Admin Management Section */}
      <div className="pt-4 mt-2 border-t border-white/20">
        <p className="text-xs text-white/60 mb-3 px-3">ADMIN MANAGEMENT</p>
        
        <NavLink 
          to="/dashboard/change-password"
          className={({ isActive }) => 
            isActive ? "bg-white/20 rounded-lg px-3 py-2" : "px-3 py-2 hover:bg-white/10 rounded-lg transition-all duration-200"
          }
        >
          <ol className="cursor-pointer text-white flex gap-2 items-center">
            <span className=""><FiLock /></span>Change Password
          </ol>
        </NavLink>

        <NavLink 
          to="/dashboard/create-admin"
          className={({ isActive }) => 
            isActive ? "bg-white/20 rounded-lg px-3 py-2" : "px-3 py-2 hover:bg-white/10 rounded-lg transition-all duration-200"
          }
        >
          <ol className="cursor-pointer text-white flex gap-2 items-center">
            <span className=""><FiUserPlus /></span>Create Admin
          </ol>
        </NavLink>
      </div>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full cursor-pointer text-white flex gap-2 items-center px-3 py-2 hover:bg-white/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className=""><FiLogOut /></span>
          {logoutLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Logging out...
            </>
          ) : (
            'Logout'
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar