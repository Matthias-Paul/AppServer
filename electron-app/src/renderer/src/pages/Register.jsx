import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { signInSuccess } from '../redux/slice/adminSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import getBackendURL from '../components/GetBackendURL.jsx'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const registerMutation = useMutation({
    mutationFn: async () => {
      // Send user details to the backend
      const baseURL = await getBackendURL()
      console.log('base url', baseURL)
      // Send user details to the backend
      const res = await fetch(`${baseURL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          role
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to sign up')
      }

      const data = await res.json()

      return data
    },
    onSuccess: (data) => {
      toast.success('Sign up successful! Redirecting to log in page...')
      dispatch(signInSuccess(data.user))
      console.log('login user:', data.user)
      setUsername('')
      setEmail('')
      setPassword('')
      setRole('')

      setTimeout(() => navigate('/'), 1000)
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
      <div className=" relative mx-auto  flex w-full ">
        <div className=" pt-[100px] mb-4 flex w-full px-[12px] justify-center items-center ">
          <form
            onSubmit={handleFormSubmit}
            className="w-full text-[#0D47A1] text-2xl max-w-[1000px] px-5 sm:px-15 md:px-40 lg:px-20 rounded-lg pb-5 bg-white "
          >
            <h2 className=" text-3xl font-bold text-center mb-2 "> Hey there! </h2>
            <p className=" text-center mb-4 ">
              Enter your username, email, password and role to register
            </p>
            <div className="mb-6">
              <label id="username" className="block  font-semibold mb-1 ">
                {' '}
                Username{' '}
              </label>
              <input
                id="username"
                placeholder="Enter Your Name"
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
                placeholder="Enter Your Email Address"
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
                placeholder="Enter Your Password"
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
              {registerMutation.isPending ? 'Signing Up...' : 'Sign Up'}
            </button>

            <p className="mt-[15px] text-md text-center ">
              Already have an account?
              <Link to="/" className="text-[#0D47A1] ml-1 ">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register
