import { CiEdit, CiTrash } from 'react-icons/ci'
import { FaLayerGroup } from 'react-icons/fa6'
import { MdUpdate } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import formatOnlyDay from "../helper/formatOnlyDay";
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { deleteCategory, resetCategoryStatus } from '../../feature/categories/categorySlice'

const CategoryCard = ({ category }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(deleteCategory(id)).unwrap();

      dispatch(resetCategoryStatus());

      Swal.fire({
        title: "Deleted",
        text: "Category has been deleted successfully!",
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
        text: "Your category could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <div className='w-full space-y-3 md:p-3 p-2 shadow-sm border border-gray-200 rounded-md'>
      <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
        <FaLayerGroup className="text-blue-600 text-xl" />
      </div>
      <div className='space-y-2 leading-relaxed'>
        <h1 className='md:text-xl text-lg font-medium tracking-wide'>{category.category_name ?? "Unknow name"}</h1>
        <p className='md:text-[14.5px] text-sm text-gray-500'>{category.description}</p>
      </div>
      <hr className='w-full text-gray-300'/>
      <p className='flex items-center md:gap-1.5 gap-1 text-gray-500 text-xs'>
        <MdUpdate size={18}/>
        Updated {formatOnlyDay(category.updated_at)} ago
      </p>
      <div className="flex items-center justify-end gap-2 my-2 pt-2">
        <Link
          to={`/categories/${category.id}/edit`}
          title="Edit Category"
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer shadow-sm shadow-gray-300"
        >
          <CiEdit size={18} />
        </Link>
        <button
          onClick={() => handleDelete(category?.id)}
          type="button"
          title="Delete Category"
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shadow-sm shadow-gray-300"
        >
          <CiTrash size={18} />
        </button>
      </div>
    </div>
  )
}

export default CategoryCard