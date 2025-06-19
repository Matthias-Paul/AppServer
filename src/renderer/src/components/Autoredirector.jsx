import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import getBackendURL from './GetBackendURL'


const AutoRedirector = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const fetchSettingsStatus = async () => {
    const baseURL = await getBackendURL()
    const res = await fetch(`${baseURL}/api/settings/checks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Unauthorized')
    return res.json()
  }

  const { data, isError, isSuccess } = useQuery({
    queryKey: ['settings-check'],
    queryFn: fetchSettingsStatus,
    retry: false
  })

  useEffect(() => {
    if (isSuccess) {
      if (data?.setting?.is_updated) {
        navigate('/admin')
      } else {
        navigate('/admin/settings')
      }
    } else if (isError) {
      navigate('/')
    }
  }, [isSuccess, isError, data, navigate])

  return null
}

export default AutoRedirector
