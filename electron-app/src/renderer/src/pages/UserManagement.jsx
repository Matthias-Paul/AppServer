import SearchBar from '../components/SearchBar'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import UsersTable from '../components/UsersTable'

const UserManagement = () => {
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

  const handleFilterChange = (role) => {
    const params = new URLSearchParams(searchParams)
    if (role) {
      params.set('filter', role)
    } else {
      params.delete('filter')
    }

    navigate({ search: params.toString() })
  }

  return (
    <>
      <div className="pt-7 min-h-[400px] w-full pl-5 overflow-hidden ">
        <div>
          <div className="flex justify-between items-center  ">
            <h2 className=" text-[#1A1A1A] font-bold text-3xl lg:text-5xl "> User Management </h2>
            <button className="bg-[#1A1A1A] text-white text-xl lg:text-2xl cursor-pointer py-2 px-6 active:bg-black rounded-lg text-center  ">
              Add new user{' '}
            </button>
          </div>
          <SearchBar placeholder={'Search users by name, email, or role...'} />

          <div className="flex my-5 gap-x-4 ">
            <button
              onClick={() => handleFilterChange('all')}
              className={`font-bold border border-[#1A1A1A] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'all' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A]'}`}
            >
              {' '}
              All Users{' '}
            </button>
            <button
              onClick={() => handleFilterChange('admin')}
              className={`font-bold border border-[#1A1A1A] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'admin' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A]'}`}
            >
              {' '}
              Admins{' '}
            </button>
            <button
              onClick={() => handleFilterChange('sales-rep')}
              className={`font-bold border border-[#1A1A1A] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'sales-rep' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A]'}`}
            >
              {' '}
              Sales Reps{' '}
            </button>
            <button
              onClick={() => handleFilterChange('client')}
              className={`font-bold border border-[#1A1A1A] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'client' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A]'}`}
            >
              {' '}
              Clients{' '}
            </button>
          </div>
        </div>
        <div className="max-h-[400px] pb-20 overflow-y-auto  " >
        <UsersTable />

        </div>
      </div>
    </>
  )
}

export default UserManagement
