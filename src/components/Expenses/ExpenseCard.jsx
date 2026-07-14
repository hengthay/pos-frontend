import Swal from 'sweetalert2';
import { deleteExpense, fetchExpenses, resetExpenseStatus } from '../../feature/expenses/expenseSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GrView } from 'react-icons/gr';
import { CiEdit, CiTrash } from 'react-icons/ci';
import formatDate from '../helper/formatDate';

const ExpenseCard = ({ expense }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This expense will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(deleteExpense(id)).unwrap();

      dispatch(resetExpenseStatus());
      dispatch(fetchExpenses({ page: 1 }));

      await Swal.fire({
        title: "Deleted",
        text: "Expense has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const timeoutId = setTimeout(() => {
        navigate('/expenses');
      }, 1500);

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Your expense could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <tr 
      key={expense.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold shadow-sm">
            {expense?.title?.charAt(0)?.toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {expense?.title || "Unknown"}
            </h3>

            <p className="text-sm text-gray-500 line-clamp-1 mt-1">
              {expense?.description || "No description available"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-medium text-gray-800">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          ${expense?.amount ?? "0"}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-gray-700">
          {formatDate(expense.expense_date)}
        </span>
      </td>
      <td className="px-6 py-4 font-medium">
        <span className='text-sm '>
          {expense?.created_by?.name}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/expenses/${expense.id}/edit`}
            title="Edit Expense"
            className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
          >
            <CiEdit size={15} />
          </Link>
          
          <Link
            to={`/expenses/${expense.id}/view`}
            title="View Expense"
            className="p-2 rounded-lg border border-blue-200 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
          >
            <GrView size={15} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(expense?.id)}
            title="Delete Expense"
            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <CiTrash size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ExpenseCard