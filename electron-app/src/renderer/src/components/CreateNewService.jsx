import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import getBackendURL from './GetBackendURL'
import toast from 'react-hot-toast'

const CreateNewService = () => {
  const [fileName, setFileName] = useState('')
  const [name, setName] = useState('')
  const [theme, setTheme] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    }
  }

  const createService = async (formData) => {
    const baseURL = await getBackendURL()
    console.log('base url', baseURL)
    const res = await fetch(`${baseURL}/api/services`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to create service')
    }

    return data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createService,
    onSuccess: (data) => {
      console.log('serviceID', data.id)
      toast.success('Service created successfully!')
      setName('')
      setTheme('')
      setDescription('')
      setIsActive(true)
      setFileName('')
      document.getElementById('file-upload').value = ''
    },
    onError: (error) => {
      toast.error(error.message)
      console.log(error.message)
    }
  })
  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('theme', theme)
    formData.append('isActive', isActive)

    const fileInput = document.getElementById('file-upload')
    if (fileInput && fileInput.files.length > 0) {
      formData.append('banner', fileInput.files[0])
    }

    mutate(formData)
  }

  console.log(name, description, isActive, theme, fileName)

  return (
    <>
      <div className="pt-7 mx-auto min-h-[400px] text-[#0D47A1] w-full pl-7 overflow-hidden">
        <Link className="flex items-center font-semibold text-[18px]  " to="/admin/service">
          <div className="text-[20px] mr-1 ">
            {' '}
            <FaArrowLeft />
          </div>{' '}
          Back to Services
        </Link>
        <h2 className=" mt-4 font-bold text-3xl lg:text-4xl text-center mb-5  uppercase ">
          Create New Services{' '}
        </h2>
        <div className="  max-w-[700px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-[#0D47A1]  text-lg font-semibold mb-1 "> Name </label>
              <input
                placeholder="Enter service name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="border focus:outline-none px-2  py-3 w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                type="text"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#0D47A1]  text-lg font-semibold mb-1 ">
                {' '}
                Description (Optional){' '}
              </label>
              <input
                placeholder="Enter service description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border focus:outline-none px-2  py-3 w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                type="text"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#0D47A1]  text-lg font-semibold mb-1 ">
                {' '}
                Theme (Optional){' '}
              </label>
              <input
                placeholder="Enter service theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="border focus:outline-none px-2  py-3 w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                type="text"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#0D47A1]  text-lg font-semibold mb-1 ">
                {' '}
                Service Banner (Optional){' '}
              </label>
              <div className="flex items-center gap-4 mt-1">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <input
                  type="text"
                  value={fileName}
                  readOnly
                  placeholder="No file chosen"
                  className="border border-[#0D47A1] rounded-lg px-2 py-3 w-full text-lg focus:outline-none "
                />

                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-[#0D47A1] text-[#E3F2FD]  px-6 py-3 rounded transition"
                >
                  Browse
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-lg font-medium text-[#0D47A1]  mb-2">Is Active</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="is_active"
                    value="true"
                    checked={isActive === true}
                    onChange={() => setIsActive(true)}
                    className="text-[#0D47A1] cursor-pointer focus:ring-[#0D47A1]"
                  />
                  <span className="text-md">Yes</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="is_active"
                    value="false"
                    checked={isActive === false}
                    onChange={() => setIsActive(false)}
                    className="text-[#0D47A1] cursor-pointer focus:ring-[#0D47A1]"
                  />
                  <span className="text-md">No</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="cursor-pointer my-6 bg-[#0D47A1] text-lg font-semibold text-[#E3F2FD] w-full py-4 rounded-lg transition"
            >
              Create Service
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateNewService
