import React, { useEffect, useMemo, useState } from 'react'
import { FaBoxOpen, FaExclamationTriangle, FaLayerGroup, FaPlus, FaSearch } from 'react-icons/fa'
import { IoAlertCircleOutline, IoFilter } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchases, selectPurchaseError, selectPurchasesData, selectPurchaseStatus } from '../feature/purchases/purchaseSlice';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { CiEdit, CiTrash } from 'react-icons/ci';
import { GrView } from 'react-icons/gr';
import formatDate from '../components/helper/formatDate';
import LoadingState from '../components/helper/LoadingState';
import ErrorMessage from '../components/helper/ErrorMessage';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import PurchaseCard from '../components/Purchase/PurchaseCard';

const Purchase = () => {

  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const purchases = useSelector(selectPurchasesData);
  const purchaseStatus = useSelector(selectPurchaseStatus);
  const purchaseError = useSelector(selectPurchaseError);

  useEffect(() => {
    if(page) dispatch(fetchPurchases(page));
  }, [page, dispatch]);

  const isLoading = purchaseStatus === "loading";

  const trackingPurchase = useMemo(() => {
    const saleList = Array.isArray(purchases?.purchases?.data) ? purchases?.purchases?.data : [];

    return {
      totalPurchase: purchases?.summary?.totalPurchase,

      totalPending: purchases?.summary?.totalPending,

      totalReceived: purchases?.summary?.totalReceived,

      totalCancelled: purchases?.summary?.totalCancelled,
    };
  }, [purchases]);

  const filteredPurchase = useMemo(() => {
    const s = search.trim().toLowerCase();

    let lists = Array.isArray(purchases?.purchases?.data) ? [...purchases?.purchases?.data] : [];

    if(s) {
      lists = lists.filter((p) => {
        return (p.invoice_no || "").toLowerCase().includes(s) ||
         (p.status || "").toLowerCase().includes(s)
      })
    }

    switch (sort) {
      case "az":
        lists.sort((a, b) =>
          (a.invoice_no || "").localeCompare(b.invoice_no || "")
        );
        break;

      case "za":
        lists.sort((a, b) =>
          (b.invoice_no || "").localeCompare(a.invoice_no || "")
        );
        break;
      default:
        break;
    }

    return lists;
  }, [purchases, search, sort]);

  const handleClearFilter = () => {
    setSearch("");
    setSort("all");
  }

  const purchasesData = purchases?.purchases?.data;
  const purchasePagination = purchases?.purchases;

  return (
    <div className='w-full md:space-y-6 space-y-3'>
      <div className="w-full my-4">
        <div className='flex md:flex-row flex-col flex-1 justify-between md:items-center items-start'>
          <div className="md:space-y-2 space-y-1.5 md:my-2 my-1.5 md:p-2 p-0">
            <h2 className="md:text-4xl font-semibold sm:text-3xl text-2xl">
              Purchase Management
            </h2>
            <p className="md:text-base text-sm text-gray-500">
              Organize and manage your purchases.
            </p>
          </div>
          <Link to="/purchases/create" className='flex items-center md:gap-1.5 gap-1 text-white bg-blue-700 md:py-2.5 md:px-3 p-2 rounded-xl hover:bg-blue-500 transition-all ease-in-out duration-200 font-medium'>
            <FaPlus size={18}/>
            New Purchase
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 gap-3 my-5 md:p-2 p-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className='md:space-y-6 space-y-4'>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total Purchases
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {isLoading ? <span className="animate-pulse">--</span> : trackingPurchase?.totalPurchase}
                </h2>
              </div>

              <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaBoxOpen className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className='md:space-y-6 space-y-4'>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Pending Purchase
                </p>
                <h2 className="text-3xl font-bold text-red-600 mt-2">
                  {isLoading ? <span className="animate-pulse">--</span> : trackingPurchase?.totalPending}
                </h2>
              </div>

              <div className="h-14 w-14 rounded-xl bg-red-100 flex items-center justify-center">
                <IoAlertCircleOutline className="text-2xl text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-yellow-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className='md:space-y-6 space-y-4'>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Receive Purchase
                </p>
                <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                  {isLoading ? <span className="animate-pulse">--</span> : trackingPurchase?.totalReceived}
                </h2>
              </div>

              <div className="h-14 w-14 rounded-xl bg-yellow-100 flex items-center justify-center">
                <FaExclamationTriangle className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className='md:space-y-6 space-y-4'>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Cancel Purchase
                </p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {isLoading ? <span className="animate-pulse">--</span> : trackingPurchase?.totalCancelled}
                </h2>
              </div>

              <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center">
                <FaLayerGroup className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className='md:px-2'>  
          <div className='w-full bg-blue-50 shadow-sm rounded-t-xl md:p-4 p-2 md:my-0 my-2 flex gap-2'>
            <div
              className={`flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 w-100`}
            >
              <FaSearch className="text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Invoice, Payment Status, Customer-name..."
                className="bg-transparent outline-none px-2 py-1.5 text-sm w-full"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className="max-w-25 w-full p-2 rounded-md flex justify-center items-center gap-x-1.5 bg-gray-100 border border-gray-300 hover:bg-gray-300 transition duration-300 cursor-pointer"
              >
                <IoFilter size={13} />
                Filters {showFilter ? <RiArrowDropDownLine /> : <RiArrowDropUpLine />}
              </button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-gray-200 bg-white shadow-lg p-3 z-20">
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setShowFilter(false);
                    }}
                    className="w-full rounded-md border border-gray-300 p-2 outline-none focus-within:ring-1 focus-within:ring-blue-500 md:text-sm text-xs"
                  >
                    <option value="all">All purchases</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className='md:px-2'>
          <div className="w-full overflow-x-auto border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-blue-50/30 border-b border-blue-200">
                <tr className='uppercase'>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Invoice-ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Purchase Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Suppiler
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Purchase By
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseStatus === "loading" && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <div className="flex justify-center items-center">
                        <LoadingState />
                      </div>
                    </td>
                  </tr>
                )}

                {purchaseStatus === "failed" && (
                  <tr>
                    <td colSpan={6}>
                      <ErrorMessage message="Failed to get purchases!" />
                    </td>
                  </tr>
                )}
                {
                  purchasesData?.length > 0 && purchaseStatus === "succeeded" && (
                    filteredPurchase.map((purchase) => (
                      <PurchaseCard key={purchase.id} purchase={purchase}/>
                    ))
                  )
                }
              </tbody>
            </table>
            {
              purchaseStatus === "succeeded" && filteredPurchase.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900">
                    No purchases found!
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Try another keyword or change the filter.
                  </p>

                  <button
                    onClick={() => handleClearFilter()}
                    className="cursor-pointer mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Clear search
                  </button>
                </div>
              )
            }
          </div>
        </div>

        <div className='md:px-2'>
          <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4">
              <p className="text-sm font-medium text-gray-600">
                Showing <span className="font-semibold">{purchasePagination?.from}-{purchasePagination?.to}</span> of{" "}
                <span className="font-semibold">{purchasePagination?.total}</span> purchases
              </p>

              {/* Pagination */}
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                  className="w-11 h-11 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition">
                  <IoIosArrowBack size={18} />
                </button>
                <button className="w-11 h-11 rounded-md border border-gray-300 bg-blue-700 text-white font-semibold shadow">
                  {purchasePagination?.current_page}
                </button>
                <span className="px-2 text-gray-500 font-semibold">...</span>
                <button className="w-11 h-11 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition font-medium">
                  {purchasePagination?.last_page}
                </button>
                <button 
                  disabled={purchasePagination?.current_page === purchasePagination?.last_page}
                  onClick={() => setPage(prev => prev + 1)}
                  className="w-11 h-11 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition">
                  <IoIosArrowForward size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchase