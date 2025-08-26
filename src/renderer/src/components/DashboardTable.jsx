const DashboardTable = ({ isLoading, activities }) => {
  console.log(activities)
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-[#0D47A1] font-semibold text-lg">Loading...</div>
      ) : activities.length > 0 ? (
        <div className=" w-[700px] lg:w-full mx-auto relative rounded-sm lg:rounded-md">
          <table className="text-left rounded-lg  min-w-full mx-auto text-[#0D47A1]">
            <thead className="font-bold text-[25px] border-b-[0.5px] border-[#0D47A1]">
              <tr>
                <th className="py-2 pr-4 sm:py-3">Time</th>
                <th className="py-2 px-4 sm:py-3">User</th>
                <th className="py-2 px-4 sm:py-3">Action</th>
                <th className="py-2 px-4 sm:py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {activities?.map((activity, index) => (
                <tr
                  key={activity?.id}
                  className={`border-b-[0.5px] border-[#0D47A1]  font-medium text-[20px] cursor-pointer ${
                    index === activities?.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                <td className="py-2 pr-4 sm:py-4 font-medium">
                  {new Date(activity?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </td>
                  <td className="py-2 px-4 sm:py-4  font-medium">{activity?.user?.email}</td>
                  <td className="py-2 px-4  sm:py-4">{activity?.action}</td>

                  <td className="py-2 px-4 sm:py-4 font-medium">{activity?.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-[#0D47A1] font-semibold text-lg">No Recent Activities Found.</div>
      )}
    </div>
  )
}

export default DashboardTable
