import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { UpdateChurchProfile } from '../redux/slice/adminSlice'
import getBackendURL from '../components/GetBackendURL'
import { useSelector, useDispatch } from 'react-redux'

const Settings = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const { churchProfile } = useSelector((state) => state.admin)
  const [churchName, setChurchName] = useState('')
  const [churchLogoFileName, setChurchLogoFileName] = useState('')
  const [churchBannerFileName, setChurchBannerFileName] = useState('')
  const [url, setUrl] = useState('')


  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    return allowedTypes.includes(file.type)
  }

  const handleFileChangeForLogo = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!validateImageFile(file)) {
        toast.error('Only image files (jpeg, jpg, png) are allowed for logo')
        e.target.value = ''
        return
      }
      setChurchLogoFileName(file.name)
    }
  }

  const handleFileChangeForBanner = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!validateImageFile(file)) {
        toast.error('Only image files (jpeg, jpg, png) are allowed for banner')
        e.target.value = ''
        return
      }
      setChurchBannerFileName(file.name)
    }
  }
  const token = localStorage.getItem('token')

  const fetchSettingsStatus = async () => {
    const baseURL = await getBackendURL()
    setUrl(baseURL)
    const res = await fetch(`${baseURL}/api/settings/checks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Unauthorized')
    return res.json()
  }

  const { data: settingCheck, isSuccess } = useQuery({
    queryKey: ['settings-check'],
    queryFn: fetchSettingsStatus
  })

  useEffect(() => {
    if (isSuccess && settingCheck?.setting) {
      const { church_name } = settingCheck.setting
      setChurchName(church_name || '')

      dispatch(UpdateChurchProfile(settingCheck.setting))
    }
  }, [isSuccess, settingCheck, dispatch])

  const UpdateChurchInfo = async (formData) => {
    const baseURL = await getBackendURL()
    console.log('base url', baseURL)
    const res = await fetch(`${baseURL}/api/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to update ')
    }

    return data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateChurchInfo,
    onSuccess: (data) => {
      toast.success(data.message)
      setChurchBannerFileName('')
      setChurchLogoFileName('')
      setChurchName('')
      document.getElementById('banner-upload').value = ''
      document.getElementById('logo-upload').value = ''
      queryClient.invalidateQueries(['settings-check'])
      // navigate(`/admin`)
    },
    onError: (error) => {
      toast.error(error.message)
      console.log(error.message)
    }
  })
  const handleSubmit = (e) => {
    e.preventDefault()

    const bannerInput = document.getElementById('banner-upload')
    const logoInput = document.getElementById('logo-upload')
    const bannerFile = bannerInput?.files[0]
    const logoFile = logoInput?.files[0]
    const nameProvided = churchName.trim()

    const isFirstTimeSetup =
      !settingCheck?.setting ||
      !settingCheck?.setting.church_name ||
      !settingCheck?.setting.church_logo_file_path ||
      !settingCheck?.setting.church_banner_file_path

    if (isFirstTimeSetup) {
      if (!nameProvided || !logoFile || !bannerFile) {
        toast.error('All fields are required for initial setup')
        return
      }
    } else {
      if (!nameProvided && !logoFile && !bannerFile) {
        toast.error('Please fill at least one field to update')
        return
      }
    }

    const formData = new FormData()
    if (nameProvided) formData.append('churchName', nameProvided)
    if (logoFile) formData.append('church_logo', logoFile)
    if (bannerFile) formData.append('church_banner', bannerFile)

    mutate(formData)
  }

  console.log(churchProfile)

  const churchLogo =
    churchProfile?.church_logo_file_path && url
      ? `${url}${churchProfile.church_logo_file_path} `
      : ''

  const churchBanner =
    churchProfile?.church_banner_file_path && url
      ? `${url}${churchProfile.church_banner_file_path} `
      : ''

  console.log('ChurchImages', churchLogo, churchBanner)

  return (
    <>
      <div className=" pt-7  h-full text-[#0D47A1] w-full pl-7 overflow-hidden">
        <h2 className=" text-[#0D47A1] mb-6 font-bold text-3xl lg:text-5xl "> Settings </h2>
        <h2 className=" text-[#0D47A1] mb-6 font-bold text-3xl  ">
          {' '}
          Update Church Name, Logo, and Banner{' '}
        </h2>
        <div className=" w-full ">
          <h2 className="text-2xl font-semibold  mb-1 "> Church Name </h2>
          <input
            type="text"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            className="border mb-4  border-[#0D47A1] py-3 px-2 w-full rounded-lg focus:outline-none text-2xl xl:text-2xl"
            placeholder="Enter church name"
          />
        </div>
        <div className="mb-6  mt-5 ">
          <label className="block text-[#0D47A1]  text-2xl xl:text-2xl font-semibold mb-1 ">
            {' '}
            Upload Church Logo
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              id="logo-upload"
              type="file"
              className="hidden"
              onChange={handleFileChangeForLogo}
            />

            <input
              type="text"
              value={churchLogoFileName}
              readOnly
              placeholder="No file chosen"
              className="border border-[#0D47A1] rounded-lg xl:text-2xl  px-2 py-3  w-full text-lg xl:text-2xl focus:outline-none "
            />

            <label
              htmlFor="logo-upload"
              className="cursor-pointer bg-[#0D47A1] text-[#E3F2FD]  px-6 py-3  rounded-lg "
            >
              Browse
            </label>
          </div>
        </div>
        {churchLogo && (
          <div className="my-4">
            <p className="font-semibold text-xl mb-3 ">Current Church Logo:</p>
            <img
              src={churchLogo}
              alt="Church Banner"
              className="w-full max-w-xl border border-[#0D47A1] object-cover  rounded-lg "
            />
          </div>
        )}
        <div className="mb-6 mt-11  ">
          <label className="block text-[#0D47A1]  text-2xl xl:text-2xl font-semibold mb-1 ">
            {' '}
            Upload Church Banner
          </label>
          <div className="flex items-center gap-2 mt-1">
            <input
              id="banner-upload"
              type="file"
              className="hidden"
              onChange={handleFileChangeForBanner}
            />

            <input
              type="text"
              value={churchBannerFileName}
              readOnly
              placeholder="No file chosen"
              className="border border-[#0D47A1] rounded-lg xl:text-2xl  px-2 py-3  w-full text-lg xl:text-2xl focus:outline-none "
            />

            <label
              htmlFor="banner-upload"
              className="cursor-pointer bg-[#0D47A1] text-[#E3F2FD]  px-6 py-3  rounded-lg "
            >
              Browse
            </label>
          </div>

          {churchBanner && (
            <div className="my-4">
              <p className="font-semibold text-xl mb-3 ">Current Church Banner:</p>
              <img
                src={churchBanner}
                alt="Church Banner"
                className="w-full max-w-xl border object-cover border-[#0D47A1]  rounded-lg "
              />
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="cursor-pointer my-6 bg-[#0D47A1] text-lg xl:text-2xl font-semibold text-[#E3F2FD] w-full py-4 rounded-lg transition"
        >
          {isPending ? ' Updating...' : ' Update'}
        </button>{' '}
      </div>
    </>
  )
}

export default Settings
