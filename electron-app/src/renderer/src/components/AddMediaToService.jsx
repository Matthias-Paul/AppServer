import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import getBackendURL from './GetBackendURL'


const AddMediaToService = () => {
  const { id } = useParams()
  const [serviceDetails, setServiceDetails] = useState(null)
  const [mediaCount, setMediaCount] = useState(0)

  const fetchServiceDetails = async () => {
    const baseURL = await getBackendURL()
    console.log('base url', baseURL)
    const res = await fetch(`${baseURL}/api/services/${id}`, {
      method: 'GET'
    })
    if (!res.ok) {
      throw new Error('Failed to fetch service details')
    }
    return res.json()
  }

  const { data, isLoading } = useQuery({
    queryKey: ['serviceDetails', id],
    queryFn: fetchServiceDetails
  })

  useEffect(() => {
    if (data && data.serviceDetails) {
      setServiceDetails(data.serviceDetails)
      console.log('serviceDetails:', data.serviceDetails)
    }
  }, [data])

  return (
    <>
      <div className="pt-6 min-h-[400px] text-[#0D47A1] w-full pl-7 overflow-hidden">
        <Link className="flex items-center font-semibold text-[18px]  " to="/admin/service">
          <div className="text-[20px] mr-1 ">
            {' '}
            <FaArrowLeft />
          </div>{' '}
          Back to Services
        </Link>
        <h2 className=" mt-4 font-bold text-3xl lg:text-4xl uppercase ">
          {' '}
          {serviceDetails?.name}{' '}
        </h2>
        <h3 className="text-[20px] my-2  ">Media Count: {mediaCount} </h3>
        <div className="w-full flex gap-4 mt-8  items-center justify-center ">
          <div className="shadow-md p-5 rounded-lg h-30  w-3/5 ">
            <h2 className="font-semibold text-[20px] ">Add Media</h2>
          </div>
          <div className="shadow-md rounded-lg h-30 w-2/5 "></div>
        </div>
      </div>
    </>
  )
}

export default AddMediaToService
