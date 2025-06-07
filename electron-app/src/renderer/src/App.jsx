import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLayout from './layouts/AdminLayout'
import AdminHomePage from './pages/AdminHomePage'
import UserManagement from './pages/UserManagement'


function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
     
          {/* Admin routes (protected) */}
          {/* <Route element={<ProtectedRoute role="admin" />}> */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              
            </Route>
          {/* </Route> */}
        </Routes>

        <Toaster position="top-right" />
      </Router>
    </>
  );
}

export default App;
