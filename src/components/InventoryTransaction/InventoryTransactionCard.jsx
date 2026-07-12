import { GrView } from 'react-icons/gr'
import { Link } from 'react-router-dom'

const InventoryTransactionCard = ({ inventory }) => {
  return (
    <tr 
      key={inventory?.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition">
      <td className="px-6 py-4 text-gray-700 font-medium text-sm">
        {
          inventory?.id
        }
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          {
            inventory?.product?.image_url ? (
              <img
                src={`${import.meta.env.VITE_BASE_URL}/storage/${inventory?.product?.image_url}`}
                alt={inventory?.product?.product_name}
                className="w-14 h-14 rounded-lg object-cover border border-gray-300 shadow-sm"
              />
            ) : (
              <p className='text-[11px] md:w-14 w-18 h-14 rounded-lg object-cover border border-gray-300 flex justify-center items-center shadow-sm'>No Image</p>
            )
          }

          <h3 className="font-semibold text-gray-800">
            {inventory?.product?.product_name}
          </h3>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="max-w-10 rounded-xl text-center bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {inventory?.quantity}
        </p>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-800">
        ${inventory?.product?.cost_price}
      </td>
      <td className="px-6 py-4">
        <p
          className={`max-w-30 text-center rounded-full px-3 py-1 text-xs text-wrap font-semibold ${
            inventory?.product.stock_quantity === 0 ? "bg-red-100 text-red-700" :
            inventory?.product.stock_quantity <= 5
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {inventory?.product.stock_quantity === 0 ? "Out Of Stock" : inventory?.product.stock_quantity <= 5
            ? `Low Stock (${inventory?.product?.stock_quantity})`
            : `High Stock (${inventory?.product?.stock_quantity})`}
        </p>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-800">
        <p className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize
        ${
          inventory?.transaction_type === "purchase"
            ? "bg-green-100 text-green-700"
            : inventory?.transaction_type === "sale"
            ? "bg-red-100 text-red-700"
            : inventory?.transaction_type === "adjustment"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}>
          {inventory?.transaction_type}
        </p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/inventories-transaction/${inventory?.id}/view`}
            title="View Inventory"
            className="p-2 rounded-lg border border-blue-200 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
          >
            <GrView size={15} />
          </Link>
        </div>
      </td>
    </tr>
  )
}

export default InventoryTransactionCard