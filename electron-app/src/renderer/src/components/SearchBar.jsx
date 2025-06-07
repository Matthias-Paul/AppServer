import { useEffect, useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2'
import { useNavigate, useSearchParams } from 'react-router-dom'

const SearchBar = ({placeholder}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    setSearchTerm(currentSearch)
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams)
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim())
    } else {
      params.delete('search')
    }

    navigate({ search: params.toString() })
    setSearchTerm("")
  }
  return (
    <>
      <div className=" flex w-full items-center my-5 ">
        <form className='w-full' onSubmit={handleSearch}>
          <div className=" relative" >
            <input
              type="text"
              className=" pl-[70px] w-full border border-[#1A1A1A] text-[25px] focus:outline-none rounded-lg py-[7px] pr-[4px] "
              value={searchTerm}
              placeholder={placeholder}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className=" left-5 top-[8px] absolute cursor-pointer ">
              <HiMagnifyingGlass className="w-9 h-9  " />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default SearchBar
