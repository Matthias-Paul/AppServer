import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import getBackendURL from '../components/GetBackendURL.jsx'
import { useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'



const CreditManagement = () => {
  return (
    <>
      <div  className="pt-7  text-[#0D47A1] w-full pl-7 overflow-hidden" >
        <div className="flex justify-between items-center  ">
          <h2 className=" text-[#0D47A1]  font-bold text-3xl xl:text-5xl "> Credits Management </h2>
          <div  className="flex  gap-x-4" >
          <Link to="">
            <button className="bg-[#0D47A1]  text-[#E3F2FD] font-semibold text-xl cursor-pointer py-2 px-4 rounded-lg text-center  ">
              Create Package
            </button>
          </Link>
          <Link to="">
            <button className="bg-[#0D47A1] font-semibold text-[#E3F2FD] text-xl cursor-pointer py-2 px-4 rounded-lg text-center  ">
             Adjust Credits 
            </button>
          </Link>
         </div> 
        </div>     
       </div>
    </>
  )
}

export default CreditManagement
