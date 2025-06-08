import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { signInSuccess } from '../redux/slice/adminSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import getBackendURL from '../components/GetBackendURL.jsx'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loginAdmin } = useSelector((state) => state.admin)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: async () => {
      const baseURL = await getBackendURL()
      console.log('base url', baseURL)
      // Send user details to the backend
      const res = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to log in')
      }

      const data = await res.json()

      return data
    },
    onSuccess: (data) => {
      toast.success('Log in successful! Redirecting to admin dashboard...')
      dispatch(signInSuccess(data.user))
      console.log('login user:', data.user)
      setEmail('')
      setPassword('')
      setTimeout(() => navigate('/admin'), 1000)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleFormSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <>
      <div className="py-[100px]  max-w-[1400px] relative mx-auto  flex w-full ">
        <div className=" flex w-full px-[12px] justify-center items-center ">
          <form
            onSubmit={handleFormSubmit}
            className="w-full  border-gray-200  max-w-[700px] px-20 rounded-lg pb-5 bg-white "
          >
            <h2 className=" text-2xl font-bold text-center mb-2 "> Hey there! </h2>
            <p className=" text-center mb-4 ">Enter your username and password to login</p>
            <div className="mb-6">
              <label id="email" className="block text-sm font-semibold mb-1 ">
                {' '}
                Email{' '}
              </label>
              <input
                id="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-2  py-3 w-full border-gray-400 rounded-md "
                type="email"
              />
            </div>

            <div className="mb-3">
              <label id="password" className="block text-sm font-semibold mb-1 ">
                {' '}
                Password{' '}
              </label>
              <input
                id="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-2 py-3 w-full border-gray-400 rounded-md "
                type="password"
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={`w-full text-lg mb-[-15px] mt-6 rounded-lg font-semibold p-3 
                ${loginMutation.isPending ? 'bg-gray-800 cursor-not-allowed text-white ' : 'bg-black hover:bg-gray-800 cursor-pointer text-white'}`}
            >
              {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </button>
            {/* google auth button */}

            <p className="mt-[12px] text-md text-center ">
              Don't have an account?
              <Link to="/register" className="text-blue-500 ml-1 ">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
