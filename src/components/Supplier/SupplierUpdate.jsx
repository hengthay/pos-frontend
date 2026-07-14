import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchSupplierById, resetSupplierStatus, selectSupplierDetailData, selectSupplierStatusDetail, updateSupplier } from '../../feature/suppliers/supplierSlice';
import { useDispatch, useSelector } from 'react-redux';

const SupplierUpdate = () => {

  const [form, setForm] = useState({
    supplier_name: "",
    contact_name: "",
    phone: "",
    address: "",
    email: ""
  });

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const supplierDetail = useSelector(selectSupplierDetailData);
  const supplierStatus = useSelector(selectSupplierStatusDetail);

  console.log(supplierDetail);

  // Fetch supplier by id
  useEffect(() => {
    if(id) dispatch(fetchSupplierById(id));
  }, [id, dispatch]);

  // When redux is ready
  useEffect(() => {
    if(!supplierDetail) return;

    setForm({
      supplier_name: supplierDetail?.supplier_name ?? "",
      contact_name: supplierDetail?.contact_name ?? "",
      phone: supplierDetail?.phone ?? "",
      address: supplierDetail?.address ?? "",
      email: supplierDetail?.email ?? ""
    })
  }, [supplierDetail]);

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

      if(!form.supplier_name) return setIsError("Supplier Name is missing!");

      const formData = new FormData();
      formData.append("supplier_name", form.supplier_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("contact_name", form.contact_name);
      

      await dispatch(updateSupplier({ id, formData })).unwrap();

      // Reset status
      dispatch(resetSupplierStatus());

      Swal.fire({
        title: "Updated",
        text: "Your Supplier is updated successfully!",
        icon: "success",
        timer: 1500,
      });

      const timeOut = setTimeout(() => {
        navigate("/suppliers");
      }, 2000);

      setForm({
        supplier_name: "",
        email: "",
        phone: "",
        address: "",
        contact_name: "",
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your Supplier is updated failed!",
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
            Update Supplier
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the form to update a supplier.
          </p>
        </div>

        <Link
          to="/suppliers"
          className="inline-flex items-center md:gap-2 gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft />
          Back
        </Link>
      </div>
      <div className='w-full md:my-6 my-4'>
        <form 
          onSubmit={handleSubmit}
          className="w-full p-3 space-y-6"
          encType="multipart/form-data"
          >
          <div className="grid grid-cols-12 items-start justify-center gap-6 mx-auto">
            <div className="md:col-span-6 col-span-12 space-y-4">
              <div className="space-y-1 flex flex-col">
                <label htmlFor="supplier_name" className="text-sm font-medium text-gray-700">
                  Supplier Name <span className='text-base text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  id="supplier_name"
                  name="supplier_name"
                  value={form.supplier_name}
                  onChange={handleOnChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
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

              <div className="space-y-1 flex flex-col">
                <label htmlFor="contact_name" className="text-sm font-medium text-gray-700">
                  Contact Name
                </label>
                <input
                  type="contact_name"
                  id="contact_name"
                  name="contact_name"
                  value={form.contact_name}
                  onChange={handleOnChange}
                  placeholder="e.g. johndoe"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>
            <div className="md:col-span-6 col-span-12 space-y-4">
              <div className="space-y-1 flex flex-col">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
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
                <label htmlFor="address" className="text-sm font-medium text-gray-700">
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
              to="/suppliers"
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
        </form>
        {isError && <p className="text-base text-red-500">{isError}</p>}
      </div>
    </div>
  )
}

export default SupplierUpdate