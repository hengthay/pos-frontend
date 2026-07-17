import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaIdCard
} from 'react-icons/fa'
import { IoArrowBack } from 'react-icons/io5'
import {
  selectCustomerDetailData,
  selectCustomerStatusDetail,
  fetchCustomerById
} from '../../feature/customers/customerSlice'
import LoadingState from '../helper/LoadingState'

const InfoCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
    <div className="flex items-start gap-3">
      <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-semibold text-gray-900 wrap-break-word">{value || 'N/A'}</p>
      </div>
    </div>
  </div>
)

const CustomerDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const customerDetail = useSelector(selectCustomerDetailData)
  const customerStatusDetail = useSelector(selectCustomerStatusDetail)

  useEffect(() => {
    if (id) dispatch(fetchCustomerById(id))
  }, [id, dispatch])

  if (customerStatusDetail === 'loading') {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingState />
      </div>
    )
  }

  if (customerStatusDetail === 'failed' || !customerDetail) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Customer not found.
        </div>
      </div>
    )
  }

  const isDeleted = !!customerDetail.deleted_at

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white/90 backdrop-blur shadow-sm p-5 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <FaUser className="text-2xl text-blue-600" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${isDeleted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {isDeleted ? 'Deleted' : 'Active'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    Customer ID #{customerDetail.id}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {customerDetail.name}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Customer profile and contact information
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <IoArrowBack />
                Back
              </button>

              <Link
                to="/customers"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition"
              >
                View All
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-3xl border border-gray-200 bg-white shadow-sm p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                <FaIdCard className="text-indigo-600 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Profile Summary</h2>
                <p className="text-sm text-gray-500">Quick customer overview</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-blue-500 p-5 text-white shadow-lg">
                <p className="text-blue-100 text-xs uppercase tracking-wider">Name</p>
                <p className="mt-1 text-2xl font-bold wrap-break-words">{customerDetail.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Created</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {customerDetail.created_at ? new Date(customerDetail.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Updated</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {customerDetail.updated_at ? new Date(customerDetail.updated_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">Address</p>
                <p className="mt-1 text-sm font-semibold text-gray-900 wrap-break-words">
                  {customerDetail.address || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-5 lg:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FaEnvelope className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Contact Details</h2>
                  <p className="text-sm text-gray-500">Ways to reach the customer</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <InfoCard icon={<FaEnvelope />} label="Email" value={customerDetail.email} />
                <InfoCard icon={<FaPhone />} label="Phone" value={customerDetail.phone} />
                <InfoCard icon={<FaMapMarkerAlt />} label="Address" value={customerDetail.address} />
                <InfoCard icon={<FaRegCalendarAlt />} label="Joined" value={customerDetail.created_at ? new Date(customerDetail.created_at).toLocaleString() : 'N/A'} />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-5 lg:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Account Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard icon={<FaUser />} label="Customer Name" value={customerDetail.name} />
                <InfoCard icon={<FaEnvelope />} label="Email Address" value={customerDetail.email} />
                <InfoCard icon={<FaPhone />} label="Phone Number" value={customerDetail.phone} />
                <InfoCard icon={<FaMapMarkerAlt />} label="Address" value={customerDetail.address} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail