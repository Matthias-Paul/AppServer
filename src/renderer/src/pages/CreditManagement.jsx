import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams, NavLink, Outlet } from 'react-router-dom'
import getBackendURL from '../components/GetBackendURL.jsx'
import { useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const CreditManagement = () => {
  return (
    <>
      <div className="pt-7  text-[#0D47A1] w-full pl-7 overflow-hidden">
        <div className="flex justify-between items-center  ">
          <h2 className=" text-[#0D47A1]  font-bold pb-4 text-3xl xl:text-5xl ">
            {' '}
            Credits Management{' '}
          </h2>
         
        </div>

        <div className="flex gap-x-5 mt-5 ">
          <NavLink
            to="/admin/credit"
            end
            className={({ isActive }) =>
              isActive
                ? 'bg-[#0D47A1] rounded-lg text-[#E3F2FD]'
                : 'text-[#0D47A1] rounded-lg bg-[#E3F2FD]'
            }
          >
            <button
              className={`font-bold border  border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-[10px] px-4 rounded-lg text-center `}
            >
              Credit Allocation
            </button>
          </NavLink>

          <NavLink
            to="/admin/credit/history"
            className={({ isActive }) =>
              isActive
                ? 'bg-[#0D47A1] rounded-lg text-[#E3F2FD]'
                : 'text-[#0D47A1] rounded-lg bg-[#E3F2FD]'
            }
          >
            <button
              className={`font-bold border  border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-[10px] px-4 rounded-lg text-center `}
            >
              Credit History
            </button>
          </NavLink>

          <NavLink
            to="/admin/credit/usage"
            className={({ isActive }) =>
              isActive
                ? 'bg-[#0D47A1] rounded-lg text-[#E3F2FD]'
                : 'text-[#0D47A1] rounded-lg bg-[#E3F2FD]'
            }
          >
            <button
              className={`font-bold border  border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-[10px] px-4 rounded-lg text-center `}
            >
              Credit Usage
            </button>
          </NavLink>
        </div>

        <Outlet />
      </div>
    </>
  )
}

export default CreditManagement
