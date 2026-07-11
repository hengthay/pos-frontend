import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import LoadingState from '../helper/LoadingState';
import {
  fetchPurchaseById,
  selectPurchaseDetailData,
  selectPurchaseStatusDetail,
  selectPurchaseError,
} from '../../feature/purchases/purchaseSlice';

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  received: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const formatMoney = (value) => Number(value ?? 0).toFixed(2);

const PurchaseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const purchase = useSelector(selectPurchaseDetailData);
  const status = useSelector(selectPurchaseStatusDetail);
  const error = useSelector(selectPurchaseError);

  useEffect(() => {
    if (id) dispatch(fetchPurchaseById(id));
  }, [id, dispatch]);

  if (status === 'loading') {
    return (
      <div className="w-full md:my-4 my-2 md:p-4 p-2">
        <LoadingState />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow rounded-lg border border-gray-200">
        <p className="text-red-500">{error || 'Unable to load purchase detail.'}</p>
        <Link
          to="/purchases"
          className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back
        </Link>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow rounded-lg border border-gray-200">
        <p className="text-gray-600">No purchase found.</p>
        <Link
          to="/purchases"
          className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back
        </Link>
      </div>
    );
  }

  const badgeStyle = statusStyles[purchase.status] ?? 'bg-gray-100 text-gray-600 border-gray-300';
  const items = purchase.purchase_items || [];

  return (
    <div className="w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow rounded-lg border border-gray-200">
      <div className="flex md:items-center items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="md:text-3xl sm:text-2xl text-xl font-medium text-gray-900">
            {purchase.invoice_no}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Purchase date: {purchase.purchase_date?.split('T')[0] || purchase.purchase_date?.split(' ')[0]}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${badgeStyle}`}>
            {purchase.status}
          </span>
          <Link
            to="/purchases"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft /> Back
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <Link
          to={`/purchases/${purchase.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FiEdit2 /> Edit Purchase
        </Link>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-6">
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Supplier
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="text-gray-900 font-medium">
                {purchase.supplier?.supplier_name || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact</span>
              <span className="text-gray-900 font-medium">
                {purchase.supplier?.contact_name || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span className="text-gray-900 font-medium">
                {purchase.supplier?.phone || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-900 font-medium">
                {purchase.supplier?.email || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Purchase Summary
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-gray-900 font-medium">${formatMoney(purchase.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Items</span>
              <span className="text-gray-900 font-medium">{items.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created By</span>
              <span className="text-gray-900 font-medium">
                {purchase.created_by?.name || purchase.created_by?.username || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created At</span>
              <span className="text-gray-900 font-medium">
                {purchase.created_at ? new Date(purchase.created_at).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
          Items
        </h3>

        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left uppercase">
                <th className="px-4 py-2 font-medium text-gray-600">Product</th>
                <th className="px-4 py-2 font-medium text-gray-600 text-right">Qty</th>
                <th className="px-4 py-2 font-medium text-gray-600 text-right">Cost Price</th>
                <th className="px-4 py-2 font-medium text-gray-600 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => {
                  const lineTotal = Number(item.quantity) * Number(item.cost_price);

                  return (
                    <tr key={item.id || index} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {item.product?.product_name || `Product #${item.product_id}`}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ${formatMoney(item.cost_price)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium">
                        ${formatMoney(lineTotal)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 flex flex-wrap gap-x-6 gap-y-1">
        <span>Created: {purchase.created_at ? new Date(purchase.created_at).toLocaleString() : 'N/A'}</span>
        <span>Last updated: {purchase.updated_at ? new Date(purchase.updated_at).toLocaleString() : 'N/A'}</span>
      </div>
    </div>
  );
};

export default PurchaseDetail;