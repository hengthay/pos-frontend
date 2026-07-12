import formatDate from '../helper/formatDate'
import { Link, useNavigate } from 'react-router-dom'
import { CiEdit, CiTrash } from 'react-icons/ci'
import { GrView } from 'react-icons/gr'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { deletePurchase, resetPurchaseStatus } from '../../feature/purchases/purchaseSlice'
import { resetProductStatus } from '../../feature/products/productSlice'
import { resetSupplierStatus } from '../../feature/suppliers/supplierSlice'

const PurchaseCard = ({ purchase }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This purchase will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(deletePurchase(id)).unwrap();

      dispatch(resetPurchaseStatus());
      dispatch(resetProductStatus());
      dispatch(resetSupplierStatus());
      
      await Swal.fire({
        title: "Deleted",
        text: "Purchase has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const timeoutId = setTimeout(() => {
        navigate('/purchases');
      }, 1500);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Your purchase could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <tr 
      key={purchase.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="px-6 py-4 text-gray-700 font-medium text-sm">
        {purchase.invoice_no}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4 font-semibold text-gray-800">
          {formatDate(purchase.purchase_date)}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-medium text-gray-800">
          {purchase?.supplier?.supplier_name}
        </span>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-800">
        ${purchase.total_amount}
      </td>
      <td className="px-6 py-4">
        <p className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize
        ${
          purchase?.status === "received"
            ? "bg-green-100 text-green-700"
            : purchase?.status === "pending"
            ? "bg-red-100 text-red-700"
            : purchase?.status === "cancelled"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}>
          {purchase?.status}
        </p>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-800">
        {purchase?.created_by?.name}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {
            purchase?.status !== "received" && (
              <Link
                to={`/purchases/${purchase.id}/edit`}
                title="Edit purchase"
                className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
              >
                <CiEdit size={15} />
              </Link>
            )
          }
          
          <Link
            to={`/purchases/${purchase.id}/view`}
            title="View purchase"
            className="p-2 rounded-lg border border-blue-200 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
          >
            <GrView size={15} />
          </Link>
          {
            purchase?.status !== "received" && (
              <button
                onClick={() => handleDelete(purchase.id)}
                type="button"
                title="Delete purchase"
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

export default PurchaseCard