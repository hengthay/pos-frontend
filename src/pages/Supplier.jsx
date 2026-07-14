import { useEffect, useMemo, useState } from 'react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { IoFilter } from 'react-icons/io5'
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchSupplierByPagination, selectSupplierError, selectSuppliersData, selectSupplierStatus } from '../feature/suppliers/supplierSlice'
import SupplierCard from '../components/Supplier/SupplierCard'
import LoadingState from '../components/helper/LoadingState'
import ErrorMessage from '../components/helper/ErrorMessage'
import PaginationRender from '../components/helper/PaginationRender'

const Supplier = () => {

  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const suppliers = useSelector(selectSuppliersData);
  const supplierStatus = useSelector(selectSupplierStatus);
  const supplierError = useSelector(selectSupplierError);

  useEffect(() => {
    if(page) dispatch(fetchSupplierByPagination({ page: page }));
  }, [page, dispatch]);

  const filteredSupplier = useMemo(() => {
    const s = search.trim().toLowerCase();

    let lists = Array.isArray(suppliers?.data) ? [...suppliers?.data] : [];

    if(s) {
      lists = lists.filter((p) => {
        return (p.supplier_name || "").toLowerCase().includes(s) ||
         (p.email || "").toLowerCase().includes(s) ||
         (p.contact_name || "").toLowerCase().includes(s)
      })
    }

    switch (sort) {
      case "az":
        lists.sort((a, b) =>
          (a.supplier_name || "").localeCompare(b.supplier_name || "")
        );
        break;

      case "za":
        lists.sort((a, b) =>
          (b.supplier_name || "").localeCompare(a.supplier_name || "")
        );
        break;
      default:
        break;
    }

    return lists;
  }, [suppliers, search, sort]);

  const handleClearFilter = () => {
    setSearch("");
    setSort("all");
  }

  return (
    <div className='w-full md:space-y-6 space-y-3'>
      <div className="w-full my-4">
        <div className='flex md:flex-row flex-col flex-1 justify-between md:items-center items-start'>
          <div className="md:space-y-2 space-y-1.5 md:my-2 my-1.5 md:p-2 p-0">
            <h2 className="md:text-4xl font-semibold sm:text-3xl text-2xl">
              Supplier Management
            </h2>
            <p className="md:text-base text-sm text-gray-500">
              Organize and manage your suppliers.
            </p>
          </div>
          <Link to="/suppliers/create" className='flex items-center md:gap-1.5 gap-1 text-white bg-blue-700 md:py-2.5 md:px-3 p-2 rounded-xl hover:bg-blue-500 transition-all ease-in-out duration-200 font-medium'>
            <FaPlus size={18}/>
            New Supplier
          </Link>
        </div>

        <div className='md:mt-4 mt-8'>
          <div className='md:px-2 md:mt-4 mt-2'>  
            <div className='w-full bg-blue-50 shadow-sm rounded-t-xl md:p-4 p-2 flex gap-2'>
              <div
                className={`flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 w-100`}
              >
                <FaSearch className="text-gray-400 text-sm" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Supplier, Email, Contact name..."
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
                      <option value="all">All suppliers</option>
                      <option value="az">A-Z</option>
                      <option value="za">Z-A</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='md:px-2'>
            <div className="w-full overflow-x-auto border border-gray-200 bg-white">
              <table className="w-full">
                <thead className="bg-blue-50/30 border-b border-blue-200">
                  <tr className='uppercase'>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Supplier
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Contact Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {supplierStatus === "loading" && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <div className="flex justify-center items-center">
                          <LoadingState />
                        </div>
                      </td>
                    </tr>
                  )}

                  {supplierStatus === "failed" && (
                    <tr>
                      <td colSpan={6}>
                        <ErrorMessage message="Failed to get suppliers!" />
                      </td>
                    </tr>
                  )}
                  {
                    suppliers?.data?.length > 0 && supplierStatus === "succeeded" && (
                      filteredSupplier?.map((supplier) => (
                        <SupplierCard key={supplier.id} supplier={supplier}/>
                      ))
                    )
                  }
                </tbody>
              </table>
              {
                supplierStatus === "succeeded" && filteredSupplier.length === 0 && (
                  <div className="w-full flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900">
                      No supplier found!
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

          <PaginationRender 
            page={page} 
            setPage={setPage} 
            data={suppliers} 
            pageName={"suppliers"}
            />
        </div>
      </div>
    </div>
  )
}

export default Supplier