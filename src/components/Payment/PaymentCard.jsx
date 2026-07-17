import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deletePayment, resetPaymentStatus } from "../../feature/payments/paymentSlice";
import { CiEdit, CiTrash } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import formatDate from "../helper/formatDate";

const PaymentCard = ({ payment }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This payment will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(deletePayment(id)).unwrap();

      dispatch(resetPaymentStatus());
      
      await Swal.fire({
        title: "Deleted",
        text: "Payment has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const timeoutId = setTimeout(() => {
        navigate('/payments');
      }, 1500);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Your payment could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <tr 
      key={payment.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="px-6 py-4 text-gray-700 font-medium text-sm">
        {payment.reference_no}
      </td>
      <td className="px-6 py-4">
        <span className="font-mono text-slate-600 text-sm">
          #{payment?.sale_id}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="font-semibold text-emerald-600">
          ${payment.amount}
        </span>
      </td>
      <td className="px-6 py-4">
        <p className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium capitalize
        ${
          payment?.payment_method === "bank_transfer"
            ? "bg-green-100 text-green-700"
            : payment?.payment_method === "qr"
            ? "bg-yellow-100 text-yellow-700"
            : payment?.payment_method === "cash"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}>
          {payment?.payment_method?.replace("_", " ")}
        </p>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">
        {formatDate(payment.paid_at)}
      </td>
      <td className="px-6 py-4">
        <p className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize
        ${
          payment?.sale?.payment_status === "paid"
            ? "border-green-200 bg-green-50 text-green-700"
            : payment?.sale?.payment_status === "unpaid"
            ? "border-red-200 bg-red-50 text-red-700"
            : payment?.sale?.payment_status === "partial"
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-slate-50 text-slate-700"
        }`}>
          {payment?.sale?.payment_status}
        </p>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-800 text-sm">
        {payment?.sale?.user?.name ?? "NA"}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {/* {
            payment?.sale?.payment_status !== "paid" && (
            )
          } */}
          <Link
            to={`/payments/${payment.id}/edit`}
            title="Edit payment"
            className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
          >
            <CiEdit size={15} />
          </Link>
          
          <Link
            to={`/payments/${payment.id}/view`}
            title="View payment"
            className="p-2 rounded-lg border border-blue-200 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
          >
            <GrView size={15} />
          </Link>

          {
            payment?.sale?.payment_status !== "paid" && (
              <button
                onClick={() => handleDelete(payment?.id)}
                type="button"
                title="Delete Payment"
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

export default PaymentCard