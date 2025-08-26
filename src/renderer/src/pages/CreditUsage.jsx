import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import getBackendURL from '../components/GetBackendURL.jsx'
import { useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const CreditUsage = () => {
  const token = localStorage.getItem('token')
  const [baseURL, setBaseURL] = useState('')

  useEffect(() => {
    const loadURL = async () => {
      const url = await getBackendURL()
      setBaseURL(url)
    }
    loadURL()
  }, [])

  const fetchUsage = async ({ pageParam = 1 }) => {
    const res = await fetch(`${baseURL}/api/credit/usage?page=${pageParam}&limit=16`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch usage')
    }
    return res.json()
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['usage'],
    queryFn: fetchUsage,
    getNextPageParam: (lastPage, pages) => (lastPage.hasNextPage ? pages.length + 1 : undefined),
    enabled: !!baseURL
  })

  const creditsUsage = data?.pages.flatMap((page) => page.transactions) || []
  console.log(creditsUsage)

  function formatToReadable(dateString) {
    const date = new Date(dateString)
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }

    const [month, day, year] = date.toLocaleDateString('en-US').split('/')
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    return `${year}-${month}-${day} ${time}`
  }

  return (
    <>
      <div className="w-full mt-5 p-4 shadow-lg ">
        {isLoading ? (
          <div className="text-[#0D47A1] font-semibold text-lg">Loading...</div>
        ) : creditsUsage.length > 0 ? (
          <div className=" w-[700px] lg:w-full mx-auto relative rounded-sm lg:rounded-md">
            <table className="text-left rounded-lg  min-w-full mx-auto text-[#0D47A1]">
              <thead className="font-bold text-[25px] border-b-[0.5px] border-[#0D47A1]">
                <tr>
                  <th className="py-2 px-4 sm:py-3">User</th>
                  <th className="py-2 px-4 sm:py-3">Resource</th>
                  <th className="py-2 px-4 sm:py-3">Credit Amount</th>
                  <th className="py-2 px-4 sm:py-3">Date and Time</th>
                </tr>
              </thead>
              <tbody>
                {creditsUsage?.map((usage, index) => (
                  <tr
                    key={usage?.id}
                    className={`border-b-[0.5px] border-[#0D47A1]  font-medium text-[20px] cursor-pointer ${
                      index === creditsUsage?.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-2 pr-4 sm:py-4  font-medium">
                      {usage?.user?.username}
                    </td>
                    <td className="py-2 px-4 sm:py-4  font-medium">
                      {usage?.media?.title}
                    </td>
                    <td className="py-2 px-4  sm:py-4">{usage?.credits_used}</td>

                    <td className="py-2 px-4 sm:py-4 font-medium">
                      {formatToReadable(usage?.transaction_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-[#0D47A1] font-semibold text-lg">No credits usage  Found.</div>
        )}

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
      </div>
    </>
  )
}

export default CreditUsage

