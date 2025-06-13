import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

const AddMediaToService = () => {
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
          Convenant Day of prosperity{' '}
        </h2>
        <h3 className="text-[20px] my-2  ">Media Count: 8 </h3>
        <div className="w-full flex gap-4 mt-8  items-center justify-center ">
          <div className="shadow-md p-5 rounded-lg h-30  w-3/5 ">
            <h2 className='font-semibold text-[20px] ' >Add Media</h2>
          </div>
          <div className="shadow-md rounded-lg h-30 w-2/5 " >
          
          </div>
        </div>
      </div>
    </>
  )
}

export default AddMediaToService




