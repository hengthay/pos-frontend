import { useEffect, useMemo, useState } from 'react'
import { FaBoxOpen, FaExclamationTriangle, FaLayerGroup, FaSearch } from 'react-icons/fa'
import { GrView } from 'react-icons/gr';
import { IoAlertCircleOutline, IoFilter } from 'react-icons/io5'
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchInventories, selectInventories, selectInventoryError, selectInventoryStatus } from '../feature/inventories/inventorySlice';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import InventoryTransactionCard from '../components/InventoryTransaction/InventoryTransactionCard';
import { fetchCategories, selectCategories, selectCategoryStatus } from '../feature/categories/categorySlice';
import LoadingState from '../components/helper/LoadingState';
import ErrorMessage from '../components/helper/ErrorMessage';
const InventoryTransaction = () => {
  
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const inventories = useSelector(selectInventories);
  const inventoryStatus = useSelector(selectInventoryStatus);
  const inventoryError = useSelector(selectInventoryError);
  const categories = useSelector(selectCategories);
  const categoryStatus = useSelector(selectCategoryStatus);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchInventories(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoryStatus]);

  const trackingItem = useMemo(() => {
    const inventoryList = Array.isArray(inventories?.data) ? inventories?.data : [];

    return {
      totalItem: inventoryList?.length,

      outOfStock: inventoryList.filter(
        (p) => p.product?.stock_quantity === 0
      ).length,

      lowStock: inventoryList.filter(
        (p) => p.product?.stock_quantity > 0 && p.product?.stock_quantity <= 5
      ).length,

      totalCategories: categories?.length ?? 0,
    };
  }, [inventories, categories]);
  
  const isLoading = inventoryStatus === "loading" || categoryStatus === "loading";
  
  const filteredInventory = useMemo(() => {
    const s = search.trim().toLowerCase();

    let lists = Array.isArray(inventories?.data) ? [...inventories?.data] : [];

    if(s) {
      lists = lists.filter((p) => {
        return (p.product?.product_name || "").toLowerCase().includes(s) 
      })
    }

    switch (sort) {
      case "az":
        lists.sort((a, b) =>
          (a.product?.product_name || "").localeCompare(b.product?.product_name || "")
        );
        break;

      case "za":
        lists.sort((a, b) =>
          (b.product_name || "").localeCompare(a.product?.product_name || "")
        );
        break;

      case "low-stock":
        lists = lists.filter(
          (p) => p.product?.stock_quantity > 0 && p.product?.stock_quantity <= 5
        );
        break;

      case "out-stock":
        lists = lists.filter((p) => p.product?.stock_quantity === 0);
        break;

      case "high-stock":
        lists = lists.filter((p) => p.product?.stock_quantity > 5);
        break;

      default:
        break;
    }

    return lists;
  }, [inventories, search, sort]);

  const handleClearFilter = () => {
    setSearch("");
    setSort("all");
  }

  return (
    <div className='w-full md:space-y-6 space-y-3'>
      <div className="w-full my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 gap-3 my-5 md:p-2 p-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className='md:space-y-6 space-y-4'>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total Inventory
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {isLoading ? <span className="animate-pulse">--</span> : trackingItem?.totalItem}
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
                  Out of Stock
                </p>
                <h2 className="text-3xl font-bold text-red-600 mt-2">
                  {isLoading ? <span className="animate-pulse">--</span> : trackingItem?.outOfStock}
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
                  Low Stock
                </p>
                <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                  {isLoading ? <span className="animate-pulse">--</span> : trackingItem?.lowStock}
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
                  Categories
                </p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {isLoading ? <span className="animate-pulse">--</span> : trackingItem?.totalCategories}
                </h2>
              </div>

              <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center">
                <FaLayerGroup className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
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
                placeholder="Search products, code, category..."
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
                    <option value="all">All Inventory</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="high-stock">High Stock</option>
                    <option value="out-stock">Out of Stock</option>
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
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Cost_Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Stock Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryStatus === "loading" && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <div className="flex justify-center items-center">
                        <LoadingState />
                      </div>
                    </td>
                  </tr>
                )}

                {inventoryStatus === "failed" && (
                  <tr>
                    <td colSpan={6}>
                      <ErrorMessage message="Failed to get products!" />
                    </td>
                  </tr>
                )}

                {
                  inventories?.data?.length > 0 && inventoryStatus === "succeeded" && (
                    filteredInventory.map((inventory) => (
                      <InventoryTransactionCard inventory={inventory} key={inventory.id}/>
                    ))
                  )
                }
              </tbody>
            </table>
            {
              inventoryStatus === "succeeded" && filteredInventory.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900">
                    No inventory found!
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
                Showing <span className="font-semibold">{inventories?.from}-{inventories?.to}</span> of{" "}
                <span className="font-semibold">{inventories.total}</span> products
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
                  {inventories.current_page}
                </button>
                <span className="px-2 text-gray-500 font-semibold">...</span>
                <button className="w-11 h-11 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition font-medium">
                  {inventories.last_page}
                </button>
                <button 
                  disabled={inventories.current_page === inventories.last_page}
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

export default InventoryTransaction