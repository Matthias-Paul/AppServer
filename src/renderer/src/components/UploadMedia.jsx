import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import getBackendURL from './GetBackendURL'
import toast from 'react-hot-toast'



const UploadMedia = () => {
  const navigate = useNavigate()
  const [isUploadFile, setIsUploadFile] = useState(true)

  const [mediaType, setMediaType] = useState('')
  const [fileName, setFileName] = useState('')
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [filePath, setFilePath] = useState('')
  const [minister_name, setMinister_name] = useState('')

  const handleBrowse = async () => {
    if (!window.electronAPI) {
      alert('Electron API not available')
      return
    }

    const filePath = await window.electronAPI.selectMediaFile()
    if (filePath) {
      setFilePath(filePath)

      const fileNameOnly = filePath.split(/(\\|\/)/g).pop()
      setFileName(fileNameOnly)

      const ext = fileNameOnly.split('.').pop().toLowerCase()
      const extMap = {
        image: ['jpg', 'jpeg', 'png', 'gif'],
        audio: ['mp3', 'wav', 'aac'],
        video: ['mp4', 'avi', 'mov'],
        document: ['pdf', 'txt']
      }

      for (const [type, extensions] of Object.entries(extMap)) {
        if (extensions.includes(ext)) {
          setMediaType(type)
          break
        }
      }
    }
  }

  console.log('Selected file:', filePath)
  console.log('Media type:', mediaType)

  const uploadMedia = async (formData) => {
    const token = localStorage.getItem('token')
    const baseURL = await getBackendURL()

    const response = await fetch(`${baseURL}/api/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      let errorMessage = 'Failed to upload file'

      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData)
      } catch (err) {
        errorMessage = 'An unknown error occurred during upload'
        console.log(err)
      }

      throw new Error(errorMessage)
    }

    return response.json()
  }

  const mutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: (data) => {
      toast.success('Upload successful!')
      console.log('Upload result:', data)

      setTitle('')
      setPrice('')
      setDescription('')
      setFileName('')
      setFilePath('')
      setMinister_name("")
      setTimeout(() => navigate('/admin/media'), 1000)

    },
    onError: (error) => {
      toast.error(error.message || 'Error while uploading')
      console.error('Upload error:', error)
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('file_type', mediaType)
    formData.append('file_full_path', filePath)
    formData.append('is_upload', isUploadFile)
    formData.append('minister_name', minister_name)

    try {
      const stats = window.electronAPI.getFileStats(filePath)
      if (stats) {
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
        formData.append('file_size', sizeInMB)
      }
    } catch (err) {
      toast.error('Failed to get file stats, please select a file')
      console.error(err)
      return
    }

    if (isUploadFile && window.electronAPI.readFileAsBlob) {
      try {
        const { buffer, mimeType } = await window.electronAPI.readFileAsBlob(filePath)
        const blob = new Blob([new Uint8Array(buffer)], {
          type: mimeType || 'application/octet-stream'
        })

        const fileNameOnly = filePath.split(/(\\|\/)/g).pop()
        formData.append('file', blob, fileNameOnly)
      } catch (err) {
        toast.error('Failed to read file from disk')
        console.error(err)
        return
      }
    }

    mutation.mutate(formData)
  }

  return (
    <>
      <div className="pt-7 mx-auto text-[#0D47A1] w-full pl-7 overflow-hidden">
        <div className="flex items-center font-semibold text-[18px]  ">
          <Link className="flex items-center  " to="/admin/media">
            <FaArrowLeft className="text-[20px] flex mr-1" />
            <h2>Back to Media</h2>
          </Link>
        </div>

        <h2 className=" mt-4 font-bold text-3xl lg:text-4xl text-center mb-5  uppercase ">
          Upload A New Media{' '}
        </h2>
        <div className="  max-w-[1500px] mx-auto">
          <div className="shadow-md p-5 rounded-lg   w-full ">
            <form onSubmit={handleSubmit}>
              <div className="mb-6   mt-4 ">
                <label className="block text-[#0D47A1]  text-lg  font-semibold mb-1 ">
                  {' '}
                  Title{' '}
                </label>
                <input
                  placeholder="Add media title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border focus:outline-none px-2  py-3 w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                  type="text"
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-semibold mb-1">File Path</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={filePath}
                    required
                    readOnly
                    placeholder="No file selected"
                    className="border px-2 border-[#0D47A1] rounded-lg py-3 w-full text-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleBrowse}
                    className="bg-[#0D47A1] cursor-pointer text-white px-6 py-3 rounded-lg"
                  >
                    Browse
                  </button>
                </div>
              </div>

              <div className="mb-6 mt-4 ">
                <label className="block text-[#0D47A1]  text-lg  font-semibold mb-1 ">
                  {' '}
                  Price{' '}
                </label>
                <input
                  placeholder="Add media price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="border focus:outline-none px-2  py-3 w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                  type="number"
                />
              </div>

              <div className="mt-6">
                <label className="block text-[#0D47A1]  text-lg font-semibold  ">
                  {' '}
                  Description (Optional){' '}
                </label>
                <textarea
                  placeholder="Add a short subscription for this media..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border resize-none focus:outline-none px-2  py-3 w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                  type="text"
                />
              </div>

              <div className="mt-6">
                <label className="block text-[#0D47A1]  text-lg font-semibold  ">
                  {' '}
                  Minister Name (Optional){' '}
                </label>
                
                <input
                  placeholder="Add minister name"
                  value={minister_name}
                  onChange={(e) => setMinister_name(e.target.value)}
                  className="border focus:outline-none px-2  py-3 w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                  type="text"
                />
              </div>

              <div className="mt-6">
                <label className="block text-lg font-medium text-[#0D47A1]  mb-2">File</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="is_upload"
                      value="true"
                      checked={isUploadFile === true}
                      onChange={() => setIsUploadFile(true)}
                      className="text-[#0D47A1] cursor-pointer focus:ring-[#0D47A1]"
                    />
                    <span className="text-md">Upload file</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="is_upload"
                      value="false"
                      checked={isUploadFile === false}
                      onChange={() => setIsUploadFile(false)}
                      className="text-[#0D47A1] cursor-pointer focus:ring-[#0D47A1]"
                    />
                    <span className="text-md">Network file</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={mutation.isLoading}
                className={`cursor-pointer mt-4 font-semibold bg-[#0D47A1] text-[#E3F2FD] px-9 py-2 rounded-lg ${
                  mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {mutation.isPending ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadMedia
