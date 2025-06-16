import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ role }) => {
  const { loginAdmin } = useSelector((state) => state.admin)

  if (!loginAdmin) return <Navigate to="/" />

  if (role && loginAdmin.role !== role) return <Navigate to="/" />

  return <Outlet />
}

export default ProtectedRoute
