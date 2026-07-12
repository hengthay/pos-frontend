import { CiEdit, CiTrash } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteSupplier, resetSupplierStatus } from "../../feature/suppliers/supplierSlice";
import { useDispatch } from "react-redux";

const SupplierCard = ({ supplier }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This supplier will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      console.log(id)
      await dispatch(deleteSupplier(id)).unwrap();

      dispatch(resetSupplierStatus());
      
      await Swal.fire({
        title: "Deleted",
        text: "Supplier has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const timeoutId = setTimeout(() => {
        navigate('/suppliers');
      }, 1500);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Your supplier could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <tr
      key={supplier.id}
      className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors duration-200"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="text-sm w-12 h-12 rounded-lg object-cover border border-gray-300 bg-blue-300/50 text-gray-500 font-semibold flex justify-center items-center shadow-sm">
            {supplier?.supplier_name
              ?.split(" ")
              ?.map((name) => name.charAt(0).toUpperCase())
              ?.join("")
              ?.substring(0, 2)}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 text-[15px] hover:text-blue-600 transition-colors cursor-pointer">
              {supplier?.supplier_name || "Unknown"}
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {supplier?.email || "No email"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-gray-700">
          {supplier.contact_name || "N/A"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100/60 tracking-wide">
          {supplier.phone || "No Phone"}
        </span>
      </td>

      <td className="px-6 py-4 max-w-50 truncate">
        <span
          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 max-w-full truncate"
          title={supplier.address}
        >
          {supplier.address || "No Address"}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/suppliers/${supplier.id}/edit`}
            title="Edit Supplier"
            className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
          >
            <CiEdit size={15} />
          </Link>

          <Link
            to={`/suppliers/${supplier.id}/view`}
            title="View Supplier"
            className="p-2 rounded-lg border border-blue-200 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
          >
            <GrView size={15} />
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(supplier?.id)}
            title="Delete Customer"
            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <CiTrash size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SupplierCard;
