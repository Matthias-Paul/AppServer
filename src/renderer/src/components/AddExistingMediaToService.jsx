import SearchBar from '../components/SearchBar'
import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams, useParams } from 'react-router-dom'
import { FaFileAudio, FaFileVideo, FaFileImage, FaFileAlt } from 'react-icons/fa'
import getBackendURL from '../components/GetBackendURL.jsx'
import { useInfiniteQuery, useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaArrowLeft } from 'react-icons/fa'

const AddExistingMediaToService = () => {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')
    const [serviceDetails, setServiceDetails] = useState(null)

  const [filterBy, setFilterBy] = useState('')
  const [baseURL, setBaseURL] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()

  const token = localStorage.getItem('token')

  useEffect(() => {
    const loadURL = async () => {
      const url = await getBackendURL()
      setBaseURL(url)
    }
    loadURL()
  }, [])
  console.log(filter)

  useEffect(() => {
    const currentFilter = searchParams.get('filter')

    if (!currentFilter) {
      const params = new URLSearchParams(searchParams)
      params.set('filter', 'all')
      navigate({ search: params.toString() }, { replace: true })
    } else {
      setFilterBy(currentFilter)
    }
  }, [searchParams, navigate])

  const handleFilterChange = (type) => {
    const params = new URLSearchParams(searchParams)
    if (type) {
      params.set('filter', type)
    } else {
      params.delete('filter')
    }

    navigate({ search: params.toString() })
  }


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

  const { data:serviceData } = useQuery({
    queryKey: ['serviceDetails', id],
    queryFn: fetchServiceDetails
  })

  useEffect(() => {
    if (serviceData && serviceData.serviceDetails) {
      setServiceDetails(serviceData.serviceDetails)
      console.log('serviceDetails:', serviceData.serviceDetails)
    }
  }, [serviceData])


    const addMedia = async ({ mediaId }) => {
      const res = await fetch(`${baseURL}/api/services/addExistingMedia/${id}/${mediaId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
     const data = await res.json() 
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to add media')
      }

      return data 
    }
    const { mutate, isPending } = useMutation({
      mutationFn: addMedia,
      onSuccess: (data) => {
        toast.success(data.message)
        queryClient.invalidateQueries(['medias', data])
      },
      onError: (error) => {
        toast.error(error.message)
        console.log(error.message)
      }
    })

  const handleAdd = (mediaId) => {
    console.log('adding media with ID', mediaId)
 
    mutate({ mediaId })
  }

  const fetchMedias = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${baseURL}/api/media?${searchParams.toString()}&page=${pageParam}&limit=16`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (!res.ok) {
      throw new Error('Failed to fetch media')
    }
    return res.json()
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['media', searchParams.toString()],
    queryFn: fetchMedias,
    getNextPageParam: (lastPage, pages) => (lastPage.hasNextPage ? pages.length + 1 : undefined),
    enabled: !!baseURL
  })

  const medias = data?.pages.flatMap((page) => page.medias) || []
  console.log(medias)

  if (isLoading) {
    return <div className="text-center text-lg mt-3 text-[#0D47A1]  "> Loading media... </div>
  }
  return (
    <>
      <div className="pt-6  text-[#0D47A1] w-full pl-7 overflow-hidden">
        <div className="flex flex-col  ">
          <div className="flex justify-between mb-6 items-center font-semibold text-[18px]  ">
            <Link className="flex items-center  " to={`/admin/service/manageMedia/${id}`}>
              <FaArrowLeft className="text-[20px] flex mr-1" />
              <h2>Back to manage service</h2>
            </Link>
          </div>
          <h2 className=" text-[#0D47A1]  font-bold text-4xl mb-3  "> Add existing media to {serviceDetails?.name} </h2>
        </div>
        <SearchBar placeholder={'Search media files...'} />

        <div className="flex flex-wrap my-5 gap-x-4 ">
          <button
            onClick={() => handleFilterChange('all')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'all' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            All Media{' '}
          </button>
          <button
            onClick={() => handleFilterChange('audio')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'audio' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            Audio{' '}
          </button>
          <button
            onClick={() => handleFilterChange('video')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'video' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            Video{' '}
          </button>
          <button
            onClick={() => handleFilterChange('image')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'image' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            Images{' '}
          </button>
          <button
            onClick={() => handleFilterChange('document')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'document' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            Documents{' '}
          </button>
        </div>
        <div className="pb-10 ">
          {medias?.length >= 1 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3  gap-x-5 gap-y-5">
                {medias?.map((media) => (
                  <div key={media?.id}>
                    <div className=" flex flex-col items-center text-center justify-center border border-[#0D47A1] rounded-lg p-4 ">
                      <div className="mt-20">
                        {media?.file_type === 'audio' && (
                          <div>
                            {' '}
                            <FaFileAudio className="w-20 h-20" />{' '}
                          </div>
                        )}
                        {media?.file_type === 'video' && (
                          <div>
                            {' '}
                            <FaFileVideo className="w-20 h-20" />{' '}
                          </div>
                        )}
                        {media?.file_type === 'image' && (
                          <div>
                            {' '}
                            <FaFileImage className="w-20 h-20" />{' '}
                          </div>
                        )}
                        {media?.file_type === 'document' && (
                          <div>
                            {' '}
                            <FaFileAlt className="w-20 h-20" />{' '}
                          </div>
                        )}
                      </div>

                      <h2 className="font font-semibold text-[20px] capitalize ">
                        {' '}
                        {media?.file_type} file{' '}
                      </h2>
                      <h1 className="font-bold text-[25px] truncate w-full mt-15  ">
                        {media?.title}
                      </h1>
                      <h3 className="font-semibold text-[18px]  ">
                        File Size: {media?.file_size}MB{' '}
                      </h3>
                      <h3 className="font-semibold text-[18px]  ">Price: {media?.price} Credits</h3>
                      <div className="flex w-full items-center gap-x-3 mt-4 mb-2  ">
                        <button
                          onClick={() => handleAdd(media?.id)}
                          className=" active:bg-[#E3F2FD] active:text-[#0D47A1] py-[8px] w-full cursor-pointer text-[#E3F2FD] bg-[#0D47A1] font-semibold  text-[20px] rounded-lg   "
                        >
                          {' '}
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {hasNextPage && (
                <div className="flex block justify-center items-center">
                  <button
                    className="rounded py-2 px-6 text-2xl bg-[#0D47A1] mb-4 mt-12 text-[#E3F2FD] cursor-pointer"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="font-semibold text-[16px] mt-5 text-center "> No media found </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AddExistingMediaToService
