import React, { useEffect, useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { IoFilter, IoAlertCircleOutline } from "react-icons/io5";
import {
  FaBoxOpen,
  FaExclamationTriangle,
  FaLayerGroup,
  FaSearch,
} from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { CiEdit, CiTrash } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProductError, selectProducts, selectProductStatus } from '../feature/products/productSlice';
import { fetchCategories, selectCategories, selectCategoryStatus } from '../feature/categories/categorySlice';
import ProductCard from '../components/Product/ProductCard';
import LoadingState from '../components/helper/LoadingState';
import ErrorMessage from '../components/helper/ErrorMessage';

const Product = () => {

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const productStatus = useSelector(selectProductStatus);
  const productError = useSelector(selectProductError);
  const categories = useSelector(selectCategories);
  const categoryStatus = useSelector(selectCategoryStatus);

  useEffect(() => {
    if(productStatus === "idle") dispatch(fetchProducts());
    if(categoryStatus === "idle") dispatch(fetchCategories());
  }, [productStatus, dispatch]);
  
  const trackingItem = useMemo(() => {
    const productList = Array.isArray(products) ? products : [];

    return {
      totalItem: productList.length,

      outOfStock: productList.filter(
        (p) => p.stock_quantity === 0
      ).length,

      lowStock: productList.filter(
        (p) => p.stock_quantity > 0 && p.stock_quantity <= 5
      ).length,

      totalCategories: categories?.length ?? 0,
    };
  }, [products, categories]);

  const isLoading = productStatus === "loading" || categoryStatus === "loading";

  const filteredProduct = useMemo(() => {
    const s = search.trim().toLowerCase();

    let lists = Array.isArray(products) ? [...products] : [];

    if(s) {
      lists = lists.filter((p) => {
        return (
          (p.product_name || "").toLowerCase().includes(s) ||
          (p.product_code || "").toLowerCase().includes(s) ||
          (p.category?.category_name || "").toLowerCase().includes(s)
        );
      })
    }

    switch (sort) {
      case "az":
        lists.sort((a, b) =>
          (a.product_name || "").localeCompare(b.product_name || "")
        );
        break;

      case "za":
        lists.sort((a, b) =>
          (b.product_name || "").localeCompare(a.product_name || "")
        );
        break;

      case "low-stock":
        lists = lists.filter(
          (p) => p.stock_quantity > 0 && p.stock_quantity <= 5
        );
        break;

      case "out-stock":
        lists = lists.filter((p) => p.stock_quantity === 0);
        break;

      case "high-stock":
        lists = lists.filter((p) => p.stock_quantity > 5);
        break;

      default:
        break;
    }

    return lists;
  }, [products, search, sort]);

  const handleClearFilter = () => {
    setSearch("");
    setSort("all");
  }
  return (
    <div className='w-full md:space-y-6 space-y-3'>
      <div className="w-full my-4">
        <div className='flex md:flex-row flex-col flex-1 justify-between md:items-center items-start'>
          <div className="space-y-4 my-4 md:p-2 p-0">
            <h2 className="md:text-4xl font-semibold sm:text-3xl text-2xl">
              Product Management
            </h2>
            <p className="md:text-base text-sm text-gray-500">
              Organize and manage your products.
            </p>
          </div>
          <Link to="/products/create" className='flex items-center md:gap-1.5 gap-1 text-white bg-blue-700 md:py-2.5 md:px-3 p-2 rounded-xl hover:bg-blue-500 transition-all ease-in-out duration-200 font-medium'>
            <FaPlus size={18}/>
            Add Product
          </Link>
        </div>

        <div className='md:p-2 p-0 md:my-0 my-2 flex gap-2'>
          <div
            className={`flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-100`}
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
                  <option value="all">All Products</option>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 gap-3 my-5 md:p-2 p-0">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Total Items
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
              <div>
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
              <div>
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
              <div>
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

        <div className='md:p-2 p-0 my-2'>
          <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-blue-200">
                <tr className='uppercase'>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Stock Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {productStatus === "loading" && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <div className="flex justify-center items-center">
                        <LoadingState />
                      </div>
                    </td>
                  </tr>
                )}

                {productStatus === "failed" && (
                  <tr>
                    <td colSpan={6}>
                      <ErrorMessage message="Failed to get products!" />
                    </td>
                  </tr>
                )}
                
                {
                  products.length > 0 && productStatus === "succeeded" && (
                    filteredProduct?.map((product) => (
                      <ProductCard product={product} key={product.id}/>
                    ))
                  )
                }
              </tbody>
            </table>
            {
              productStatus === "succeeded" && filteredProduct.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900">
                    No product found!
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
      </div>
    </div>
  )
}

export default Product