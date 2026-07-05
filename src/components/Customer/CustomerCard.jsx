import React from 'react'
import { CiEdit, CiTrash } from 'react-icons/ci'
import { GrView } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import formatDate from '../helper/formatDate'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import { deleteCustomer } from '../../feature/customers/customerSlice'

const CustomerCard = ({ customer }) => {

  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This customer will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(deleteCustomer(id)).unwrap();

      await Swal.fire({
        title: "Deleted",
        text: "Customer has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Your customer could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <tr 
      key={customer.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <p className='text-sm w-12 h-12 rounded-lg object-cover border border-gray-300 bg-blue-300/50 text-gray-500 font-semibold flex justify-center items-center shadow-sm'>{customer?.name?.split(" ").map((name) => name.charAt(0).toUpperCase()).join("")}</p>

            <div>
            <h3 className="font-semibold text-gray-900">
              {customer.name || "Unknown"}
            </h3>

            <p className="text-sm text-gray-500">
              {customer.email || "No email"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="w-30 rounded-xl text-center bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {customer.phone ?? "Unknow"}
        </p>
      </td>
      
      <td className="px-6 py-4 font-semibold text-gray-800">
      {customer.address ?? "Unknow"}
      </td>

      <td className="px-6 py-4 font-semibold text-gray-800">
      {formatDate(customer.created_at) ?? "Unknow"}
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/customers/${customer.id}/edit`}
            title="Edit Customer"
            className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
          >
            <CiEdit size={15} />
          </Link>

          <Link
            to={`/customers/${customer.id}/view`}
            title="View Customer"
            className="p-2 rounded-lg border border-blue-200 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
          >
            <GrView size={15} />
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(customer.id)}
            title="Delete Customer"
            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <CiTrash size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CustomerCard