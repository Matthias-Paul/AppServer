import SearchBar from '../components/SearchBar'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import adminPic from '../assets/adminPics.png'

const ServiceManagement = () => {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')
  const [filterBy, setFilterBy] = useState('')
  const navigate = useNavigate()

  console.log(filter)

  const services = [
    {
      name: 'Sunday Worship Service',
      description: 'A time of praise, worship, and the Word every Sunday morning.',
      theme: 'Victory Through Praise',
      banner_image: adminPic,
      is_active: true
    },
    {
      name: 'Sunday Worship Service',
      description: 'A time of praise, worship, and the Word every Sunday morning.',
      theme: 'Victory Through Praise',
      banner_image: adminPic,
      is_active: false
    },
    {
      name: 'Sunday Worship Service',
      description: 'A time of praise, worship, and the Word every Sunday morning.',
      theme: 'Victory Through Praise',
      banner_image: adminPic,
      is_active: true
    },
    {
      name: 'Sunday Worship Service',
      description: 'A time of praise, worship, and the Word every Sunday morning.',
      theme: 'Victory Through Praise',
      banner_image: adminPic,
      is_active: false
    }
  ]

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

  return (
    <>
      <div className="pt-7 min-h-[400px] text-[#0D47A1] w-full pl-7 overflow-hidden">
        <div className="flex justify-between items-center  ">
          <h2 className=" text-[#0D47A1]  font-bold text-3xl xl:text-5xl "> Service Management </h2>
          <Link to="newService">
            <button className="bg-[#0D47A1]  text-[#E3F2FD] text-xl lg:text-2xl cursor-pointer py-2 px-6 rounded-lg text-center  ">
              Create New Service
            </button>
          </Link>
        </div>
        <SearchBar placeholder={'Search services...'} />
        <div className="flex flex-wrap my-5 gap-x-4 ">
          <button
            onClick={() => handleFilterChange('all')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'all' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            All Services{' '}
          </button>
          <button
            onClick={() => handleFilterChange('true')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'true' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            Active{' '}
          </button>
          <button
            onClick={() => handleFilterChange('false')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'false' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            Inactive{' '}
          </button>
        </div>

        <div className="max-h-[400px] pb-20 overflow-y-auto ">
          {services.length > 1 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3  gap-x-5 gap-y-5">
              {services.map((service) => (
                <div key={service.id}>
                  <div className=" flex flex-col  items-start text-center justify-center border border-[#0D47A1] rounded-lg p-4 ">
                    <img className="object-cover w-full h-45 rounded  " src={adminPic} />
                    <h1 className="font-bold text-[25px] mt-5  ">{service.name}</h1>
                    <h3 className="font-semibold text-[18px]  ">Theme: {service.theme}</h3>
                    <h3 className="font-semibold text-[18px]  ">Service Count: {} </h3>
                    <h3 className="font-semibold text-[18px]  ">
                      {' '}
                      {service.is_active ? 'Active' : 'Inactive'}{' '}
                    </h3>
                    <div className="flex items-center gap-x-3 mt-4 mb-2  ">
                      <button className=" px-6 py-[6px] cursor-pointer text-[#E3F2FD] bg-[#0D47A1] font-semibold  text-[18px] rounded-lg   ">
                        {' '}
                        Edit{' '}
                      </button>
                      <button className=" px-6 py-[6px] cursor-pointer text-[#E3F2FD] bg-[#0D47A1] font-semibold  text-[18px] rounded-lg   ">
                        {' '}
                        Manage Media{' '}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* {hasNextPage && (
                            <div className="flex justify-center items-center">
                              <button
                                className="rounded py-1 px-4 bg-[#0D47A1] my-4 text-[#E3F2FD] cursor-pointer"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                              >
                                {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                              </button>
                            </div>
                          )} */}
            </div>
          ) : (
            <div className="font-semibold text-[16px] mt-5 text-center "> No service found </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ServiceManagement
