import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import getBackendURL from './GetBackendURL'
import { FaFileAudio, FaFileVideo, FaFileImage, FaFileAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const AddMediaToService = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isUploadFile, setIsUploadFile] = useState(true)

  const [serviceDetails, setServiceDetails] = useState(null)
  const [mediaCount, setMediaCount] = useState(0)
  const [mediaType, setMediaType] = useState('image')
  const [fileName, setFileName] = useState('')
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
    const [minister_name, setMinister_name] = useState('')

  const [price, setPrice] = useState('')
  const queryClient = useQueryClient()
  const [filePath, setFilePath] = useState('')

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

  const { data, isLoading } = useQuery({
    queryKey: ['serviceDetails', id],
    queryFn: fetchServiceDetails
  })

  useEffect(() => {
    if (data && data.serviceDetails) {
      setServiceDetails(data.serviceDetails)
      console.log('serviceDetails:', data.serviceDetails)
    }
  }, [data])

  const uploadMedia = async (formData) => {
    const token = localStorage.getItem('token')
    const baseURL = await getBackendURL()

    const response = await fetch(`${baseURL}/api/services/${id}/addMedia`, {
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

      queryClient.invalidateQueries(['serviceDetails', 'mediaCount', id])

      setTitle('')
      setPrice('')
      setDescription('')
      setFileName('')
      setFilePath('')
      setMinister_name("")
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

    const stats = window.electronAPI.getFileStats(filePath)
    if (stats) {
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
      console.log(`Size: ${sizeInMB} MB`)

      formData.append('file_size', sizeInMB)
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

  const token = localStorage.getItem('token')
  const fetchMedia = async () => {
    const baseURL = await getBackendURL()
    console.log('base url', baseURL)
    const res = await fetch(`${baseURL}/api/services/${id}/media`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch media')
    }
    return res.json()
  }

  const { data: mediaData, isLoading: isMediaLoading } = useQuery({
    queryKey: ['medias', id],
    queryFn: fetchMedia
  })

  useEffect(() => {
    if (mediaData && Array.isArray(mediaData.media)) {
      setMediaCount(mediaData.media.length)
      console.log('Fetched media data:', mediaData)
    }
  }, [mediaData, id])

  return (
    <>
      <div className="pt-6  text-[#0D47A1] w-full pl-7 overflow-hidden">
        <div className="flex items-center font-semibold text-[18px]  ">
          <Link className="flex items-center  " to="/admin/service">
            <FaArrowLeft className="text-[20px] flex mr-1" />
            <h2>Back to Services</h2>
          </Link>
        </div>

        <h2 className=" mt-4 font-bold text-3xl lg:text-4xl uppercase ">
          {' '}
          {serviceDetails?.name}{' '}
        </h2>
        <h3 className="text-[20px] mt-2  ">Media Count: {mediaCount} </h3>
        <div className="w-full flex gap-4 pb-5  mt-2  items-start justify-center ">
          <div className="shadow-md p-5 rounded-lg   w-3/5 ">
            <h2 className="font-semibold text-[20px] ">Add Media</h2>
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

               <div className="mb-6   mt-4 ">
                <label className="block text-[#0D47A1]  text-lg  font-semibold mb-1 ">
                  {' '}
                  Minister Name (Otional){' '}
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
                      name="is_uplaod"
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
                      name="is_uplaod"
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
                {mutation.isPending ? 'Uploading...' : 'Add'}
              </button>
            </form>
          </div>
          <div className="shadow-md rounded-lg pb-5  h-full p-5 w-2/5">
            <h2 className="font-semibold text-[20px]">Media Files</h2>

            {isMediaLoading ? (
              <div className="text-center mt-4">Loading...</div>
            ) : mediaData?.media?.length >= 1 ? (
              mediaData.media.map((media) => (
                <div className="mt-4 border-b-[1px] border-[#0D47A1] gap-y-2" key={media?.id}>
                  <div className="flex gap-x-2">
                    <div>
                      {media.file_type === 'audio' && <FaFileAudio className="w-12 h-12" />}
                      {media.file_type === 'video' && <FaFileVideo className="w-12 h-12" />}
                      {media.file_type === 'image' && <FaFileImage className="w-12 h-12" />}
                      {media.file_type === 'document' && <FaFileAlt className="w-12 h-12" />}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{media?.title}</h2>
                      <h2 className="text-md">Path: {media?.file_path}</h2>
                      {media?.description && (
                        <h2 className="text-md">Description: {media?.description}</h2>
                      )}
                      <h2 className="text-md">
                        Added:{' '}
                        {media?.created_at
                          ? new Date(media.created_at).toISOString().split('T')[0]
                          : 'N/A'}
                      </h2>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-4">You have not added any media yet!</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AddMediaToService
