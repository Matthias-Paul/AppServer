import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaUser, FaBoxOpen, FaClipboardList, FaStore,FaRegFileAlt, FaFilm , FaPowerOff ,FaSignOutAlt } from 'react-icons/fa'
import { MdPermMedia, MdBuild, MdHome, MdOndemandVideo   } from 'react-icons/md'
import { FaUsersCog, FaCreditCard, FaChartBar, FaChartLine  } from 'react-icons/fa'
import { RiNodeTree  } from 'react-icons/ri'
import { FiSettings } from 'react-icons/fi'
import { BiCameraMovie  } from 'react-icons/bi'
import { HiHome, HiPlay  } from 'react-icons/hi'

const Sidebar = () => {
  
  return (
    <>
      <div className="min-h-full pb-10   overflow-y-auto rounded-2xl mx-4 mt-4   text-start  bg-[#1A1A1A] text-white w-full  ">
        <div className=" ">
          <Link className="font-medium text-xl ">
            <div className=" py-6 px-9 ">Church Media Service</div>
          </Link>
        </div>
        <nav className="flex flex-col ">
          <NavLink
            to="/admin" end
            className={({ isActive }) =>
              isActive
                ? ' bg-black text-white py-4  px-9 rounded flex items-center justify-start gap-x-2 '
                : '  text-white py-4  px-9  rounded flex items-center justify-start gap-x-3 '}>
            <HiHome className='w-5 h-5 ' />
            <span className=" text-md "> Dashboard </span>
          </NavLink>

           <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? 'px-9 bg-black text-white py-4  rounded flex items-center justify-start gap-x-2 '
                : 'px-9  text-white py-4  rounded flex items-center justify-start gap-x-3 '}>
            <FaUser className='w-5 h-5 ' />
            <span className=" text-md "> User Management </span>
          </NavLink>

           <NavLink
            to="/admin/credit"
            className={({ isActive }) =>
              isActive
                ? ' bg-black px-9 text-white py-4  rounded flex items-center justify-start gap-x-2 '
                : '  text-white px-9 py-4  rounded flex items-center justify-start gap-x-3 '}>
            <FaCreditCard  className='w-5 h-5 ' />
            <span className=" text-md "> Credit Management </span>
          </NavLink>

           <NavLink
            to="/admin/media"
            className={({ isActive }) =>
              isActive
                ? ' bg-black text-white px-9 py-4  rounded flex items-center justify-start gap-x-2 '
                : '  text-white py-4  rounded px-9 flex items-center justify-start gap-x-3 '}>
            <MdOndemandVideo  className='w-5 h-5 ' />
            <span className=" text-md "> Media Management </span>
          </NavLink>

           <NavLink
            to="/admin/service"
            className={({ isActive }) =>
              isActive
                ? ' bg-black text-white py-4  rounded px-9 flex items-center justify-start gap-x-2 '
                : '  text-white py-4  rounded flex items-center px-9 justify-start gap-x-3 '}>
            <FaRegFileAlt    className='w-5 h-5 ' />
            <span className=" text-md "> Service Management </span>
          </NavLink>

           <NavLink
            to="/admin/sales"
            className={({ isActive }) =>
              isActive
                ? ' bg-black text-white py-4  rounded flex items-center px-9 justify-start gap-x-2 '
                : '  text-white py-4  rounded flex items-center justify-start px-9 gap-x-3 '}>
            <FaChartLine  className='w-5 h-5 ' />
            <span className=" text-md "> Sales Analytics </span>
          </NavLink>

           <NavLink
            to="/admin/network"
            className={({ isActive }) =>
              isActive
                ? ' bg-black text-white py-4 px-9 rounded flex items-center justify-start gap-x-2 '
                : '  text-white py-4  rounded flex px-9 items-center justify-start gap-x-3 '}>
            <RiNodeTree    className='w-5 h-5 ' />
            <span className=" text-md "> Network & Connectivity </span>
          </NavLink>

           <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              isActive
                ? ' bg-black text-white py-4 px-9 rounded flex items-center justify-start gap-x-2 '
                : '  text-white py-4  rounded flex px-9 items-center justify-start gap-x-3 '}>
            <FiSettings  className='w-5 h-5 ' />
            <span className=" text-md "> Settings </span>
          </NavLink>

           <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? ' bg-black text-white py-4 px-9 rounded flex items-center justify-start gap-x-2 '
                : '  text-white py-4  rounded flex px-9 items-center justify-start gap-x-3 '}>
            <FaPowerOff   className='w-5 h-5 ' />
            <span className=" text-md "> Logout </span>
          </NavLink>



        </nav>
      </div>
    </>
  )
}

export default Sidebar
