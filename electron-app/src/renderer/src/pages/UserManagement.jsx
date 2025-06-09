import SearchBar from '../components/SearchBar'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import UsersTable from '../components/UsersTable'
import { useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import getBackendURL from '../components/GetBackendURL.jsx'

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

  const token = localStorage.getItem('token')
  const fetchUsers = async ({ pageParam = 1 }) => {
    const baseURL = await getBackendURL()
    console.log('base url', baseURL)
    const res = await fetch(
      `${baseURL}/api/users?${searchParams.toString()}&page=${pageParam}&limit=8`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (!res.ok) {
      throw new Error('Failed to fetch users')
    }
    return res.json()
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['users', searchParams.toString()],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined
    }
  })

  const users = data?.pages.flatMap((page) => page.users) || []

  return (
    <>
      <div className="pt-7 min-h-[400px] w-full pl-7 overflow-hidden ">
        <div>
          <div className="flex justify-between items-center  ">
            <h2 className=" text-[#0D47A1]  font-bold text-3xl lg:text-5xl "> User Management </h2>
            <button className="bg-[#0D47A1]  text-[#E3F2FD] text-xl lg:text-2xl cursor-pointer py-2 px-6 rounded-lg text-center  ">
              Add new user{' '}
            </button>
          </div>
          <SearchBar placeholder={'Search users by name, email, or role...'} />

          <div className="flex my-5 gap-x-4 ">
            <button
              onClick={() => handleFilterChange('all')}
              className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'all' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
            >
              {' '}
              All Users{' '}
            </button>
            <button
              onClick={() => handleFilterChange('admin')}
              className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'admin' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
            >
              {' '}
              Admins{' '}
            </button>
            <button
              onClick={() => handleFilterChange('sales-rep')}
              className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'sales-rep' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
            >
              {' '}
              Sales Reps{' '}
            </button>
            <button
              onClick={() => handleFilterChange('client')}
              className={`font-bold border border-[#0D47A1] text-lg lg:text-xl cursor-pointer py-2 px-4 rounded-lg text-center
           ${filter === 'client' ? 'bg-[#0D47A1] text-[#E3F2FD]' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}
            >
              {' '}
              Clients{' '}
            </button>
          </div>
        </div>
        <div className="max-h-[400px] pb-20 overflow-y-auto  ">
          <UsersTable isLoading={isLoading} users={users} />

          {hasNextPage && (
            <div className="flex justify-center items-center">
              <button
                className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 my-4 text-white cursor-pointer"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default UserManagement
