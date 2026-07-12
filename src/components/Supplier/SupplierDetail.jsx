import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchSupplierById,
  selectSupplierDetailData,
  selectSupplierStatusDetail,
} from "../../feature/suppliers/supplierSlice";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import LoadingState from "../helper/LoadingState";

const SupplierDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const supplier = useSelector(selectSupplierDetailData);
  const status = useSelector(selectSupplierStatusDetail);

  useEffect(() => {
    if (id) dispatch(fetchSupplierById(id));
  }, [id, dispatch]);

  if (status === "loading" || !supplier) {
    return (
      <div className="w-full md:my-4 my-2 md:p-4 p-2">
        <LoadingState />
      </div>
    );
  }

  const DetailItem = ({ label, value }) => (
    <div className="border-b border-gray-100 pb-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-base font-medium text-gray-800">
        {value || "-"}
      </p>
    </div>
  );

  return (
    <div className="w-full md:p-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to="/suppliers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black text-sm"
          >
            <FiArrowLeft />
            Back
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mt-3">
            Supplier Detail
          </h1>

          <p className="text-gray-500 mt-1">
            View supplier information.
          </p>
        </div>

        <Link
          to={`/suppliers/${supplier.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 transition"
        >
          <FiEdit />
          Edit
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">
            {supplier.supplier_name}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Supplier Information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 p-6">

          <DetailItem
            label="Supplier Name"
            value={supplier.supplier_name}
          />

          <DetailItem
            label="Contact Name"
            value={supplier.contact_name}
          />

          <DetailItem
            label="Email"
            value={supplier.email}
          />

          <DetailItem
            label="Phone Number"
            value={supplier.phone}
          />

          <DetailItem
            label="Address"
            value={supplier.address}
          />

          <DetailItem
            label="Supplier ID"
            value={`#${supplier.id}`}
          />

          <DetailItem
            label="Created At"
            value={new Date(supplier.created_at).toLocaleString()}
          />

          <DetailItem
            label="Last Updated"
            value={new Date(supplier.updated_at).toLocaleString()}
          />

        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;