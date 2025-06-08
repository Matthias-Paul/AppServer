const UsersTable = () => {
  const users = [
    {
      _id: 1222,
      username: 'Michael Newton',
      email: 'Michael@gmail.com',
      role: 'Admin',
      credits:"23",
      createdAt:"22-03-2021"
    },
    {
      _id: 122233,
      username: 'Michael Joseph',
      email: 'Joseph@gmail.com',
      credits:"23",
      role: 'client',
    createdAt:"22-03-2021"

    },
     {
      _id: 12223333,
      username: 'Michael Joseph',
      email: 'Joseph@gmail.com',
      credits:"23",
      role: 'sales-rep',
    createdAt:"22-03-2021"

    },
    {
      _id: 11111222,
      username: 'Michael Newton',
      email: 'Michael@gmail.com',
      role: 'Admin',
      credits:"23",
      createdAt:"22-03-2021"
    },
    {
      _id: 122211133,
      username: 'Michael Joseph',
      email: 'Joseph@gmail.com',
      credits:"23",
      role: 'client',
    createdAt:"22-03-2021"

    },
     {
      _id: 12222223333,
      username: 'Michael Joseph',
      email: 'Joseph@gmail.com',
      credits:"23",
      role: 'sales-rep',
    createdAt:"22-03-2021"

    }
  ]

  return (
    <>
      <div className="w-full " >
        {users.length > 0 ? (
          <div
            className={`  overflow-x-auto  relative rounded-sm lg:rounded-md `}
          >
            <table className="  text-left min-w-full mx-auto text-[#0D47A1]  ">
              <thead className="font-bold text-[25px] border-b-[2px] border-[#0D47A1]  ">
                <tr>
                  <th className="py-2 pr-4 sm:py-3 "> Username </th>
                  <th className="py-2 px-4 sm:py-3 "> Email </th>
                  <th className="py-2 px-4 sm:py-3 "> Role </th>
                  <th className="py-2 px-4 sm:py-3 "> Credits </th>
                  <th className="py-2 px-4 sm:py-3 "> Created </th>

                </tr>
              </thead>
              <tbody>
                {users?.map((user, index) => (
                  <tr
                    key={user?._id}
                    className={`border-b-[2px] border-[#0D47A1] font-medium text-[20px] cursor-pointer  ${index === users?.length - 1 ? 'border-b-0' : ''} `}
                  >
                    <td className="py-2 pr-4 sm:py-4  font-medium  ">
                      {user?.username}
                    </td>
                    <td className="py-2 px-4 sm:py-4  font-medium  ">
                      {user?.email}
                    </td>

                    <td className="py-2 px-4 sm:py-4 ">
                      {user?.role}
                    </td>
                    <td className="py-2 px-4 sm:py-4 ">
                        {
                            user?.role === "admin"
                            ? "Admin"
                            : user?.role === "sales-rep"
                            ? "N/A"
                            : user?.role === "client"
                            ? Number(user?.credits).toFixed(2)
                            : "Admin"
                        }
                    </td>

                     <td className="py-2 px-4 sm:py-4  font-medium  ">
                    {new Date(user?.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-700 font-semibold text-lg ">No User Found.</div>
        )}
      </div>
    </>
  )
}

export default UsersTable
