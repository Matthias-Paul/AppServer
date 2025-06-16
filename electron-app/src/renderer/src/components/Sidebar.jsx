import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FaUser, FaCreditCard, FaChartLine, FaPowerOff, FaRegFileAlt } from 'react-icons/fa'
import { MdOndemandVideo, MdHome } from 'react-icons/md'
import { RiNodeTree } from 'react-icons/ri'
import { FiSettings, FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import { HiHome } from 'react-icons/hi'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <div
      className={`h-full transition-all duration-300 ${isCollapsed ? 'w-[80px]   ' : ' w-[250px] mr-4  xl:w-[280px]  '} bg-[#0D47A1] text-[#E3F2FD] rounded-2xl mx-4 mt-4 overflow-y-auto`}
    >
      <div className="flex justify-between items-center px-4 py-6">
        {!isCollapsed && <span className="text-xl pl-[9px] font-semibold">Church Media</span>}
        <button
          onClick={toggleSidebar}
          className={` ${isCollapsed ? 'm-auto ' : ' mr-0 '} cursor-pointer text-white mx-auto`}
        >
          {isCollapsed ? (
            <FiChevronRight className="w-5  h-5" />
          ) : (
            <FiChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex flex-col">
        {[
          { to: '/admin', icon: <HiHome className="w-5 h-5" />, label: 'Dashboard', exact: true },
          { to: '/admin/users', icon: <FaUser className="w-5 h-5" />, label: 'User Management' },
          {
            to: '/admin/credit',
            icon: <FaCreditCard className="w-5 h-5" />,
            label: 'Credit Management'
          },
          {
            to: '/admin/media',
            icon: <MdOndemandVideo className="w-5 h-5" />,
            label: 'Media Management'
          },
          {
            to: '/admin/service',
            icon: <FaRegFileAlt className="w-5 h-5" />,
            label: 'Service Management'
          },
          {
            to: '/admin/sales',
            icon: <FaChartLine className="w-5 h-5" />,
            label: 'Sales Analytics'
          },
          {
            to: '/admin/network',
            icon: <RiNodeTree className="w-5 h-5" />,
            label: 'Network & Connectivity'
          },
          { to: '/admin/settings', icon: <FiSettings className="w-5 h-5" />, label: 'Settings' },
          { to: '/', icon: <FaPowerOff className="w-5 h-5" />, label: 'Logout' }
        ].map(({ to, icon, label, exact }) => (
          <NavLink
            to={to}
            end={exact}
            key={to}
            className={({ isActive }) =>
              `${isActive ? 'text-[#0D47A1] bg-[#E3F2FD] ' : ''} py-4 px-4 flex items-center transition-all duration-200 ${isCollapsed ? 'justify-center' : 'justify-start gap-x-3 px-6'}`
            }
          >
            {icon}
            {!isCollapsed && <span className="text-md">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
