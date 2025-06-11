import { useState, useEffect } from 'react'

const AdminHomePage = () => {
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
      <div className=" pt-7 min-h-[400px] w-full pl-7 overflow-hidden ">
        <div className="flex justify-between items-center  ">
          <div className="flex flex-col">
            <h2 className=" text-[#0D47A1]  font-bold text-3xl  xl:text-4xl  ">DashBoard</h2>
            <h4 className="mt-2 text-lg font-semibold text-[#0D47A1] ">Wellcome, Admin.</h4>
          </div>

          <div>
            <h4 className="mt-2 text-xl text-[#0D47A1] ">Wellcome, Admin.</h4>
            <h5 className="mt-2 text-lg text-[#0D47A1] " >Today: {currentDate} </h5>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminHomePage
