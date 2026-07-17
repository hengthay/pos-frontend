import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { fetchPaymentById, selectPaymentDetailData, selectPaymentStatusDetail } from "../../feature/payments/paymentSlice";
import formatDate from "../helper/formatDate";
import LoadingState from "../helper/LoadingState";
import ErrorMessage from "../helper/ErrorMessage";

const PaymentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const payment = useSelector(selectPaymentDetailData);
  const loading = useSelector(selectPaymentStatusDetail);

  useEffect(() => {
    if (id) dispatch(fetchPaymentById(id));
  }, [dispatch, id]);


  if (loading === "loading") {
    return (
      <div className="flex justify-center py-20">
        <LoadingState />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex justify-center py-20">
        <ErrorMessage message={"Payment not found!"}/>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to={'/payments'}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-3"
          >
            <FiArrowLeft size={18} />
            Back
          </Link>

          <h1 className="text-2xl font-bold text-slate-800">
            Payment Detail
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            View payment information.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Payment Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 p-6">

          <InfoItem
            label="Reference No"
            value={payment.reference_no}
          />

          <InfoItem
            label="Amount"
            value={`$${payment.amount}`}
          />

          <InfoItem
            label="Payment Method"
            value={payment.payment_method.replace("_", " ")}
          />

          <InfoItem
            label="Paid Date"
            value={formatDate(payment.paid_at)}
          />

          <InfoItem
            label="Created At"
            value={formatDate(payment.created_at)}
          />

          <InfoItem
            label="Payment Status"
            value={
              <span
                className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium capitalize
                ${
                  payment.sale?.payment_status === "paid"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : payment.sale?.payment_status === "partial"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {payment.sale?.payment_status}
              </span>
            }
          />

        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Sale Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 p-6">

          <InfoItem
            label="Invoice No"
            value={payment.sale?.invoice_no}
          />

          <InfoItem
            label="Sale Date"
            value={formatDate(payment.sale?.sale_date)}
          />

          <InfoItem
            label="Subtotal"
            value={`$${payment.sale?.subtotal}`}
          />

          <InfoItem
            label="Tax"
            value={`$${payment.sale?.tax}`}
          />

          <InfoItem
            label="Discount"
            value={`$${payment.sale?.discount}`}
          />

          <InfoItem
            label="Total"
            value={`$${payment.sale?.total}`}
          />

          <InfoItem
            label="Paid Amount"
            value={`$${payment.sale?.paid_amount}`}
          />

          <InfoItem
            label="Cashier"
            value={payment.sale?.user?.name || "N/A"}
          />

          <InfoItem
            label="Role"
            value={payment.sale?.user?.role || "N/A"}
          />

          <InfoItem
            label="Customer"
            value={payment.sale?.customer?.name || "Walk-in Customer"}
          />

        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <div className="text-slate-800 font-medium">
        {value || "N/A"}
      </div>
    </div>
  );
};

export default PaymentDetail;
