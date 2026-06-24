import React from 'react'

const SaleCard = ({ sale, product }) => {

  const imageUrl = product?.image_url 
    ? `${import.meta.env.VITE_BASE_URL}/storage/${product.image_url}`
    : "https://picsum.photos/id/237/200/300";
  const quantity = product?.pivot?.quantity || 1;
  const unitPrice = parseFloat(product?.pivot?.unit_price || product?.selling_price || 0);

  return (
    <div className='w-full flex md:gap-3 gap-2 items-start border-b border-gray-200 last:border-0 bg-white rounded-lg shadow-sm p-3'>
      <div className='w-20 h-20 shrink-0'>
        <img 
          src={imageUrl}
          alt={product?.product_name || "Unknow Product"}
          className='w-full h-full object-cover rounded-lg shadow-md'
        />
      </div>
      
      <div className='flex justify-between items-start flex-1'>
        <div className='flex-1'>
          <h2 className='font-semibold text-gray-800 md:text-base text-sm'>{product?.product_name || "Unknown Product"}</h2>
          <p className='text-gray-600 text-sm font-medium mt-1'>${unitPrice || "Unknown"}</p>
          
          <div className='flex gap-x-2 items-center md:mt-2 mt-1.5'>
            <button className='w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition shadow-sm cursor-pointer'>
              <FiMinus size={18}/>
            </button>
            <span className='w-6 text-center font-semibold text-gray-700'>{quantity}</span>
            <button className='w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition shadow-sm cursor-pointer'>
              <FiPlus size={18}/>
            </button>
          </div>
        </div>
        
        <button className='bg-red-50 p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 transition shadow-sm cursor-pointer'>
          <FaRegTrashCan size={18}/>
        </button>
      </div>
    </div>
  )
}

export default SaleCard