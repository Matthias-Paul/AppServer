import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="mx-auto max-w-[1400px] pb-6 pr-[12px] min-h-full flex flex-row relative  ">
      <div
        className={`
            static top-0 left-0  mb-1
             max-w-[300px] text-white min-h-full
          `}
      >
        <Sidebar />
      </div>
      {/* main content */}
      <div className="flex-grow  h-full  mt-4 overflow-auto ">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
