import { CiEdit, CiTrash } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { deleteProduct } from '../../feature/products/productSlice';
import { GrView } from 'react-icons/gr';

const ProductCard = ({ product }) => {

  const dispatch = useDispatch();
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // ❌ user canceled
    try {
      await dispatch(deleteProduct(id)).unwrap();

      await Swal.fire({
        title: "Deleted",
        text: "Product has been deleted successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: "Your product could not be deleted.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <tr 
      key={product?.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          {
            product?.image_url ? (
              <img
                src={`${import.meta.env.VITE_BASE_URL}/storage/${product?.image_url}`}
                alt={product?.product_name}
                className="w-14 h-14 rounded-lg object-cover border border-gray-300 shadow-sm"
              />
            ) : (
              <p className='text-[11px] md:w-14 w-18 h-14 rounded-lg object-cover border border-gray-300 flex justify-center items-center shadow-sm'>No Image</p>
            )
          }

          <div>
            <h3 className="font-semibold text-gray-800">
              {product?.product_name}
            </h3>
            <p className="text-sm text-gray-500">
              {product?.description}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-700 font-medium text-sm">
        {product?.product_code}
      </td>
      <td className="px-6 py-4">
        <p className="max-w-20 rounded-full text-center bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {product?.category?.category_name}
        </p>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-800">
        ${product?.selling_price}
      </td>
      <td className="px-6 py-4">
        <p
          className={`max-w-30 text-center rounded-full px-3 py-1 text-xs text-wrap font-semibold ${
            product.stock_quantity === 0 ? "bg-red-100 text-red-700" :
            product.stock_quantity <= 5
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {product.stock_quantity === 0 ? "Out Of Stock" : product.stock_quantity <= 5
            ? `Low Stock (${product.stock_quantity})`
            : `High Stock (${product.stock_quantity})`}
        </p>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/products/${product?.id}/edit`}
            title="Edit Product"
            className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
          >
            <CiEdit size={15} />
          </Link>

          <Link
            to={`/products/${product?.id}/view`}
            title="View Product"
            className="p-2 rounded-lg border border-blue-200 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
          >
            <GrView size={15} />
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(product?.id)}
            title="Delete Product"
            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <CiTrash size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ProductCard