import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useInfiniteQuery, useQueryClient, useMutation, useQuery} from '@tanstack/react-query'
import getBackendURL from '../../components/GetBackendURL.jsx'



const SalesRepAnalyticsPage = () => {

  const navigate = useNavigate()
  const [baseURL, setBaseURL] = useState('')
  const token = localStorage.getItem('token')


  useEffect(() => {
    const loadURL = async () => {
      const url = await getBackendURL()
      setBaseURL(url)
    }
    loadURL()
  }, [])




  const fetchSalesAnalyticsStats = async()=>{

    const res = await fetch(`${baseURL}/api/sales/stats`,{
        method:"GET",
        headers:{
          Authorization:`Bearer ${token}`
        },
    })
      if(!res.ok){
        throw new Error("Error while fetching stats");
      }
      return res.json()

  }

    const { data } = useQuery({
      queryKey:["saleStats"],
      queryFn:fetchSalesAnalyticsStats,
      enabled: !!baseURL && !!token,
    })

    console.log(data)


    const fetchSalesAnalyticsChart = async()=>{

      const res = await fetch(`${baseURL}/api/sales/chart`,{
          method:"GET",
          headers:{
            Authorization:`Bearer ${token}`
          },
      })
        if(!res.ok){
          throw new Error("Error while fetching stats");
        }
        return res.json()

    }

      const { data: saleChart } = useQuery({
        queryKey:["saleChart"],
        queryFn:fetchSalesAnalyticsChart,
        enabled: !!baseURL && !!token,
      })

      console.log(saleChart)





  return (
    <div className="pt-7 min-h-[400px] text-[#0D47A1] w-full pl-7 overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-[#0D47A1] font-bold text-3xl xl:text-4xl">Sales Analytics</h2>
      </div>

      <div className="flex flex-wrap gap-y-5 gap-x-5 my-8 items-center justify-start text-[#0D47A1] ">
        <div className="flex flex-col items-center text-center justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
          <h1 className="font-bold text-[30px] ">₦{data?.totalRevenue?.toLocaleString()  ||  "--"  }</h1>
          <h5 className="text-[20px] ">Total Revenue</h5>
        </div>
        <div className="flex flex-col items-center text-center justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
          <h1 className="font-bold text-[30px] ">{data?.totalDownload?.toLocaleString()  ||  "--"  }</h1>
          <h5 className="text-[20px] "> Downloads </h5>
        </div>
        <div className="flex flex-col items-center text-center justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
          <h1 className="font-bold text-[30px] ">₦{data?.avgRevenue?.toFixed(2)  ||  "--"  }</h1>
          <h5 className="text-[20px] ">Avg. Revenue Per User</h5>
        </div>
        <div className="flex flex-col items-center text-center  justify-center bg-[#F8F9FA] border border-[#E1E7F1] px-9 py-4 rounded-lg  ">
          <h1 className="font-bold text-[30px] ">{data?.userRetention?.toLocaleString()  ||  "--"  }%</h1>
          <h5 className="text-[20px] "> User Retention </h5>
        </div>
      </div>

      <div className="w-full flex flex-col gap-y-8 ">
        <div className="w-full  border border-[#0D47A1] rounded-lg p-4 ">
          <h2 className="text-[#0D47A1] font-semibold text-2xl"> Revenue Trends </h2>
                    <ResponsiveContainer width="100%" height={400}>
            <LineChart data={saleChart?.revenueTrends || []} margin={{ left: 40, top: 20, bottom: 20 }}>
              <XAxis axisLine={false} tickLine={false} dataKey="name" />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`₦${value?.toLocaleString()}`, 'Revenue']}
                labelFormatter={(label) => `${label}`}
              />
              <Line
                dot={true}
                type="monotone"
                dataKey="value"
                stroke="#0D47A1"
                strokeWidth={3}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border flex-grow border-[#0D47A1] rounded-lg p-4 ">
          <h2 className="text-[#0D47A1] font-semibold text-4xl"> Top Services </h2>
          <div className="w-full">
             {saleChart?.topServices ? (
               saleChart?.topServices?.length > 0 ? (
                 <div className="overflow-x-auto relative rounded-sm lg:rounded-md">
                   <table className="text-left min-w-full mx-auto text-[#0D47A1]">
                     <thead className="font-semibold text-[25px] border-b-[2px] border-[#0D47A1]">
                       <tr>
                         <th className="py-2 pr-4 sm:py-3">Service</th>
                         <th className="py-2 px-4 sm:py-3">Revenue</th>
                         <th className="py-2 px-4 sm:py-3">Transactions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {saleChart.topServices.map((service, index) => (
                         <tr
                           key={service?.id}
                           className={`border-b-[2px] border-[#0D47A1] font-medium  cursor-pointer ${
                             index === saleChart?.topServices?.length - 1 ? 'border-b-0' : ''
                           }`}
                         >
                           <td className="py-2 pr-4 sm:py-4 text-[20px] font-medium">
                             {service?.name}
                           </td>
                           <td className="py-2 px-4 sm:py-4 text-[20px] font-medium">
                             ₦{service?.revenue?.toLocaleString() || '0'}
                           </td>
                           <td className="py-2 px-4 sm:py-4 text-[20px] font-medium">
                             {service?.transactions?.toLocaleString() || '0'}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-center">
                   <h3 className="text-[#0D47A1] font-semibold text-lg ">No Top Services Yet</h3>

                 </div>
               )
             ) : (
               <div className="flex items-center justify-center py-8">
                 <div className="text-[#0D47A1] text-lg">Loading top services...</div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesRepAnalyticsPage



