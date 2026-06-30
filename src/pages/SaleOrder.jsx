import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, resetProductStatus, selectProductError, selectProducts, selectProductStatus } from '../feature/products/productSlice';
import { TiShoppingCart } from "react-icons/ti";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiMinus, FiPlus } from "react-icons/fi";
import { CgTrashEmpty } from "react-icons/cg";
import ProductCard from '../components/Product/ProductCard';
import { useOutletContext } from 'react-router-dom';
import ErrorMessage from '../components/helper/ErrorMessage';
import LoadingState from '../components/helper/LoadingState';
import { MdOutlineRemoveShoppingCart, MdOutlineDiscount } from 'react-icons/md';
import SaleCard from '../components/Sale/SaleCard';
import { clearCart, selectCartDiscount, selectCartError, selectCartItems, selectCartStatus, selectCartSubtotal, selectCartTax, selectCartTotal } from '../feature/cartTemp/cartTempSlice';
import CartItemCard from '../components/carts/CartItemCard';
import { createSale } from '../feature/sales/saleSlice';
import Swal from 'sweetalert2';
import ProductForSale from '../components/Product/ProductForSale';

const SaleOrder = () => {

  const dispatch = useDispatch();
  // Get total and subtotal
  const subtotal = useSelector(selectCartSubtotal);
  const total= useSelector(selectCartTotal);
  const discount = useSelector(selectCartDiscount);
  const tax = useSelector(selectCartTax);
  
  const [form, setForm] = useState({
    customer_id: null,
    subtotal: subtotal,
    total: total,
    tax: 0,
    discount: 0,
    paid_amount: 0,
    payment_status: "unpaid",
    sale_date: new Date().toISOString().split('T')[0],
    items: []
  });

  const products = useSelector(selectProducts);
  const productStatus = useSelector(selectProductStatus);
  const productError = useSelector(selectProductError);
  const cartItems = useSelector(selectCartItems);
  const cartStatus = useSelector(selectCartStatus);
  const cartError = useSelector(selectCartError);
  const [selectType, setSelectType] = useState("All");
  const productType = ["All", "New Rice", "Old Rice"];
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { isCartOpen, handleToggleCartOpen } = useOutletContext();

  useEffect(() => {
    try {
      if(productStatus === "idle") dispatch(fetchProducts());
    } catch (error) {
      console.log(error);
    }
  }, [productStatus, dispatch]);

  // Filtered product display
  const filteredProduct = useMemo(() => {
    let lists = Array.isArray(products) ? products : [];

    lists = lists.filter((p) => {
      return selectType === 'All' || p.type === selectType;
    });

    return lists;
  }, [products, selectType]);

  // Date formatter
  const dateFormat = (dateString) => {
    if(!dateString) return;

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const finalDiscount = Number(form.discount / 100 || 0) * subtotal;
  const finalTotal = Math.max(0, Number(subtotal || 0) + Number(tax || 0) - finalDiscount);

 const displayPaidAmount =
  form.payment_status === "paid"
    ? finalTotal
    : form.payment_status === "unpaid"
    ? 0
    : Number(form.paid_amount || 0);
  // Handle on checkout sale
  const handleCheckOut = async () => {
    if(cartItems.length === 0) {
      await Swal.fire({
        title: "Checkout",
        text: "Cart is empty!",
        icon: 'warning',
        timer: 2000
      });
      return;
    }

    try { 
      setIsCheckingOut(true);
      const formData = new FormData();

      if(form.customer_id) {
        formData.append("customer_id", form.customer_id);
      }
      formData.append("subtotal", Number(subtotal));
      formData.append("tax", Number(form.tax));
      formData.append("discount", Number(form.discount));
      formData.append("total", Number(total));
      formData.append("sale_date", new Date().toISOString().split("T")[0]);
      formData.append("payment_status", form.payment_status);
      formData.append("paid_amount",
        form.payment_status === "paid"
          ? finalTotal
          : form.payment_status === "unpaid"
          ? 0
          : Number(form.paid_amount || 0)
      );
      

      if(cartItems.length > 0) {
        cartItems.map((item, index) => {
          formData.append(`items[${index}][product_id]`, item.product_id);
          formData.append(`items[${index}][quantity]`, item.quantity);
          formData.append(`items[${index}][unit_price]`, item.unit_price);
        })
      }

      await dispatch(createSale({ formData })).unwrap();

      console.log('FormData - ', formData);
      dispatch(resetProductStatus());

      await Swal.fire({
        title: "CheckOut",
        text: "Item checkout successfully.",
        icon: 'success',
        timer: 2000
      })

      // Clear cart
      dispatch(clearCart());
      
      // Reset form
      setForm({
        customer_id: null,
        subtotal: 0,
        total: 0,
        tax: 0,
        discount: 0,
        paid_amount: 0,
        payment_status: "unpaid",
        sale_date: new Date().toISOString().split("T")[0],
        items: []
      });
    } catch (error) {
      await Swal.fire({
        title: "CheckOut",
        text: "Item failed to checkout.",
        icon: 'error',
        timer: 2000
      })
      console.log(error);
    } finally {
      setIsCheckingOut(false);
    }
  }

  console.log('FormData - ', form);
  return (
    <div className='w-full'>
      <div className='w-full relative flex md:flex-row flex-col items-start md:gap-6 gap-3 md:p-4 p-2'>
        {/* Center */}
        <div className='w-full flex flex-col md:space-y-3 space-y-2'>
          {/* Category */}
          <div className='w-full flex justify-start items-center md:gap-x-2 gap-x-1.5'>
            {
              productType.map((type, index) => (
                <span 
                  key={`${type}-${index}`}
                  onClick={() => setSelectType(type)}
                  className={`py-1.5 px-3 hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer font-medium ${
                    selectType === type ? "bg-blue-500/90 text-white rounded-t-md" : "text-black rounded-md"
                  }`}>
                    {type}
                </span>
              ))
            }
          </div>
          <hr className='w-full text-gray-300'/>
          <div className='w-full my-2'>
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-4 gap-2 leading-relaxed md:space-y-0 space-y-6'>
              {
                products?.length > 0 && filteredProduct.length > 0 && (
                  filteredProduct.map((product) => (
                    <ProductForSale key={product.id} product={product}/>
                  ))
                )
              }
            </div>
            {
              productStatus === 'loading' && (
                <LoadingState />
              )
            }
            {
              productStatus === 'failed' && (
                <ErrorMessage message={"Failed to get products!"}/>
              )
            }
          </div>
        </div>
        
        {/* Cart - Desktop */}
        <div className='md:w-120 w-full md:flex hidden flex-col shadow-lg h-screen bg-white md:my-0 my-6 border border-gray-300'>
          <div className='flex justify-between items-center border-b border-gray-200 md:p-4 p-3 bg-white'>
            <div className='flex md:gap-x-2 gap-x-1.5 items-center'>
              <TiShoppingCart size={24}/>
              <h4 className='md:text-xl text-lg font-semibold text-gray-800'>Current Cart</h4>
            </div>
            <p className='md:px-4 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold'>
              {cartItems.length} Items
            </p>
          </div>

          <div className='w-full md:flex hidden flex-col flex-1 md:gap-4 gap-3 overflow-y-auto bg-gray-50 md:p-3 p-2'>
            {
              cartStatus === 'loading' && (
                <LoadingState />
              )
            }
            {
              cartItems.length > 0 ? (
                cartItems.map((product) => (
                  <CartItemCard product={product} key={product.product_id}/>
                ))
              ) : (
                <div className='w-full h-full flex flex-col justify-center items-center text-gray-400 gap-2'>
                  <MdOutlineRemoveShoppingCart size={50} className='text-gray-300'/>
                  <p className='font-medium'>Cart is currently empty</p>
                </div>
              )
            }
          </div>

          <div className='w-full flex flex-col justify-end overflow-hidden border-t border-gray-200 md:p-5 p-4 bg-white shadow-sm md:space-y-1.5 space-y-1'>
            <div className='flex justify-between items-center mb-2 text-base'>
              <span className='text-gray-500 font-semibold'>Sub Total:</span>
              <span className='text-gray-500'>${subtotal.toFixed(2) || 0}</span>
            </div>
            <div className='flex justify-between items-center mb-2 text-base'>
              <span className='text-gray-500 font-semibold'>Tax:</span>
              <span className='text-gray-500'>%{tax.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center text-base'>
              <span className='text-gray-500 font-semibold'>Discount:</span>
              <span className='text-gray-500'>%{Number(form.discount || 0).toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center text-lg'>
              <span className='text-gray-600 font-semibold'>Total Amount:</span>
              <span className='text-lg font-bold text-blue-600'>${finalTotal.toFixed(2)}</span>
            </div>
            <hr className='my-2 text-gray-300'/>
            <div className='flex justify-between items-center mb-2 text-lg'>
              <span className='text-gray-600 font-semibold'>Paid Amount:</span>
              <span className='text-lg font-bold text-blue-600'>${displayPaidAmount.toFixed(2)}</span>
            </div>
            <div className='flex flex-row items-center gap-x-2'>
              <div className='w-1/2 flex flex-col gap-1'>
                <label className='text-sm font-semibold text-gray-600'>Payment Status</label>
                <select
                  value={form.payment_status}
                  onChange={(e) => {
                    const status = e.target.value;

                    setForm((prev) => ({
                      ...prev,
                      payment_status: status,
                      paid_amount:
                        status === "paid"
                          ? finalTotal
                          : status === "unpaid"
                          ? 0
                          : prev.paid_amount,
                    }));
                  }}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm'
                >
                  <option value='paid'>Paid</option>
                  <option value='partial'>Partial</option>
                  <option value='unpaid'>Unpaid</option>
                </select>
              </div>

              <div className='w-1/2 flex flex-col gap-1'>
                <label className='text-sm font-semibold text-gray-600'>Paid Amount</label>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={
                    form.payment_status === 'paid'
                      ? finalTotal
                      : form.payment_status === 'unpaid'
                      ? 0
                      : form.paid_amount
                  }
                  onChange={(e) =>
                    setForm({ ...form, paid_amount: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100 text-sm'
                  disabled={form.payment_status !== 'partial'}
                  placeholder='Enter paid amount'
                />
              </div>
            </div>
            <div className='flex flex-row items-center gap-x-2'>
              <button 
                onClick={() => dispatch(clearCart())}
                className='w-full flex justify-center items-center gap-1 md:py-2.5 py-1.5 bg-white border border-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-200/80 transition shadow-md cursor-pointer text-sm'>
                <CgTrashEmpty size={20}/>
                Clear
              </button>
              {
                cartItems.length > 0 && (
                  <button 
                    className='w-full flex justify-center items-center gap-1 md:py-2.5 py-1.5 bg-white border border-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-200/80 transition shadow-md cursor-pointer text-sm text-nowrap px-1'>
                    <p className="font-semibold text-gray-600">Discount %:</p>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={form.discount}
                      onChange={(e) =>
                        setForm({ ...form, discount: e.target.value })
                      }
                      className='w-10'
                    />
                  </button>
                )
              }
            </div>
            <button 
              onClick={() => handleCheckOut()}
              className='w-full py-3.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition shadow-md cursor-pointer'>
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
        
        {/* Mobile Cart */}
        {isCartOpen && (
          <>
            <div 
              className="fixed z-40 top-0 left-0 w-full h-full bg-black/20" 
              onClick={handleToggleCartOpen} 
            />
            
            <div 
              className={`fixed z-50 top-0 right-0 h-full w-65 bg-white rounded-lg shadow-2xl 
                transform transition-transform duration-300 ease-in-out
                ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className='w-full flex flex-col h-full'>
                <div className='flex justify-between items-center border-b border-gray-200 md:p-4 p-3 bg-white'>
                  <div className='flex md:gap-x-2 gap-x-1.5 items-center'>
                    <TiShoppingCart size={24}/>
                    <h4 className='md:text-xl text-lg font-semibold text-gray-800'>Current Cart</h4>
                  </div>
                  <p className='md:px-4 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold'>
                    {cartItems.length} Items
                  </p>
                </div>

                <div className='w-full flex flex-col flex-1 md:gap-4 gap-3 overflow-y-auto bg-gray-50 md:p-3 p-2'>
                  {
                    cartStatus === 'loading' && (
                      <LoadingState />
                    )
                  }
                  {
                    cartItems.length > 0 ? (
                      cartItems.map((product) => (
                        <CartItemCard product={product} key={product.product_id}/>
                      ))
                    ) : (
                      <div className='w-full h-full flex flex-col justify-center items-center text-gray-400 gap-2'>
                        <MdOutlineRemoveShoppingCart size={50} className='text-gray-300'/>
                        <p className='font-medium'>Cart is currently empty</p>
                      </div>
                    )
                  }
                </div>

                <div className='w-full flex flex-col justify-end overflow-hidden border-t border-gray-200 md:p-5 p-4 bg-white shadow-sm md:space-y-1.5 space-y-1'>
                  <div className='flex justify-between items-center mb-2 text-base'>
                    <span className='text-gray-500 font-semibold'>Sub Total:</span>
                    <span className='text-gray-500'>${subtotal.toFixed(2) || 0}</span>
                  </div>
                  <div className='flex justify-between items-center mb-2 text-base'>
                    <span className='text-gray-500 font-semibold'>Tax:</span>
                    <span className='text-gray-500'>%{tax.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between items-center text-base'>
                    <span className='text-gray-500 font-semibold'>Discount:</span>
                    <span className='text-gray-500'>%{Number(form.discount || 0).toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between items-center text-lg'>
                    <span className='text-gray-600 font-semibold'>Total Amount:</span>
                    <span className='text-lg font-bold text-blue-600'>${finalTotal.toFixed(2)}</span>
                  </div>
                  <hr className='my-2 text-gray-300'/>
                  <div className='flex justify-between items-center mb-2 text-lg'>
                    <span className='text-gray-600 font-semibold'>Paid Amount:</span>
                    <span className='text-lg font-bold text-blue-600'>${displayPaidAmount.toFixed(2)}</span>
                  </div>
                  <div className='flex flex-row items-center gap-x-2'>
                    <div className='w-1/2 flex flex-col gap-1'>
                      <label className='text-sm font-semibold text-gray-600'>Payment Status</label>
                      <select
                        value={form.payment_status}
                        onChange={(e) => {
                          const status = e.target.value;

                          setForm((prev) => ({
                            ...prev,
                            payment_status: status,
                            paid_amount:
                              status === "paid"
                                ? finalTotal
                                : status === "unpaid"
                                ? 0
                                : prev.paid_amount,
                          }));
                        }}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm'
                      >
                        <option value='paid'>Paid</option>
                        <option value='partial'>Partial</option>
                        <option value='unpaid'>Unpaid</option>
                      </select>
                    </div>

                    <div className='w-1/2 flex flex-col gap-1'>
                      <label className='text-sm font-semibold text-gray-600'>Paid Amount</label>
                      <input
                        type='number'
                        min='0'
                        step='0.01'
                        value={
                          form.payment_status === 'paid'
                            ? finalTotal
                            : form.payment_status === 'unpaid'
                            ? 0
                            : form.paid_amount
                        }
                        onChange={(e) =>
                          setForm({ ...form, paid_amount: e.target.value })
                        }
                        className='w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100 text-sm'
                        disabled={form.payment_status !== 'partial'}
                        placeholder='Enter paid amount'
                      />
                    </div>
                  </div>
                  <div className='flex flex-row items-center gap-x-2'>
                    <button 
                      onClick={() => dispatch(clearCart())}
                      className='w-full flex justify-center items-center gap-1 md:py-2.5 py-1.5 bg-white border border-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-200/80 transition shadow-md cursor-pointer text-sm'>
                      <CgTrashEmpty size={20}/>
                      Clear
                    </button>
                    {
                      cartItems.length > 0 && (
                        <button 
                          className='w-full flex justify-center items-center gap-1 md:py-2.5 py-1.5 bg-white border border-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-200/80 transition shadow-md cursor-pointer text-sm text-nowrap'>
                          <p className="font-semibold text-gray-600">Discount %:</p>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={form.discount}
                            onChange={(e) =>
                              setForm({ ...form, discount: e.target.value })
                            }
                            className='w-10'
                          />
                        </button>
                      )
                    }
                  </div>
                  <button 
                    onClick={() => handleCheckOut()}
                    className='w-full py-3.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition shadow-md cursor-pointer'>
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SaleOrder