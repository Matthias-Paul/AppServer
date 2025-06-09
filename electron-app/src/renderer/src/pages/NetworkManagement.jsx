const NetworkManagement = () => {
  return (
    <>
      <div className="pt-7 min-h-[400px] w-full pl-7 overflow-hidden ">
        <div className="flex justify-between items-center  ">
          <h2 className=" text-[#0D47A1]  font-bold text-3xl  xl:text-4xl  ">
            {' '}
            NETWORK & CONNECTIVITY{' '}
          </h2>
          <button className="bg-[#0D47A1]  text-[#E3F2FD] text-md xl:text-xl  cursor-pointer py-2 px-6 rounded-lg text-center  ">
            Generate QR Code{' '}
          </button>
        </div>
        <div className=" mt-8 grid grid-cols-2  gap-x-6 text-[#0D47A1]">
          <div className="border rounded-xl border-[#0D47A1]  h-20 w-full ">

          </div>
          <div className="border rounded-xl border-[#0D47A1] h-20 w-full ">
            
          </div>
        </div>
      </div>
    </>
  )
}

export default NetworkManagement
