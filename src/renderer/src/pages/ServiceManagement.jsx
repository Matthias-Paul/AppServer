import SearchBar from '../components/SearchBar'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import adminPic from '../assets/adminPics.png'
import getBackendURL from '../components/GetBackendURL.jsx'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

const ServiceManagement = () => {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')
  const [filterBy, setFilterBy] = useState('')
  const [baseURL, setBaseURL] = useState('')
  const navigate = useNavigate()
  const { churchProfile } = useSelector((state) => state.admin)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const loadURL = async () => {
      const url = await getBackendURL()
      setBaseURL(url)
    }
    loadURL()
  }, [])

  const fetchServices = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `${baseURL}/api/services?${searchParams.toString()}&page=${pageParam}&limit=16`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (!res.ok) {
      throw new Error('Failed to fetch services')
    }
    return res.json()
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['services', searchParams.toString()],
    queryFn: fetchServices,
    getNextPageParam: (lastPage, pages) => (lastPage.hasNextPage ? pages.length + 1 : undefined),
    enabled: !!baseURL
  })

  const services = data?.pages.flatMap((page) => page.services) || []
  console.log(services)
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

  const churchBanner =
    churchProfile?.church_banner_file_path && baseURL
      ? `${baseURL}${churchProfile.church_banner_file_path} `
      : ''

  return (
    <div className="pt-7 min-h-[400px] text-[#0D47A1] w-full pl-7 overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-[#0D47A1] font-bold text-3xl xl:text-5xl">Service Management</h2>
        <Link to="newService">
          <button className="bg-[#0D47A1] text-[#E3F2FD] text-xl lg:text-2xl cursor-pointer py-2 px-6 rounded-lg text-center">
            Create New Service
          </button>
        </Link>
      </div>

      <SearchBar placeholder="Search services..." />

      <div className="flex flex-wrap my-5 gap-x-4">
        {['all', '1', '0'].map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center ${
              filter === status ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'
            }`}
          >
            {status === 'all' ? 'All Services' : status === '1' ? 'Active' : 'Inactive'}
          </button>
        ))}
      </div>

      <div className="pb-10">
        {isLoading ? (
          <div className="text-center font-semibold text-lg mt-8">Loading services...</div>
        ) : services.length >= 1 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
              {services.map((service) => {
                const imageURL =
                  service?.banner_image && baseURL
                    ? `${baseURL}${service.banner_image}`
                    : churchBanner

                return (
                  <div key={service?.id}>
                    <div className="flex flex-col items-start text-center justify-center border border-[#0D47A1] rounded-lg p-4">
                      <img
                        className="object-cover w-full h-45 flex-shrink-0 rounded"
                        src={imageURL}
                        alt={service?.name}
                        onError={(e) => (e.target.src = churchBanner)}
                      />
                      <h1 className="font-bold text-start text-[25px] line-clamp-2 mt-5">
                        {service?.name}
                      </h1>
                      <h3 className="font-semibold text-start w-full truncate text-[18px]">
                        Theme: {service?.theme}
                      </h3>
                      <h3 className="font-semibold text-[18px]">
                        Media Count: {service?.media_count}
                      </h3>
                      <h3 className="font-semibold text-[18px]">
                        {service.is_active ? 'Active' : 'Inactive'}
                      </h3>
                      <div className="flex items-center  gap-x-3 mt-4 mb-2">
                        <Link to={`edit/${service?.id}`}>
                          <button className="px-6 py-[6px] cursor-pointer text-[#E3F2FD] bg-[#0D47A1] font-semibold text-[18px] rounded-lg">
                            Edit
                          </button>
                        </Link>
                        <Link to={`manageMedia/${service?.id}`}>
                          <button className="px-6 py-[6px] cursor-pointer text-[#E3F2FD] bg-[#0D47A1] font-semibold text-[18px] rounded-lg">
                            Manage Media
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
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
          <div className="font-semibold text-[16px] mt-5 text-center">No service found</div>
        )}
      </div>
    </div>
  )
}

export default ServiceManagement
