import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLayout from './layouts/AdminLayout'
import AdminHomePage from './pages/AdminHomePage'
import UserManagement from './pages/UserManagement'
import ProtectedRoute from './components/ProtectedRoute'
import NetworkManagement from './pages/NetworkManagement'
import SalesAnalytics from './pages/SalesAnalytics'
import MediaManagement from './pages/MediaManagement'
import ServiceManagement from './pages/ServiceManagement'
import CreditManagement from './pages/CreditManagement'
import CreateNewService from './components/CreateNewService'
import AddMediaToService from './components/AddMediaToService'
import UploadMedia from './components/UploadMedia'
import AddUser from './components/AddUser'
import EditMedia from './components/EditMedia'
import Settings from './pages/Settings'
import AutoRedirector from './components/Autoredirector'
import EditService from './components/EditService'
import ManageMediaInAService from './components/ManageMediaInAService'
import AddExistingMediaToService from './components/AddExistingMediaToService'
import CreditHistory from "./pages/CreditHistory"
import CreditUsage from  "./pages/CreditUsage"
import CreditAllocation from  "./pages/CreditAllocation"
import SalesRepMediaPage from './pages/sales-rep-pages/SalesRepMediaPage'
import SalesRepLayout from './pages/sales-rep-pages/SalesRepLayout'
import SalesRepCreditPage from './pages/sales-rep-pages/SalesRepCreditPage'
import SalesRepAnalyticsPage from './pages/sales-rep-pages/SalesRepAnalyticsPage'


function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* salesRep routes (protected) */}
          <Route element={<ProtectedRoute role="sales_rep" />}>
            <Route path="/salesRep" element={ <SalesRepLayout /> }>
                <Route index element={<SalesRepMediaPage />} />
                <Route path="credit" element={<SalesRepCreditPage />} />
                <Route path="analytics" element={<SalesRepAnalyticsPage />} />
            </Route>
          </Route>


          {/* Admin routes (protected) */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/redirector" element={<AutoRedirector />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/addUser" element={<AddUser />} />
              <Route path="network" element={<NetworkManagement />} />
              <Route path="sales" element={<SalesAnalytics />} />
              <Route path="service" element={<ServiceManagement />} />

              <Route path="credit" element={<CreditManagement />}>
                <Route index element={<CreditAllocation />} />
                <Route path="history" element={<CreditHistory />} />
                <Route path="usage" element={<CreditUsage />} />


              </Route>
              <Route path="settings" element={<Settings />} />
              <Route path="service/newService" element={<CreateNewService />} />
              <Route path="media" element={<MediaManagement />} />
              <Route path="media/upload" element={<UploadMedia />} />
              <Route path="media/edit/:id" element={<EditMedia />} />
              <Route path="service/:id/addMedia" element={<AddMediaToService />} />
              <Route path="service/edit/:id" element={<EditService />} />
              <Route path="service/manageMedia/:id" element={<ManageMediaInAService />} />
              <Route path="service/addExistingMedia/:id" element={<AddExistingMediaToService />} />


            </Route>
          </Route>

        </Routes>

        <Toaster position="top-right" />
      </Router>
    </>
  )
}

export default App
