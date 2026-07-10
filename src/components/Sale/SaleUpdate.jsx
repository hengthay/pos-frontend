import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  fetchSaleById,
  selectSaleDetailData,
  updateSale,
} from "../../feature/sales/saleSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiSave } from "react-icons/fi";

const SaleUpdate = () => {
  const [form, setForm] = useState({
    invoice_no: "",
    installment_amount: "", // blank — this is a NEW payment, not the existing paid_amount
    payment_method: "",
    sale_date: "",
  });

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);
  const saleDetail = useSelector(selectSaleDetailData);

  const total = Number(saleDetail?.total ?? 0);
  const paidSoFar = Number(saleDetail?.paid_amount ?? 0);
  const remaining = (total - paidSoFar).toFixed(2);
  const isFinalized =
    saleDetail?.payment_status === "paid" ||
    saleDetail?.payment_status === "refunded";

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
      installment_amount: "", // always start blank, regardless of saleDetail
      payment_method: "",
      sale_date: saleDetail?.sale_date
        ? saleDetail.sale_date.split(" ")[0]
        : "",
    });
  }, [saleDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsError("");
      const amount = Number(form.installment_amount);

      if (!amount || amount <= 0) {
        setIsError("Enter a payment amount greater than zero.");
        return;
      }
      if (!form.payment_method) {
        setIsError("Select a payment method.");
        return;
      }
      if (amount > Number(remaining)) {
        setIsError(`Amount exceeds remaining balance (${remaining}).`);
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("paid_amount", amount); // wire field name expected by backend
      formData.append("payment_method", form.payment_method);

      await dispatch(updateSale({ id, formData })).unwrap();

      Swal.fire({
        title: "Update",
        text: "Payment recorded successfully!",
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
    <div className="w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow drop-shadow-white rounded-lg border border-gray-200">
      <div className="flex md:items-center items-start justify-between">
        <div>
          <h2 className="md:text-3xl font-medium sm:text-2xl text-xl text-gray-900 text-wrap">
            Record Payment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Invoice {form.invoice_no}
          </p>
        </div>
        <Link
          to="/sales"
          className="inline-flex items-center md:gap-2 gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back
        </Link>
      </div>

      {isFinalized && (
        <p className="text-sm text-amber-600 mt-3">
          This sale is already {saleDetail?.payment_status} — no further payment
          can be recorded.
        </p>
      )}

      <div className="w-full md:my-6 my-4">
        <form
          onSubmit={handleSubmit}
          className="w-full p-3 space-y-6"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-12 items-start justify-center gap-6 mx-auto">
            <div className="md:col-span-6 col-span-12 flex flex-col item-start justify-start space-y-4">
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
                  Paid So Far
                </label>
                <input
                  type="text"
                  readOnly
                  value={paidSoFar.toFixed(2)}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Remaining Balance
                </label>
                <input
                  type="text"
                  readOnly
                  value={remaining}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Payment Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  name="installment_amount"
                  value={form.installment_amount}
                  onChange={handleOnChange}
                  disabled={isFinalized}
                  placeholder={`Up to ${remaining}`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="md:col-span-6 col-span-12 flex flex-col item-start justify-start space-y-4">
              <div className="space-y-1 flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Sale Date
                </label>
                <input
                  type="text"
                  readOnly
                  value={form.sale_date}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleOnChange}
                  disabled={isFinalized}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-50"
                >
                  <option value="" disabled>
                    Select Method
                  </option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="qr">QR</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/sales"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isFinalized || loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              <FiSave /> {loading ? "Recording..." : "Record Payment"}
            </button>
          </div>
        </form>
        {isError && <p className="text-base text-red-500 mt-2">{isError}</p>}
      </div>
    </div>
  );
};

export default SaleUpdate;
