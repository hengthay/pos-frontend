import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { fetchPaymentById, resetPaymentStatus, selectPaymentDetailData, selectPaymentStatusDetail, updatePayment } from '../../feature/payments/paymentSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const PaymentUpdate = () => {

  const [form, setForm] = useState({
    sale_id: null,
    payment_method: "",
    amount: "",
    paid_at: ""
  });

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);

  const paymentDetail = useSelector(selectPaymentDetailData);
  const paymentStatus = useSelector(selectPaymentStatusDetail);

  // Fetch customer by id
  useEffect(() => {
    if(id) dispatch(fetchPaymentById(id));
  }, [id, dispatch]);

  // When redux is ready
  useEffect(() => {
    if(!paymentDetail) return; 

    setForm({
      sale_id: Number(paymentDetail?.sale_id) ?? null,
      payment_method: paymentDetail?.payment_method ?? "",
      amount: paymentDetail?.amount ?? "",
      paid_at: paymentDetail?.paid_at ?? ""
    });

  }, [paymentDetail]);

  const total = Number(paymentDetail?.sale?.total ?? 0);
  const paidSoFar = Number(paymentDetail?.sale?.paid_amount ?? 0);
  const remaining = (total - paidSoFar).toFixed(2);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if(!form.payment_method) return setIsError("Payment Method is missing!");
      if(!form.amount) return setIsError("Amount is missing!");
      if(!form.paid_at) return setIsError("Paid Date is missing!");

      const formData = new FormData();
      formData.append("amount", form.amount);
      formData.append("payment_method", form.payment_method);
      formData.append("paid_at", form.paid_at);

      await dispatch(updatePayment({ id, formData })).unwrap();

      // Reset status
      dispatch(resetPaymentStatus());

      Swal.fire({
        title: "Updated",
        text: "Your Payment is updated successfully!",
        icon: "success",
        timer: 1500,
      });

      const timeOut = setTimeout(() => {
        navigate("/payments");
      }, 2000);

      setForm({
        sale_id: null,
        payment_method: "",
        amount: "",
        paid_at: ""
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your Payment is updated failed!",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow drop-shadow-white rounded-lg border border-gray-200'>
      <div className="flex md:items-center items-start justify-between">
        <div>
          <h2 className="md:text-3xl font-medium sm:text-2xl text-xl text-gray-900 text-wrap">
            Update Payment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the form to update a payment.
          </p>
        </div>

        <Link
          to="/payments"
          className="inline-flex items-center md:gap-2 gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft />
          Back
        </Link>
      </div>

      <div className='w-full md:my-6 my-4'>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-12 justify-center w-full gap-6 mx-auto">
            <div className="md:col-span-6 col-span-12 space-y-4">
              <div className="space-y-2 flex flex-col">
                <label htmlFor='sale_id' className="text-sm font-medium text-gray-700">
                  Sale ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale_id"
                  type="text"
                  name="sale_id"
                  value={form.sale_id}
                  onChange={handleOnChange}
                  readOnly
                  placeholder="e.g. Electric Bill"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200 bg-gray-100 opacity-80"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <label htmlFor='amount' className="text-sm font-medium text-gray-700">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  id="amount"
                  type="text"
                  name="amount"
                  value={form.amount}
                  onChange={handleOnChange}
                  required
                  placeholder="e.g. 100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Remaining Balance
                </label>
                <input
                  type="text"
                  readOnly
                  value={remaining}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="md:col-span-6 col-span-12 space-y-4">
              <div className="space-y-2 flex flex-col">
                <label htmlFor='paid_at' className="text-sm font-medium text-gray-700">
                  Paid Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="paid_at"
                  type="date"
                  name="paid_at"
                  value={form.paid_at}
                  onChange={handleOnChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <label htmlFor='payment_method' className="text-sm font-medium text-gray-700">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleOnChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="" defaultChecked disabled>Select a method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="qr">QR Code</option>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/payments"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </Link>

            <button
              disabled={loading}
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer disabled:bg-gray-200"
            >
              <FiSave />
              {loading ? "Updating..." : "Save"}
            </button>
          </div>
          {isError && <p className="text-base text-red-500">{isError}</p>}
        </form>
      </div>
    </div>
  )
}

export default PaymentUpdate