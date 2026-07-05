import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchCustomerById, resetCustomerStatus, selectCustomerDetailData, selectCustomerStatusDetail, updateCustomer } from '../../feature/customers/customerSlice';
import LoadingState from '../helper/LoadingState';
import Swal from 'sweetalert2';

const CustomerUpdate = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const customerDetail = useSelector(selectCustomerDetailData);
  const customerStatusDetail = useSelector(selectCustomerStatusDetail);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch customer by id
  useEffect(() => {
    if(id) dispatch(fetchCustomerById(id));
  }, [id, dispatch]);

  // When redux is ready
  useEffect(() => {
    if(!customerDetail) return; 

    setForm({
      name: customerDetail?.name ?? "",
      email: customerDetail?.email ?? "",
      phone: customerDetail?.phone ?? "",
      address: customerDetail?.address ?? ""
    });

  }, [customerDetail]);

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

      if(!form.name) {
        setIsError("Name is required!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      

      await dispatch(updateCustomer({ id, formData })).unwrap();

      // Reset customer status
      dispatch(resetCustomerStatus());

      Swal.fire({
        title: "Updated",
        text: "Your Customer is updated successfully!",
        icon: "success",
        timer: 1500,
      });

      const timeOut = setTimeout(() => {
        navigate("/customers");
      }, 2000);

      setForm({
        name: "",
        email: "",
        phone: "",
        address: ""
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your Customer is update failed!",
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
            Update Customer
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the form to update a customer.
          </p>
        </div>

        <Link
          to="/customer"
          className="inline-flex items-center md:gap-2 gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft />
          Back
        </Link>
      </div>
      <div className='w-full md:my-6 my-4'>
        {
          customerStatusDetail === "loading" && (
            <LoadingState />
          )
        }
        {
          customerStatusDetail === "succeeded" && (
            <form 
              onSubmit={handleSubmit}
              className="w-full p-3 space-y-6"
              encType="multipart/form-data"
              >
              <div className="grid grid-cols-12 items-center justify-center gap-6 mx-auto">
                <div className="md:col-span-6 col-span-12 flex flex-col item-start justify-start space-y-4">
                  <div className="space-y-1 flex flex-col">
                    <label id="name" className="text-sm font-medium text-gray-700">
                      Customer Name <span className='text-base text-red-500'>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleOnChange}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <label id="brand" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleOnChange}
                      placeholder="e.g. johndoe@gmail.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
                <div className="md:col-span-6 col-span-12 flex flex-col item-start justify-start space-y-4">
                  <div className="space-y-1 flex flex-col">
                    <label id="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleOnChange}
                      placeholder="e.g. (+855) 10200200"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <label id="address" className="text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleOnChange}
                      placeholder="e.g. Phnom Penh, Cambodia"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Link
                  to="/customers"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
                >
                  <FiSave />
                  {loading ? "Updating..." : "Save"}
                </button>
              </div>
            </form>
          )
        }
        {isError && <p className="text-base text-red-500">{isError}</p>}
      </div>
    </div>
  )
}

export default CustomerUpdate