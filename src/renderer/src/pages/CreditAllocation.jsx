import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams, NavLink, Outlet } from 'react-router-dom'
import getBackendURL from '../components/GetBackendURL.jsx'
import { useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Select from 'react-select'

const CreditAllocation = () => {
  const [isLoading, setIsloading] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [credit, setCredit] = useState("")
  const [reason, setReason] = useState('')
  const queryClient = useQueryClient()

  const token = localStorage.getItem('token')
  const fetchUsers = async ({ pageParam = 1 }) => {
    const baseURL = await getBackendURL()
    console.log('base url', baseURL)
    const res = await fetch(`${baseURL}/api/users?page=${pageParam}&limit=16`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch users')
    }
    return res.json()
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isSuccess } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined
    }
  })

  const users = data?.pages.flatMap((page) => page.users) || []

  console.log(selectedUser, selectedUserId, credit, reason)
  const packages = [
    {
      id: 1,
      package: 'Basic',
      credits: 100,
      price: 2000
    },
    {
      id: 2,
      package: 'Standard',
      credits: 500,
      price: 7000
    },
    {
      id: 3,
      package: 'Premium',
      credits: 1000,
      price: 20000
    }
  ]

  const userOptions = users.map((user) => ({
    label: user.email,
    value: `${user.id}|${user.email}`
  }))

  if (hasNextPage) {
    userOptions.push({
      label: isFetchingNextPage ? 'Loading more...' : ' Load more users...',
      value: 'load_more',
      isDisabled: isFetchingNextPage
    })
  }

  const handleCustomSelect = (selected, { action }) => {
    if (!selected) return

    if (selected.value === 'load_more') {
      fetchNextPage()
      setIsMenuOpen(true)
      return
    }

    const [id, email] = selected.value.split('|')
    setSelectedUserId(id)
    setSelectedUser(email)

    setIsMenuOpen(false)
  }

  const creditAllocationMutation = useMutation({
    mutationFn: async () => {
      const baseURL = await getBackendURL()
      const token = localStorage.getItem('token')

      console.log('base url', baseURL)
      const res = await fetch(`${baseURL}/api/credit/allocate/${selectedUserId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credit: Number(credit),
          reason
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to credit  user')
      }

      const data = await res.json()

      return data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      console.log(' Credit allocation details:', data.CreditAllocationDetails)
      setSelectedUserId('')
      setReason('')
      setSelectedUser('')
      setCredit('')
      queryClient.invalidateQueries(['users'])
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedUserId || !credit || !reason) {
      toast.error('All fields are required')
      return
    }

    creditAllocationMutation.mutate({ reason, credit, selectedUserId })
  }

  return (
    <>
      <div className="w-full mt-5 pb-20 ">
        <div className="flex gap-x-5  ">
          <div className="w-3/6 p-4 shadow-lg rounded-lg ">
            <h2 className="text-2xl font-bold "> Credits Packages </h2>
            <div className="w-full">
              {isLoading ? (
                <div className="text-[#0D47A1] font-semibold text-lg">Loading...</div>
              ) : packages.length > 0 ? (
                <div className="overflow-x-auto mt-3 relative rounded-sm lg:rounded-md">
                  <table className="text-left min-w-full mx-auto text-[#0D47A1]">
                    <thead className="font-bold text-[22px] border-b-[0.5px] border-[#0D47A1]">
                      <tr>
                        <th className="py-2 pr-4 sm:py-3">Package</th>
                        <th className="py-2 px-4 sm:py-3">Credits</th>
                        <th className="py-2 px-4 sm:py-3">Price</th>
                        <th className="py-2 px-4 sm:py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages?.map((pack, index) => (
                        <tr
                          key={pack?.id}
                          className={`border-b-[0.5px] border-[#0D47A1] font-medium text-[20px] cursor-pointer ${
                            index === packages?.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          <td className="py-2 pr-4 sm:py-4 font-medium">{pack?.package}</td>
                          <td className="py-2 px-4 sm:py-4 font-medium">{pack?.credits}</td>
                          <td className="py-2 px-4 sm:py-4">₦{pack?.price}</td>

                          <td className="py-2 px-4 sm:py-4 font-medium">
                            <button className=" px-6 py-[6px] cursor-pointer text-[#E3F2FD] bg-[#0D47A1] font-semibold  text-[18px] rounded-lg   ">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-[#0D47A1] font-semibold text-lg">No package Found.</div>
              )}
            </div>
          </div>
          <div className="w-3/6 shadow-md p-4 rounded-lg ">
            <h2 className="text-2xl font-bold"> Credits Allocation </h2>
            <form onSubmit={handleSubmit}>
              <div className="mt-6   ">
                <h2 className="text-xl font-semibold  mb-1 "> Select User </h2>
                <Select
                  options={userOptions}
                  onChange={handleCustomSelect}
                  value={
                    userOptions.find((opt) => opt.value === `${selectedUserId}|${selectedUser}`) ||
                    null
                  }
                  isClearable
                  placeholder="Select a user"
                  menuIsOpen={isMenuOpen}
                  onMenuOpen={() => setIsMenuOpen(true)}
                  onMenuClose={() => setIsMenuOpen(false)}
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    control: (base) => ({
                      ...base,
                      borderColor: '#0D47A1',
                      padding: '6px',
                      cursor: 'pointer',
                      borderRadius: '6px'
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#0D47A1'
                    }),
                    option: (base, state) => ({
                      ...base,
                      color: '#0D47A1',
                      backgroundColor: state.isSelected
                        ? '#E3F2FD'
                        : state.isFocused
                          ? '#BBDEFB'
                          : 'white',
                      cursor: 'pointer'
                    }),
                    input: (base) => ({
                      ...base,
                      color: '#0D47A1'
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#0D47A1'
                    })
                  }}
                />
              </div>

              <div className="mb-6 mt-4 ">
                <label className="block text-[#0D47A1]  text-lg  font-semibold mb-1 ">
                  {' '}
                  Credits To Add{' '}
                </label>
                <input
                  placeholder="Enter Amount"
                  value={credit}
                  onChange={(e) => setCredit(e.target.value)}
                  required
                  className="border focus:outline-none px-2  py-3 w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                  type="number"
                />
              </div>

              <div className="mt-6">
                <label className="block text-[#0D47A1]  text-lg font-semibold  "> Reason </label>
                <textarea
                  placeholder="Reason for adjustment..."
                  value={reason}
                  required
                  onChange={(e) => setReason(e.target.value)}
                  className="border resize-none focus:outline-none px-2  py-3 w-full border-[#0D47A1] text-[#0D47A1]  rounded-md "
                  type="text"
                />
              </div>
              <button
                type="submit"
                disabled={creditAllocationMutation?.isLoading}
                className={`cursor-pointer mt-4 font-semibold bg-[#0D47A1] text-[#E3F2FD] px-9 py-3 text-lg rounded-lg
                  `}
              >
                {creditAllocationMutation?.isPending ? 'Applying...' : 'Apply Adjustment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreditAllocation
