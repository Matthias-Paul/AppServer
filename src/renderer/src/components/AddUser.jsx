import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import getBackendURL from '../components/GetBackendURL.jsx'
import toast from 'react-hot-toast'
import { FaArrowLeft } from 'react-icons/fa'

const AddUser = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('client')

  const registerMutation = useMutation({
    mutationFn: async () => {
      const baseURL = await getBackendURL()
      const token = localStorage.getItem('token')

      console.log('base url', baseURL)
      const res = await fetch(`${baseURL}/api/addUser`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to add user')
      }

      const data = await res.json()

      return data
    },
    onSuccess: (data) => {
      toast.success(data.message)
      console.log('login user:', data.user)
      setUsername('')
      setEmail('')
      setPassword('')
      setRole('')

      setTimeout(() => navigate('/admin/users'), 1000)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleFormSubmit = (e) => {
    e.preventDefault()
    registerMutation.mutate({ username, email, password, role })
  }

  return (
    <>
      <div className=" relative mx-auto text-[#0D47A1]   w-full ">
        <div className=" pt-4 mb-4  w-full px-[12px] flex flex-col justify-start items-start ">
          <div className="flex items-center my-2 font-semibold text-[18px]  ">
            <Link className="flex items-center  " to="/admin/users">
              <FaArrowLeft className="text-[20px] flex mr-1" />
              <h2>Back to Users page</h2>
            </Link>
          </div>

          <h2 className=" mt-4 font-bold text-3xl lg:text-4xl text-center mb-5  uppercase ">
            Add New User{' '}
          </h2>
          <form
            onSubmit={handleFormSubmit}
            className="w-full text-[#0D47A1] mt-3 text-2xl max-w-[2000px]  rounded-lg pb-5 bg-white "
          >
            <div className="mb-6">
              <label id="username" className="block  font-semibold mb-1 ">
                {' '}
                Username{' '}
              </label>
              <input
                id="username"
                placeholder="Enter Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border px-2 focus:outline-none  py-3 w-full border-[#0D47A1] rounded-md "
                type="text"
              />
            </div>

            <div className="mb-6">
              <label id="email" className="block font-semibold mb-1 ">
                {' '}
                Email{' '}
              </label>
              <input
                id="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-2 focus:outline-none  py-3 w-full border-[#0D47A1] rounded-md "
                type="email"
              />
            </div>

            <div className="mb-3">
              <label id="password" className="block font-semibold mb-1 ">
                {' '}
                Password{' '}
              </label>
              <input
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border focus:outline-none px-2 py-3 w-full border-[#0D47A1] rounded-md "
                type="password"
              />
            </div>

            <div className="mb-3">
              <label id="password" className="block font-semibold mb-1 ">
                {' '}
                Role{' '}
              </label>

              <select
                onChange={(e) => setRole(e.target.value)}
                value={role}
                className="border focus:outline-none w-full px-1 py-3 cursor-pointer rounded-md border-[#0D47A1]"
              >
                <option value="client">Client</option>
                <option value="sales_rep">Sales Rep </option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className={`w-full text-xl mb-[-15px] mt-6 rounded-lg font-semibold p-4 
                ${registerMutation.isPending ? 'bg-[#0D47A1] cursor-not-allowed text-white ' : 'bg-[#0D47A1] cursor-pointer text-white'}`}
            >
              {registerMutation.isPending ? 'Adding...' : 'Add User'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddUser
