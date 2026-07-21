import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import ReportFilter from "../components/helper/ReportFilter";
import { GiProfit, GiExpense } from "react-icons/gi";
import { FcSalesPerformance } from "react-icons/fc";
import { AiOutlineStock } from "react-icons/ai";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenseReport,
  fetchProfitLossReport,
  fetchPurchasesReport,
  fetchSalesReport,
  selectExpensesReports,
  selectProfitLossReports,
  selectPurchasesReports,
  selectReportError,
  selectReportStatus,
  selectSalesReports,
} from "../feature/reports/reportSlice";
import ErrorMessage from "../components/helper/ErrorMessage";
import LoadingState from "../components/helper/LoadingState";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Helper function to format currency consistently
const formatCurrency = (val) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val || 0);
};

const Report = () => {
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
  });

  const dispatch = useDispatch();
  const salesReport = useSelector(selectSalesReports);
  const purchasesReport = useSelector(selectPurchasesReports);
  const expenseReport = useSelector(selectExpensesReports);
  const profitLossReport = useSelector(selectProfitLossReports);
  const reportStatus = useSelector(selectReportStatus);
  const reportError = useSelector(selectReportError);

  useEffect(() => {
    dispatch(fetchSalesReport(filters));
    dispatch(fetchPurchasesReport(filters));
    dispatch(fetchExpenseReport(filters));
    dispatch(fetchProfitLossReport(filters));
  }, [dispatch, filters]);

  const isLoading = reportStatus === "loading";

  const trackingPerformance = useMemo(() => {
    return {
      totalSales: {
        totalItems: salesReport?.items?.length || 0,
        totalCount: salesReport?.count || 0,
        totalAmount: Number(salesReport?.total || 0),
        totalAverage: Number(salesReport?.average || 0),
      },
      totalPurchases: {
        totalItems: purchasesReport?.items?.length || 0,
        totalCount: purchasesReport?.count || 0,
        totalAmount: Number(purchasesReport?.total || 0),
        totalAverage: Number(purchasesReport?.average || 0),
      },
      totalExpenses: {
        totalItems: expenseReport?.items?.length || 0,
        totalCount: expenseReport?.count || 0,
        totalAmount: Number(expenseReport?.total || 0),
        totalAverage: Number(expenseReport?.average || 0),
      },
      totalProfit: {
        totalSales: Number(profitLossReport?.total_sale || 0),
        totalPurchases: Number(profitLossReport?.total_purchase || 0),
        totalExpenses: Number(profitLossReport?.total_expense || 0),
        profitLoss: Number(profitLossReport?.profit_loss || 0),
      },
    };
  }, [salesReport, purchasesReport, expenseReport, profitLossReport]);

  const lineData = useMemo(
    () => ({
      labels: salesReport?.items?.map((item) => item.sale_date?.slice(0, 10)) || [],
      datasets: [
        {
          label: "Sales",
          data: salesReport?.items?.map((item) => Number(item.total || 0)) || [],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#10B981",
        },
      ],
    }),
    [salesReport]
  );

  const barData = useMemo(
    () => ({
      labels: ["Sales", "Purchases", "Expenses", "Profit/Loss"],
      datasets: [
        {
          label: "Amount ($)",
          data: [
            trackingPerformance.totalSales.totalAmount,
            trackingPerformance.totalPurchases.totalAmount,
            trackingPerformance.totalExpenses.totalAmount,
            trackingPerformance.totalProfit.profitLoss,
          ],
          backgroundColor: ["#10B981", "#3B82F6", "#EF4444", "#8B5CF6"],
          borderRadius: 6,
        },
      ],
    }),
    [trackingPerformance]
  );

  const doughnutData = useMemo(
    () => ({
      labels: ["Profit", "Costs"],
      datasets: [
        {
          data: [
            Math.max(trackingPerformance.totalProfit.profitLoss, 0),
            trackingPerformance.totalProfit.totalPurchases +
              trackingPerformance.totalProfit.totalExpenses,
          ],
          backgroundColor: ["#8B5CF6", "#F59E0B"],
          borderWidth: 0,
        },
      ],
    }),
    [trackingPerformance]
  );

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Reports & Analytics
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Real-time insights and summary of your business financial activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ReportFilter onFilter={setFilters} />
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 transition-all duration-200 text-white font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow text-sm">
              <IoCloudDownloadOutline size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {reportError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm font-medium">
            {reportError}
          </div>
        )}

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Sales
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    formatCurrency(trackingPerformance.totalSales.totalAmount)
                  )}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <FcSalesPerformance className="text-2xl" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-medium">
              <span>Count: {trackingPerformance.totalSales.totalCount}</span>
              <span>Avg: {formatCurrency(trackingPerformance.totalSales.totalAverage)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Purchases
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    formatCurrency(trackingPerformance.totalPurchases.totalAmount)
                  )}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <AiOutlineStock className="text-2xl" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-medium">
              <span>Count: {trackingPerformance.totalPurchases.totalCount}</span>
              <span>Avg: {formatCurrency(trackingPerformance.totalPurchases.totalAverage)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Expenses
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    formatCurrency(trackingPerformance.totalExpenses.totalAmount)
                  )}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                <GiExpense className="text-2xl" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-medium">
              <span>Count: {trackingPerformance.totalExpenses.totalCount}</span>
              <span>Avg: {formatCurrency(trackingPerformance.totalExpenses.totalAverage)}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Net Profit / Loss
                </p>
                <h3
                  className={`text-2xl font-bold mt-2 ${
                    trackingPerformance.totalProfit.profitLoss >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    formatCurrency(trackingPerformance.totalProfit.profitLoss)
                  )}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <GiProfit className="text-2xl" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Costs: {formatCurrency(trackingPerformance.totalProfit.totalPurchases + trackingPerformance.totalProfit.totalExpenses)}</span>
              <span
                className={`font-medium px-2 py-0.5 rounded-md ${
                  trackingPerformance.totalProfit.profitLoss >= 0
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {trackingPerformance.totalProfit.profitLoss >= 0 ? "Positive" : "Negative"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-800 mb-4">Sales Trend</h2>
            <div className="h-72">
              <Line
                data={lineData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-800 mb-4">Profit vs Costs</h2>
            <div className="h-72 flex items-center justify-center">
              <Doughnut
                data={doughnutData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">Financial Overview</h2>
          <div className="h-72">
            <Bar
              data={barData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 overflow-hidden">
          <h2 className="text-base font-bold text-slate-800 mb-4">Sales Report Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {
                salesReport?.items?.length > 0 && (salesReport?.items || []).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.sale_date?.slice(0, 10)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {item.invoice_no}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          item.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900 whitespace-nowrap">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;