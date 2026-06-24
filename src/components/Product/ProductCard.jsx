import React from 'react'
import { BiCartAdd } from 'react-icons/bi'
import { MdOutlineImageNotSupported } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, resetCartItemStatus } from '../../feature/cartTemp/cartTempSlice';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {

  const dispatch = useDispatch();
  const isOutOfStock = product.stock_quantity === 0
  
  // Handle add to sale
  const handleAddItemToSale = async () => {
    try {
      
      if(isOutOfStock) return;

      // Add to cart
      dispatch(addItemToCart({
        product_id: product.id, 
        product_name: product.product_name,
        quantity: 1, 
        unit_price: product.selling_price,
        image_url: product.image_url
      }))

      await Swal.fire({
        title: "Added to cart",
        text: "Item added to cart successfully.",
        icon: "success",
        timer: 1500
      })
      
      dispatch(resetCartItemStatus());
    } catch (error) {
      await Swal.fire({
        title: "Failed to add",
        text: "Failed to add items to cart.",
        icon: "error",
        timer: 1500
      })
      console.log(error);
    }
  }

  return (
    <div className='relative w-full flex flex-col flex-1 justify-start rounded-md shadow-sm hover:shadow-md border border-slate-200 md:space-y-2 space-y-1.5 group overflow-hidden'>
      <div className='relative w-full md:h-40 h-60 overflow-hidden flex justify-center items-center'>
        {product.image_url ? (
          <img
            src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image_url}`}
            alt={product.product_name}
            className={`object-cover w-full h-full rounded-t-md transform ease-in-out duration-200 ${
              isOutOfStock ? 'grayscale opacity-60' : 'group-hover:scale-110'
            }`}
          />
        ) : (
          <div className='flex flex-col justify-center items-center text-slate-500'>
            <MdOutlineImageNotSupported size={20} />
            <span className='text-xs'>No Image Available</span>
          </div>
        )}

        {isOutOfStock && (
          <div className='absolute inset-0 bg-black/35 flex items-center justify-center'>
            <span className='px-4 py-1.5 rounded-full bg-gray-500 text-white/80 text-sm font-semibold tracking-wide'>
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      <div className='flex flex-col md:space-y-2.5 space-y-1.5 md:p-2 p-1.5 mt-2'>
        <div className='space-y-1'>
          <h1
            className={`md:text-xl text-lg font-medium tracking-wide ${
              isOutOfStock ? 'line-through text-slate-400' : 'text-black'
            }`}
          >
            {product.product_name}
          </h1>

          <p className={`text-slate-500 text-sm text-wrap ${isOutOfStock ? 'opacity-70' : ''}`}>
            {product.description}
          </p>

          <p className='text-slate-500 text-sm text-wrap'>
            Available Stock: <span>{product.stock_quantity}</span>
          </p>
        </div>

        <p className='absolute top-2 right-2 py-1 px-2 text-white font-medium bg-blue-500 rounded-md text-sm tracking-wide'>
          ${product.selling_price}
        </p>

        <button
          onClick={handleAddItemToSale}
          disabled={isOutOfStock}
          className={`flex justify-center items-center md:gap-1.5 gap-1 md:p-2 p-1.5 font-medium rounded-md transition-all ease-in-out duration-300 group ${
            isOutOfStock
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-blue-100 text-blue-500/80 hover:text-white hover:bg-blue-500 cursor-pointer'
          }`}
          title='Add-Item'
        >
          <BiCartAdd size={18} className='transform group-hover:scale-110' />
          {isOutOfStock ? 'Unavailable' : 'Quick Add'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard