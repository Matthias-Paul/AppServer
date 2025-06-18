const UsersTable = ({ users, isLoading }) => {

  console.log(users)
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-[#0D47A1] font-semibold text-lg">Loading...</div>
      ) : users.length > 0 ? (
        <div className="overflow-x-auto relative rounded-sm lg:rounded-md">
          <table className="text-left min-w-full mx-auto text-[#0D47A1]">
            <thead className="font-bold text-[25px] border-b-[0.5px] border-[#0D47A1]">
              <tr>
                <th className="py-2 pr-4 sm:py-3">Username</th>
                <th className="py-2 px-4 sm:py-3">Email</th>
                <th className="py-2 px-4 sm:py-3">Role</th>
                <th className="py-2 px-4 sm:py-3">Credits</th>
                <th className="py-2 px-4 sm:py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr
                  key={user?.id}
                  className={`border-b-[0.5px] border-[#0D47A1] font-medium text-[20px] cursor-pointer ${
                    index === users?.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-2 pr-4 sm:py-4 font-medium">{user?.username}</td>
                  <td className="py-2 px-4 sm:py-4 font-medium">{user?.email}</td>
                  <td className="py-2 px-4 sm:py-4">{user?.role}</td>
                  <td className="py-2 px-4 sm:py-4">
                    {user?.role === 'admin'
                      ? 'admin'
                      : user?.role === 'sales_rep'
                        ? 'N/A'
                        : user?.role === 'client'
                          ? Number(user?.credits).toFixed(2)
                          : 'admin'}
                  </td>
                  <td className="py-2 px-4 sm:py-4 font-medium">
                    {user?.created_at
                        ? new Date(user.created_at).toISOString().split('T')[0]
                        : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-[#0D47A1] font-semibold text-lg">No User Found.</div>
      )}
    </div>
  )
}

export default UsersTable
