import { useState, useEffect } from 'react'
import adminPic from '../assets/adminPics.png'
import DashboardTable from '../components/DashboardTable'
import { useInfiniteQuery, useQueryClient, useMutation, useQuery} from '@tanstack/react-query'
import getBackendURL from '../components/GetBackendURL.jsx'


const AdminHomePage = () => {



const token = localStorage.getItem('token')
  const [baseURL, setBaseURL] = useState('')

  useEffect(() => {
    const loadURL = async () => {
      const url = await getBackendURL()
      setBaseURL(url)
    }
    loadURL()
  }, [])

  const fetchActivities = async ({ pageParam = 1 }) => {
    const res = await fetch(`${baseURL}/api/recent/activities?page=${pageParam}&limit=20`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch activities')
    }
    return res.json()
  }

  const { data:dashBoardTable , fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
    getNextPageParam: (lastPage, pages) => (lastPage.hasNextPage ? pages.length + 1 : undefined),
    enabled: !!baseURL
  })

  const activities = dashBoardTable?.pages.flatMap((page) => page.data) || []
  console.log(activities)


const fetchDashBoardDetail = async()=>{

  const res = await fetch(`${baseURL}/api/dashboard/Details`,{
      method:"GET",
      headers:{
        Authorization:`Bearer ${token}`
      },
  })
    if(!res.ok){
      throw new Error("Error while fetching dashboard details");
    }
    return res.json()

}

  const {data } = useQuery({
    queryKey:["dashboardDetails"],
    queryFn:fetchDashBoardDetail
  })

  console.log(data)











  const [currentDate, setCurrentDate] = useState(() =>
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  )

  useEffect(() => {
    const updateDate = () => {
      const newDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      setCurrentDate(newDate)
    }

    // Calculate time until midnight
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
    const msUntilMidnight = nextMidnight - now

    const midnightTimeout = setTimeout(() => {
      updateDate()

      const interval = setInterval(updateDate, 24 * 60 * 60 * 1000)
      return () => clearInterval(interval)
    }, msUntilMidnight)

    return () => clearTimeout(midnightTimeout)
  }, [])

  return (
    <>
      <div className=" w-full pl-7 overflow-hidden ">
        <div className="flex justify-between items-center  ">
          <div className="flex items-center">
            <div className="flex flex-col">
              <h2 className=" text-[#0D47A1]  font-bold text-3xl  xl:text-4xl  ">DashBoard</h2>
              <h4 className="mt-2 text-lg font-semibold text-[#0D47A1] ">Wellcome, Admin.</h4>
            </div>
            <div>
              <img className="w-50 h-50" src={adminPic} />
            </div>
          </div>
          <div>
            <h4 className="mt-2 font-semibold text-xl text-[#0D47A1] ">Wellcome, Admin.</h4>
            <h5 className="mt-2 text-lg text-[#0D47A1] ">Today: {currentDate} </h5>
          </div>
        </div>

        <div className="flex flex-wrap gap-y-5 gap-x-5  items-center justify-start text-[#0D47A1] ">
          <div className="flex flex-col items-center text-center justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
            <h1 className="font-bold text-[30px] ">{data?.totalUsers || "--"}</h1>
            <h5 className="text-[20px] ">Total Users</h5>
          </div>
          <div className="flex flex-col items-center text-center justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
            <h1 className="font-bold text-[30px] ">{data?.totalCreditsAllocated || "--"}</h1>
            <h5 className="text-[20px] ">Credits Sold</h5>
          </div>
          <div className="flex flex-col items-center text-center justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
            <h1 className="font-bold text-[30px] ">{data?.totalActiveService || "--"}</h1>
            <h5 className="text-[20px] ">Actives Services</h5>
          </div>
          <div className="flex flex-col items-center text-center  justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
            <h1 className="font-bold text-[30px] ">{data?.totalMedia || "--"}</h1>
            <h5 className="text-[20px] ">Media Files</h5>
          </div>
        </div>

        <h2 className="font-bold text-[30px] mt-4 text-[#0D47A1]    "> Recents Activities</h2>
        <div className="pb-10 mt-4 bg-[#F8F9FA] rounded-lg px-4 py-2  border border-[#E1E7F1]">
          <DashboardTable activities={activities} />
          {hasNextPage && (
            <div className="flex justify-center items-center">
              <button
                className="rounded py-1 px-4 bg-[#0D47A1] my-4 text-[#E3F2FD] text-2xl  cursor-pointer"
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

export default AdminHomePage
