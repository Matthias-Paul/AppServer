import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const SalesAnalytics = () => {
  const [sort, setSort] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const revenueTrends = [
    { name: 'Day 1', value: 0 },
    { name: 'Day 2', value: 20000 },
    { name: 'Day 3', value: 15000 },
    { name: 'Day 4', value: 30000 },
    { name: 'Day 5', value: 50000 },
    { name: 'Day 6', value: 45000 },
    { name: 'Day 7', value: 70000 },
    { name: 'Day 8', value: 85000 },
    { name: 'Day 9', value: 125000 }
  ]

  const topServices = [
    { name: 'Covenant Day', revenue: '₦45,200' },
    { name: 'Sunday Worship', revenue: '₦38,900' },
    { name: 'Youth Conference', revenue: '₦25,300' }
  ]

  useEffect(() => {
    const currentFilter = searchParams.get('sortBy')

    if (!currentFilter) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sortBy', 'today')
      navigate({ search: params.toString() }, { replace: true })
    } else {
      setSort(currentFilter)
    }
  }, [searchParams, navigate])

  const handleSortChange = (e) => {
    const sortBy = e.target.value
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('sortBy', sortBy)
    setSearchParams(newParams)
  }

  return (
    <div className="pt-7 min-h-[400px] text-[#0D47A1] w-full pl-7 overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-[#0D47A1] font-bold text-3xl xl:text-4xl">Sales Analytics</h2>
        <select
          onChange={handleSortChange}
          value={searchParams.get('sortBy') || '30'}
          id="sort"
          className="border px-4 py-1 cursor-pointer rounded-md border-[#0D47A1]"
        >
          <option value="today">Today</option>
          <option value="24hours">Last 24 Hours </option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="6months">Last 6 Months</option>
          <option value="9months">Last 9 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-y-5 gap-x-5 my-8 items-center justify-start text-[#0D47A1] ">
        <div className="flex flex-col items-center text-center justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
          <h1 className="font-bold text-[30px] ">₦223,247</h1>
          <h5 className="text-[20px] ">Total Revenue</h5>
        </div>
        <div className="flex flex-col items-center text-center justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
          <h1 className="font-bold text-[30px] ">1,247</h1>
          <h5 className="text-[20px] "> Downloads </h5>
        </div>
        <div className="flex flex-col items-center text-center justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
          <h1 className="font-bold text-[30px] ">₦12,247</h1>
          <h5 className="text-[20px] ">Avg. Revenue Per</h5>
        </div>
        <div className="flex flex-col items-center text-center  justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
          <h1 className="font-bold text-[30px] ">89%</h1>
          <h5 className="text-[20px] "> User Retention </h5>
        </div>
      </div>

      <div className="w-full flex gap-x-5 ">
        <div className="w-3/5 border border-[#0D47A1] rounded-lg p-4 ">
          <h2 className="text-[#0D47A1] font-semibold text-2xl"> Revenue Trends </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrends}>
              <XAxis axisLine={false} tickLine={false} dataKey="name" />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line dot={false} type="monotone" dataKey="value" stroke="#0D47A1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border flex-grow border-[#0D47A1] rounded-lg p-4 ">
          <h2 className="text-[#0D47A1] font-semibold text-4xl"> Top Services </h2>
          <div className="w-full">
            {topServices.length > 0 ? (
              <div className="overflow-x-auto relative rounded-sm lg:rounded-md">
                <table className="text-left min-w-full mx-auto text-[#0D47A1]">
                  <thead className="font-semibold text-[25px] border-b-[2px] border-[#0D47A1]">
                    <tr>
                      <th className="py-2 pr-4 sm:py-3">Service</th>
                      <th className="py-2 px-4 sm:py-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topServices?.map((service, index) => (
                      <tr
                        key={service?.id}
                        className={`border-b-[2px] border-[#0D47A1] font-medium  cursor-pointer ${
                          index === topServices?.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="py-2 pr-4 sm:py-4 text-[20px] font-medium">
                          {service?.name}
                        </td>
                        <td className="py-2 px-4 sm:py-4 text-[20px] font-medium">
                          {service?.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-[#0D47A1] font-semibold text-lg">No Top Service Found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesAnalytics
