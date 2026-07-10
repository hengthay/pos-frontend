import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchSaleById, selectSaleDetailData, selectSalesStatus, selectSaleStatusDetail } from '../../feature/sales/saleSlice';
import { FiArrowLeft, FiEdit2, FiDollarSign } from 'react-icons/fi';
import LoadingState from "../helper/LoadingState";

const statusStyles = {
  paid: "bg-green-50 text-green-700 border-green-200",
  partial: "bg-yellow-50 text-yellow-700 border-yellow-200",
  unpaid: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-gray-100 text-gray-600 border-gray-300",
};

const formatMoney = (value) => Number(value ?? 0).toFixed(2);

const SaleDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const sale = useSelector(selectSaleDetailData);
  const status = useSelector(selectSaleStatusDetail);

  useEffect(() => {
    if (id) dispatch(fetchSaleById(id));
  }, [id, dispatch]);

  if (status === 'loading' || !sale) {
    return (
      <div className="w-full md:my-4 my-2 md:p-4 p-2">
        <LoadingState />
      </div>
    );
  }

  const badgeStyle = statusStyles[sale.payment_status] ?? "bg-gray-100 text-gray-600 border-gray-300";
  const remaining = (Number(sale.total) - Number(sale.paid_amount)).toFixed(2);

  return (
    <div className="w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow rounded-lg border border-gray-200">
      <div className="flex md:items-center items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="md:text-3xl sm:text-2xl text-xl font-medium text-gray-900">
            {sale.invoice_no}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sale date: {sale.sale_date?.split(" ")[0]}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${badgeStyle}`}>
            {sale.payment_status}
          </span>
          <Link
            to="/sales"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft /> Back
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <Link
          to={`/sales/${sale.id}/edit-detail`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FiEdit2 /> Edit Details
        </Link>
        {sale.payment_status !== 'paid' && sale.payment_status !== 'refunded' && (
          <Link
            to={`/sales/${sale.id}/payment`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
          >
            <FiDollarSign /> Record Payment
          </Link>
        )}
      </div>

      {/* Info grid */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-6">
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Customer & Staff
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="text-gray-900 font-medium">
                {sale.customer ? sale.customer.name : "Walk-in / N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Handled by</span>
              <span className="text-gray-900 font-medium">
                {sale.user?.name ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className="text-gray-900 font-medium capitalize">
                {sale.user?.role ?? "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Payment summary */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Payment Summary
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900 font-medium">${formatMoney(sale.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span className="text-gray-900 font-medium">${formatMoney(sale.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-900 font-medium">${formatMoney(sale.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-700 font-semibold">Total</span>
              <span className="text-gray-900 font-semibold">${formatMoney(sale.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Paid</span>
              <span className="text-gray-900 font-medium">${formatMoney(sale.paid_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Remaining</span>
              <span className={`font-medium ${Number(remaining) > 0 ? "text-red-600" : "text-gray-900"}`}>
                ${remaining}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
          Items
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-x-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left uppercase">
                <th className="px-4 py-2 font-medium text-gray-600">Product</th>
                <th className="px-4 py-2 font-medium text-gray-600">Code</th>
                <th className="px-4 py-2 font-medium text-gray-600 text-right">Qty</th>
                <th className="px-4 py-2 font-medium text-gray-600 text-right">Unit Price</th>
                <th className="px-4 py-2 font-medium text-gray-600 text-right">Discount</th>
                <th className="px-4 py-2 font-medium text-gray-600 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.products?.map((product) => {
                const qty = Number(product.pivot.quantity);
                const unitPrice = Number(product.pivot.unit_price);
                const lineTotal = (qty * unitPrice).toFixed(2);

                return (
                  <tr key={product.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-3 flex items-center gap-3">
                      {product.image_url && (
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}/storage/${product.image_url}`}
                          alt={product.product_name}
                          className="w-10 h-10 rounded object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <p className="text-gray-900 font-medium">{product.product_name}</p>
                        <p className="text-gray-500 text-xs">{product.brand}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{product.product_code}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{qty}</td>
                    <td className="px-4 py-3 text-right text-gray-900">${formatMoney(unitPrice)}</td>
                    <td className="px-4 py-3 text-right text-gray-900">${formatMoney(product.pivot.discount)}</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">${lineTotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 flex flex-wrap gap-x-6 gap-y-1">
        <span>Created: {new Date(sale.created_at).toLocaleString()}</span>
        <span>Last updated: {new Date(sale.updated_at).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default SaleDetail;