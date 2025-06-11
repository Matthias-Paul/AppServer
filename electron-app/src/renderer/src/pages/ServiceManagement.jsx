import SearchBar from '../components/SearchBar'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'


const ServiceManagement = () => {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')
  const [filterBy, setFilterBy] = useState('')
  const navigate = useNavigate()

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

  return (
    <>
      <div className="pt-7 min-h-[400px] text-[#0D47A1] w-full pl-7 overflow-hidden">
        <div className="flex justify-between items-center  ">
          <h2 className=" text-[#0D47A1]  font-bold text-3xl lg:text-5xl "> Service Management </h2>
          <button className="bg-[#0D47A1]  text-[#E3F2FD] text-xl lg:text-2xl cursor-pointer py-2 px-6 rounded-lg text-center  ">
            Create New Service
          </button>
        </div>
        <SearchBar placeholder={'Search services...'} />
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
            onClick={() => handleFilterChange('active')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'active' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            Active{' '}
          </button>
          <button
            onClick={() => handleFilterChange('inActive')}
            className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'inActive' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
          >
            {' '}
            Inactive{' '}
          </button>
        </div>
      </div>
    </>
  )
}

export default ServiceManagement
