import React from 'react'
import { FaRegTrashCan } from 'react-icons/fa6';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { decreaseQuantityOnCart, increaseQuantityOnCart, removeItemFromCart, resetCartItemStatus } from '../../feature/cartTemp/cartTempSlice';

const CartItemCard = ({ product }) => {

  const dispatch = useDispatch();

  const imageUrl = product?.image_url 
    ? `${import.meta.env.VITE_BASE_URL}/storage/${product.image_url}`
    : "https://picsum.photos/id/237/200/300";
  const quantity = product?.pivot?.quantity || product?.quantity || 1;
  const unitPrice = parseFloat(product?.pivot?.unit_price || product?.unit_price || 0);

  const handleIncreaseQuantity = (product_id) => {
    try {
      console.log(`Product ID: ${product_id}, Quantity: ${quantity}`);

      dispatch(increaseQuantityOnCart({
        product_id,
        quantity: 1
      }));
      dispatch(resetCartItemStatus());

      console.log('Current Quantity: ', quantity);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDecreaseQuantity = (product_id) => {
    try {
      console.log(`Product ID: ${product_id}, Quantity: ${quantity}`);

      dispatch(decreaseQuantityOnCart({
        product_id,
        quantity: 1
      }));

      dispatch(resetCartItemStatus());
      console.log('Current Quantity: ', quantity);
    } catch (error) {
      console.log(error);
    }
  }

  const handleRemoveItemFromCart = (product_id) => {
    try {
      console.log(`Product ID: ${product_id}`);

      dispatch(removeItemFromCart({ product_id }))
      dispatch(resetCartItemStatus());

      console.log('Item removed successfully.')
    } catch (error) {
      console.log(error);
    }
  }

  const disabledDecrease = quantity === 1;

  return (
    <div 
      key={product.product_id}
      className='w-full flex md:gap-3 gap-2 items-start border-b border-gray-200 last:border-0 bg-white rounded-lg shadow-sm p-3'>
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
          <p className='text-gray-600 text-sm font-medium mt-1'>${unitPrice.toFixed(2) || "Unknown"}</p>
          
          <div className='flex gap-x-2 items-center md:mt-2 mt-1.5'>
            <button 
              disabled={disabledDecrease}
              onClick={() => handleDecreaseQuantity(product.product_id)}
              className='w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition shadow-sm cursor-pointer disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:text-gray-400'
              title='Decrease-Quantity'
              >
              <FiMinus size={18}/>
            </button>
            <span className='w-6 text-center font-semibold text-gray-700'>{quantity}</span>
            <button 
              onClick={() => handleIncreaseQuantity(product.product_id)}
              className='w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition shadow-sm cursor-pointer'
              title='Increase-Quantity'
              >
              <FiPlus size={18}/>
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => handleRemoveItemFromCart(product.product_id)}
          className='bg-red-50 p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 transition shadow-sm cursor-pointer'
          title='Remove-Item'
          >
          <FaRegTrashCan size={18}/>
        </button>
      </div>
    </div>
  )
}

export default CartItemCard