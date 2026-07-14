import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const PaginationRender = ({ data, page, setPage, pageName}) => {
  return (
    <div className='md:px-2'>
      <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4">
          <p className="text-sm font-medium text-gray-600">
            Showing <span className="font-semibold">{data?.from}-{data?.to}</span> of{" "}
            <span className="font-semibold">{data?.total}</span> {pageName}
          </p>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="w-11 h-11 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition">
              <IoIosArrowBack size={18} />
            </button>
            <button className="w-11 h-11 rounded-md border border-gray-300 bg-blue-700 text-white font-semibold shadow">
              {data?.current_page}
            </button>
            <span className="px-2 text-gray-500 font-semibold">...</span>
            <button className="w-11 h-11 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition font-medium">
              {data?.last_page}
            </button>
            <button 
              disabled={data?.current_page === data?.last_page}
              onClick={() => setPage(prev => prev + 1)}
              className="w-11 h-11 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition">
              <IoIosArrowForward size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaginationRender