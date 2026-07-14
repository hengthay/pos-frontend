import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  fetchSaleById,
  selectSaleDetailData,
  updateSaleDetail,
} from "../../feature/sales/saleSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiSave } from "react-icons/fi";

const SaleDetailUpdate = () => {
  const [form, setForm] = useState({
    invoice_no: "",
    customer_id: "",
    sale_date: "",
  });

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);
  const saleDetail = useSelector(selectSaleDetailData);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (id) dispatch(fetchSaleById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!saleDetail) return;
    setForm({
      invoice_no: saleDetail?.invoice_no ?? "",
      customer_id: saleDetail?.customer_id ?? "",
      sale_date: saleDetail?.sale_date
        ? saleDetail.sale_date.split(" ")[0]
        : "",
    });
  }, [saleDetail]);

  // Block editing once payment is finalized — mirrors the backend guard
  const isLocked =
    saleDetail?.payment_status === "paid" ||
    saleDetail?.payment_status === "refunded";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsError("");
      setLoading(true);

      if (!form.sale_date) {
        setIsError("Sale Date is required!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("customer_id", form.customer_id);
      formData.append("sale_date", form.sale_date);

      await dispatch(updateSaleDetail({ id, formData })).unwrap();

      Swal.fire({
        title: "Update",
        text: "Sale details updated successfully!",
        icon: "success",
        timer: 1500,
      });
      setTimeout(() => navigate("/sales"), 1500);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: error?.message ?? "Update failed!",
        icon: "error",
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow rounded-lg border border-gray-200">
      <div className="flex md:items-center items-start justify-between">
        <div>
          <h2 className="md:text-3xl sm:text-2xl text-xl font-medium text-gray-900">
            Update Sale Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Customer and sale date only — payment is managed separately.
          </p>
        </div>
        <Link
          to="/sales"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back
        </Link>
      </div>

      {isLocked && (
        <p className="text-sm text-amber-600 mt-3">
          This sale is {saleDetail?.payment_status} and can no longer be edited.
        </p>
      )}

      <form onSubmit={handleSubmit} className="w-full p-3 space-y-4 mt-4">
        <div className="space-y-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            Invoice No
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={form.invoice_no}
            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            Customer ID
          </label>
          <input
            type="text"
            name="customer_id"
            value={form.customer_id}
            onChange={handleOnChange}
            disabled={isLocked}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-50"
          />
        </div>

        <div className="space-y-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            Sale Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="sale_date"
            value={form.sale_date}
            onChange={handleOnChange}
            disabled={isLocked}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-50"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/sales"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLocked || loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:bg-gray-200"
          >
            <FiSave /> {loading ? "Updating..." : "Save"}
          </button>
        </div>
      </form>
      {isError && <p className="text-sm text-red-500 mt-2">{isError}</p>}
    </div>
  );
};

export default SaleDetailUpdate;
