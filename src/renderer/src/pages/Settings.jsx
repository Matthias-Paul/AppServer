import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const Settings = () => {
  const [churchName, setChurchName] = useState('')
  const [churchLogoFileName, setChurchLogoFileName] = useState('')
  const [churchBannerFileName, setChurchBannerFileName] = useState('')

  const handleFileChangeForLogo = (e) => {
    if (e.target.files.length > 0) {
      setChurchLogoFileName(e.target.files[0].name)
    }
  }

  const handleFileChangeForBanner = (e) => {
    if (e.target.files.length > 0) {
      setChurchBannerFileName(e.target.files[0].name)
    }
  }




  return (
    <>
      <div className=" pt-7 h-full text-[#0D47A1] w-full pl-7 overflow-hidden">
        <h2 className=" text-[#0D47A1] mb-6 font-bold text-3xl lg:text-5xl "> Settings </h2>
              <h2 className=" text-[#0D47A1] mb-6 font-bold text-3xl  "> Update Church Name, Logo, and Banner </h2>


        <div className=" w-full ">
          <h2 className="text-2xl font-semibold  mb-1 "> Church Name </h2>
          <input
            type="text"
            className="border mb-4  border-[#0D47A1] p-2 w-full rounded-lg focus:outline-none text-[20px]     "
            placeholder="Enter church name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#0D47A1]  text-2xl xl:text-2xl font-semibold mb-1 ">
            {' '}
            Upload Church Logo
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChangeForLogo}
            />

            <input
              type="text"
              value={churchLogoFileName}
              readOnly
              placeholder="No file chosen"
              className="border border-[#0D47A1] rounded-lg xl:text-2xl  px-2 py-3  w-full text-lg xl:text-2xl focus:outline-none "
            />

            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-[#0D47A1] text-[#E3F2FD]  px-6 py-3  rounded-lg "
            >
              Browse
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[#0D47A1]  text-2xl xl:text-2xl font-semibold mb-1 ">
            {' '}
            Upload Church Logo
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChangeForBanner}
            />

            <input
              type="text"
              value={churchBannerFileName}
              readOnly
              placeholder="No file chosen"
              className="border border-[#0D47A1] rounded-lg xl:text-2xl  px-2 py-3  w-full text-lg xl:text-2xl focus:outline-none "
            />

            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-[#0D47A1] text-[#E3F2FD]  px-6 py-3  rounded-lg "
            >
              Browse
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings
