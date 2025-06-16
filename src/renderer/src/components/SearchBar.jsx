import { useEffect, useState } from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { useNavigate, useSearchParams } from 'react-router-dom'

const SearchBar = ({ placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Load initial search value from URL
  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    setSearchTerm(currentSearch)
  }, [searchParams])

  // Debounce logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim())
      } else {
        params.delete('search')
      }
      navigate({ search: params.toString() }, { replace: true })
    }, 400) // delay in ms

    return () => clearTimeout(delayDebounce) // cleanup
  }, [searchTerm])

  return (
    <div className="flex w-full items-center my-5">
      <div className="relative w-full">
        <input
          type="text"
          className="pl-[70px] w-full border border-[#0D47A1] text-[25px] text-[#0D47A1] focus:outline-none rounded-lg py-[7px] pr-[4px]"
          value={searchTerm}
          placeholder={placeholder}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="left-5 top-[8px] absolute pointer-events-none">
          <HiMagnifyingGlass className="w-9 h-9 text-[#0D47A1]" />
        </div>
      </div>
    </div>
  )
}

export default SearchBar
