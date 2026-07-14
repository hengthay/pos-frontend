import React, { useState } from 'react'
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createCategory, resetCategoryStatus } from '../../feature/categories/categorySlice';
import Swal from 'sweetalert2';

const CategoryCreate = () => {

  const [form, setForm] = useState({
    category_name: "",
    description: "",
  })

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);

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

      if(!form.category_name) {
        setIsError("Category name is required!");
        setLoading(false);
        return; 
      }

      const formData = new FormData();
      formData.append("category_name", form.category_name);
      formData.append("description", form.description);

      await dispatch(createCategory(formData)).unwrap();

      dispatch(resetCategoryStatus()); // Reset Status when created success.

      Swal.fire({
        title: "Created",
        text: "Your Category is created successfully!",
        icon: "success",
        timer: 1500,
      });

      const timeOut = setTimeout(() => {
        navigate("/categories");
      }, 2000);

      setForm({
        category_name: "",
        description: ""
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your Category is created failed!",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  console.log(form);

  return (
    <div className='w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow drop-shadow-white rounded-lg border border-gray-200'>
      <div className="flex md:items-center items-start justify-between">
        <div>
          <h2 className="md:text-3xl font-medium sm:text-2xl text-xl text-gray-900 text-wrap">
            Add New Category
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the form to create a new category.
          </p>
        </div>

        <Link
          to="/categories"
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
          <div className="grid grid-cols-12 w-full justify-center gap-6 mx-auto">
            <div className="md:col-span-6 col-span-12 space-y-4">
              <div className="space-y-2 flex flex-col">
                <label htmlFor="category_name" className="text-sm font-medium text-gray-700">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category_name"
                  value={form.category_name}
                  onChange={handleOnChange}
                  required
                  placeholder="e.g. Angkor Khmer"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="md:col-span-6 col-span-12 space-y-4">
              <div className="space-y-2 flex flex-col">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleOnChange}
                  placeholder="e.g. This is the best angkor in cambodia"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/categories"
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
              {loading ? "Creating..." : "Save"}
            </button>
          </div>
        </form>
        {isError && <p className="text-base text-red-500">{isError}</p>}
      </div>
    </div>
  )
}

export default CategoryCreate