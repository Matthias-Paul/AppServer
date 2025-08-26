import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import getBackendURL from './GetBackendURL'
import toast from 'react-hot-toast'

const EditService = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [fileName, setFileName] = useState('')
  const [name, setName] = useState('')
  const [theme, setTheme] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState("1")

  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    return allowedTypes.includes(file.type)
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!validateImageFile(file)) {
        toast.error('Only image files (jpeg, jpg, png) are allowed for service banner')
        e.target.value = ''
        return
      }
      setFileName(file.name)
    }
  }

  const token = localStorage.getItem('token')

  const fetchServiceDetails = async () => {
    const baseURL = await getBackendURL()
    console.log('base url', baseURL)
    const res = await fetch(`${baseURL}/api/services/${id}`, {
      method: 'GET'
    })
    if (!res.ok) {
      throw new Error('Failed to fetch service details')
    }
    return res.json()
  }

  const { data } = useQuery({
    queryKey: ['serviceDetails', id],
    queryFn: fetchServiceDetails
  })

  useEffect(() => {
    if (data && data.serviceDetails) {
      console.log('serviceDetails:', data?.serviceDetails)
      setName(data?.serviceDetails?.name || '')
      setTheme(data?.serviceDetails?.theme || '')
      setDescription(data?.serviceDetails?.description || '')
    }
  }, [data])

  const editService = async (formData) => {
    const baseURL = await getBackendURL()
    console.log('base url', baseURL)
    const res = await fetch(`${baseURL}/api/services/${id}/editService`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to edit service')
    }

    return data
  }
  console.log(id)

  const { mutate, isPending } = useMutation({
    mutationFn: editService,
    onSuccess: (data) => {
      console.log(data)
      toast.success('Service Edited successfully!')
      setName('')
      setTheme('')
      setDescription('')
      setIsActive("1")
      setFileName('')
      document.getElementById('file-upload').value = ''
      navigate(`/admin/service`)
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
    formData.append('isActive', isActive.toString())

    const fileInput = document.getElementById('file-upload')
    if (fileInput && fileInput.files.length > 0) {
      formData.append('banner', fileInput.files[0])
    }

    mutate(formData)
  }

  console.log(name, description, isActive, theme, fileName)

  return (
    <>
      <div className="pt-7 mx-auto text-[#0D47A1] w-full pl-7 overflow-hidden">
        <div className="flex items-center font-semibold text-[18px]  ">
          <Link className="flex items-center  " to="/admin/service">
            <FaArrowLeft className="text-[20px] flex mr-1" />
            <h2>Back to Services</h2>
          </Link>
        </div>

        <h2 className=" mt-4 font-bold text-3xl lg:text-4xl text-center mb-5  uppercase ">
          Edit A Services{' '}
        </h2>
        <div className="  max-w-[1500px] mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-[#0D47A1]  text-lg xl:text-2xl font-semibold mb-1 ">
                {' '}
                Name{' '}
              </label>
              <input
                placeholder="Enter service name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="border focus:outline-none px-2  py-3 xl:text-2xl   w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                type="text"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#0D47A1]  text-lg xl:text-2xl font-semibold mb-1 ">
                {' '}
                Description (Optional){' '}
              </label>
              <input
                placeholder="Enter service description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border focus:outline-none px-2  py-3 xl:text-2xl   w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                type="text"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#0D47A1]  text-lg xl:text-2xl font-semibold mb-1 ">
                {' '}
                Theme (Optional){' '}
              </label>
              <input
                placeholder="Enter service theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="border focus:outline-none px-2  py-3 xl:text-2xl  w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                type="text"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#0D47A1]  text-lg xl:text-2xl font-semibold mb-1 ">
                {' '}
                Service Banner (Optional){' '}
              </label>
              <div className="flex items-center gap-2 mt-1">
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

            <div className="mt-6">
              <label className="block text-lg xl:text-2xl font-medium text-[#0D47A1]  mb-2">
                Is Active
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="is_active"
                    value="1"
                    checked={isActive === "1"}
                    onChange={() => setIsActive("1")}
                    className="text-[#0D47A1] cursor-pointer focus:ring-[#0D47A1]"
                  />
                  <span className="text-md  xl:text-2xl ">Yes</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="is_active"
                    value="0"
                    checked={isActive === "0"}
                    onChange={() => setIsActive("0")}
                    className="text-[#0D47A1] cursor-pointer focus:ring-[#0D47A1]"
                  />
                  <span className="text-md xl:text-2xl ">No</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="cursor-pointer my-6 bg-[#0D47A1] text-lg xl:text-2xl font-semibold text-[#E3F2FD] w-full py-4 rounded-lg transition"
            >
              {isPending ? ' Editing...' : 'Edit '}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditService
