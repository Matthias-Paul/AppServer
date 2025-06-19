

const Settings = () => {
  return (
    <>
      <div className=" pt-7 h-full text-[#0D47A1] w-full pl-7 overflow-hidden" >
        <h2 className=" text-[#0D47A1] mb-8 font-bold text-3xl lg:text-5xl "> Settings </h2>
        <div className="p-4  rounded-lg shadow-lg border w-full border-[#0D47A1] " >
            <h2 className="text-2xl font-semibold  my-3 " > Update Church Name </h2>
            <input type="text" className="border my-2  border-[#0D47A1] p-2 w-full rounded-lg focus:outline-none text-[20px]     "  placeholder="Enter church name"     />
        </div>


        <div className="p-4  rounded-lg mt-12 shadow-lg border w-full border-[#0D47A1] " >
            <h2 className="text-2xl font-semibold  my-3 " > Update Church Logo </h2>

        </div>        
        

      </div>  
    </>
  )
}

export default Settings
