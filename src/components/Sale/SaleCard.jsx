import formatDate from '../helper/formatDate'
import { Link, useNavigate } from 'react-router-dom'
import { CiEdit, CiTrash } from 'react-icons/ci'
import { FaCreditCard } from "react-icons/fa6";
import { GrView } from 'react-icons/gr'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { deleteSale, resetSaleStatus } from '../../feature/sales/saleSlice'

const SaleCard = ({ sale }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This sale will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(deleteSale(id)).unwrap();

      dispatch(resetSaleStatus());

      await Swal.fire({
        title: "Deleted",
        text: "Sale has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const timeoutId = setTimeout(() => {
        navigate('/sales');
      }, 1500);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Your sale could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <tr 
      key={sale.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="px-6 py-4 text-gray-700 font-medium text-sm">
        {sale.invoice_no}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4 font-semibold text-gray-800">
          {formatDate(sale.sale_date)}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-medium text-gray-800">
            {sale?.customer?.name ?? "Walk-in Customer"}
        </span>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-800">
        ${sale.total}
      </td>
      <td className="px-6 py-4">
        <p className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize
        ${
          sale?.payment_status === "paid"
            ? "bg-green-100 text-green-700"
            : sale?.payment_status === "unpaid"
            ? "bg-red-100 text-red-700"
            : sale?.payment_status === "partial"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}>
          {sale?.payment_status}
        </p>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-800">
        {sale?.user?.name}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {
            sale?.payment_status !== "paid" && (
              <Link
                to={`/sales/${sale.id}/edit`}
                title="Edit Sale"
                className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
              >
                <CiEdit size={15} />
              </Link>
            )
          }
          
          <Link
            to={`/sales/${sale.id}/view`}
            title="View Sale"
            className="p-2 rounded-lg border border-blue-200 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
          >
            <GrView size={15} />
          </Link>

          <Link
            to={`/sales/${sale.id}/updateDetail`}
            title="Update Sale Detail"
            className="p-2 rounded-lg border border-blue-200 text-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <FaCreditCard size={15} />
          </Link>

          {
            sale?.payment_status !== "paid" && (
              <button
                onClick={() => handleDelete(sale.id)}
                type="button"
                title="Delete Sale"
                className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <CiTrash size={15} />
              </button>
            )
          }
        </div>
      </td>
    </tr>
  )
}

export default SaleCard