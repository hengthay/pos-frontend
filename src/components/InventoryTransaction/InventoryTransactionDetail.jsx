import React, { useEffect } from 'react'
import { FaBoxOpen, FaStickyNote, FaUser, FaRegCalendarAlt, FaBarcode, FaTag } from 'react-icons/fa'
import { HiAdjustmentsHorizontal } from 'react-icons/hi2'
import { IoArrowBack } from 'react-icons/io5'
import { Link, useParams } from 'react-router-dom'
import {
  fetchInventoryById,
  selectInventoryDetailData,
  selectInventoryDetailStatus
} from '../../feature/inventories/inventorySlice'
import { useDispatch, useSelector } from 'react-redux'
import LoadingState from '../helper/LoadingState'

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
  </div>
)

const InventoryTransactionDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const inventory = useSelector(selectInventoryDetailData)
  const status = useSelector(selectInventoryDetailStatus)

  useEffect(() => {
    dispatch(fetchInventoryById(id))
  }, [dispatch, id])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingState />
      </div>
    )
  }

  if (status === "failed" || !inventory) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Inventory transaction not found.
        </div>
      </div>
    )
  }

  const transactionType = inventory?.transaction_type || "unknown"

  const badgeClass =
    transactionType === "purchase"
      ? "bg-green-100 text-green-700 ring-green-200"
      : transactionType === "sale"
      ? "bg-red-100 text-red-700 ring-red-200"
      : "bg-blue-100 text-blue-700 ring-blue-200"

  const imageSrc = inventory?.product?.image_url
    ? `${import.meta.env.VITE_BASE_URL}/storage/${inventory.product.image_url}`
    : "https://via.placeholder.com/400x400?text=No+Image"

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white/90 backdrop-blur border border-gray-200 shadow-sm p-5 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeClass}`}>
                  {transactionType}
                </span>
                <span className="text-sm text-gray-500">Transaction ID #{inventory?.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Inventory Transaction Detail
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Created at {new Date(inventory?.created_at).toLocaleString()}
              </p>
            </div>

            <Link
              to="/inventories-transaction"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-gray-800 transition"
            >
              <IoArrowBack />
              Back
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 rounded-3xl bg-white border border-gray-200 shadow-sm p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaBoxOpen className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Product</h2>
                <p className="text-sm text-gray-500">Product information overview</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <img
                src={imageSrc}
                alt={inventory?.product?.product_name || "Product"}
                className="h-72 w-full object-cover"
              />
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {inventory?.product?.product_name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <FaBarcode className="text-gray-400" />
                  {inventory?.product?.product_code}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Brand</p>
                  <p className="font-semibold text-gray-900">{inventory?.product?.brand || "N/A"}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Stock</p>
                  <p className="font-semibold text-gray-900">{inventory?.product?.stock_quantity ?? 0}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
                <p className="text-xs uppercase tracking-wider text-blue-500 mb-1">Cost Price</p>
                <p className="text-2xl font-bold text-blue-700">
                  ${inventory?.product?.cost_price}
                </p>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-5 lg:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <HiAdjustmentsHorizontal className="text-indigo-600 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Transaction Details</h2>
                  <p className="text-sm text-gray-500">Movement and adjustment information</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Type</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeClass}`}>
                    {transactionType}
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Quantity</p>
                  <p className="text-2xl font-bold text-gray-900">{inventory?.quantity}</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Created Date</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <FaRegCalendarAlt className="text-gray-400" />
                    {new Date(inventory?.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {inventory?.purchase && (
                <div className="mt-5 rounded-2xl border border-green-100 bg-green-50/60 p-4">
                  <h3 className="font-bold text-green-800 mb-4">Purchase Information</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <InfoRow label="Invoice" value={inventory.purchase.invoice_no} />
                    <InfoRow label="Total Amount" value={`$${inventory.purchase.total_amount}`} />
                    <InfoRow label="Status" value={<span className="capitalize">{inventory.purchase.status}</span>} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-5 lg:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-11 w-11 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FaUser className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Created By</h2>
                    <p className="text-sm text-gray-500">User who made the transaction</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <InfoRow label="Name" value={inventory?.created_by?.name || "N/A"} />
                  <InfoRow label="Role" value={inventory?.created_by?.role || "N/A"} />
                  <InfoRow label="Phone" value={inventory?.created_by?.phone || "N/A"} />
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-5 lg:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-11 w-11 rounded-xl bg-orange-100 flex items-center justify-center">
                    <FaStickyNote className="text-orange-600 text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Notes</h2>
                    <p className="text-sm text-gray-500">Additional remarks</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 min-h-32">
                  <p className="text-sm leading-7 text-gray-700">
                    {inventory?.notes || "No notes available."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-blue-400 p-5 text-white shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-blue-100 text-sm">Quick Summary</p>
                  <h3 className="text-xl font-bold">Stock movement overview</h3>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="rounded-2xl bg-white/15 px-4 py-3">
                    <p className="text-blue-100 text-xs uppercase">Quantity</p>
                    <p className="font-bold text-lg">{inventory?.quantity}</p>
                  </div>
                  <div className="rounded-2xl bg-white/15 px-4 py-3">
                    <p className="text-blue-100 text-xs uppercase">Stock</p>
                    <p className="font-bold text-lg">{inventory?.product?.stock_quantity ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryTransactionDetail