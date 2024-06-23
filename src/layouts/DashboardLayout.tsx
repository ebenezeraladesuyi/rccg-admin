// import React, { ReactNode } from 'react'

import { Header } from "../components"
import Sidebar from '../components/static/Sidebar'
import { Outlet } from 'react-router-dom'

// interface AdminDashProps {
//     children : ReactNode
// }

const DashboardLayout = () => {
  return (
    <div className='w-full min-h-screen flex flex-col'>
        <div className='w-full'>
            <Header />
        </div>

        <div className='w-full min-h-screen flex justify-betwee'>
            <div className='fixed min-h-screen w-[300px] '>
                <Sidebar />
            </div>

            <div className='w-[calc(100%-310px)] ml-[260px] min-h-screen bg-white'>
                {/* {children} */}
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default DashboardLayout;