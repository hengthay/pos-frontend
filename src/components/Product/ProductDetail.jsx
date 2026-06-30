import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchProductById, selectProductDetailData, selectProductStatusDetail } from "../../feature/products/productSlice";
import LoadingState from "../helper/LoadingState";
import ErrorMessage from "../helper/ErrorMessage";
import formatDate from "../helper/formatDate";

const ProductDetail = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetail = useSelector(selectProductDetailData);
  const productDetailStatus = useSelector(selectProductStatusDetail);
  
  useEffect(() => {
    if(id) dispatch(fetchProductById(id))
  }, [id, dispatch])


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-500">Products / Detail</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">
                Product Detail
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                View complete information about this product.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={'/products'}
                className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100">
                Back
              </Link>
              <Link
                to={`/products/${productDetail?.id}/edit`}
                className="rounded-xl bg-slate-900 px-5 py-2 text-white hover:bg-slate-800">
                Edit Product
              </Link>
            </div>
          </div>
        </div>

        {
          productDetailStatus === "loading" && (
            <LoadingState />
          )
        }

        {
          productDetailStatus === "succeeded" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
                  {
                    productDetail?.image_url ? (
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}/storage/${productDetail?.image_url}`}
                        alt={productDetail?.product_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex justify-center items-center">
                        <p className="text-lg font-semibold">No Image Available</p>
                      </div>
                    )
                  }
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between border-b border-slate-100 py-3">
                    <span className="text-sm text-slate-500">Product Code</span>
                    <span className="text-sm font-medium text-slate-800">{productDetail?.product_code ?? "Unavailable"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 py-3">
                    <span className="text-sm text-slate-500">Created</span>
                    <span className="text-sm font-medium text-slate-800">{formatDate(productDetail?.created_at) ?? "Unavailable"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 py-3">
                    <span className="text-sm text-slate-500">Updated</span>
                    <span className="text-sm font-medium text-slate-800">{formatDate(productDetail?.updated_at) ?? "Unavailable"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-semibold text-slate-900">
                          {productDetail?.product_name ?? "Unavailable"}
                        </h2>
                        <span className={`rounded-full  px-3 py-1 text-sm font-medium  ${productDetail?.stock_quantity > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-yellow-700 bg-yellow-50'}`}>
                          {productDetail?.stock_quantity > 0 ? "In Stock" : "Out Of Stock"}
                        </span>
                      </div>

                      <p className="mt-2 text-slate-500">
                        Brand: <span className="font-medium text-slate-700">{productDetail?.brand ?? "Unavailable"}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {productDetail?.type ?? "Unavailable"}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                        {productDetail?.category?.category_name ?? "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Cost Price</p>
                    <h3 className={`mt-2 text-2xl font-semibold text-slate-900`}>${productDetail?.cost_price ?? "Unavailable"}</h3>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Selling Price</p>
                    <h3 className={`mt-2 text-2xl font-semibold text-slate-900`}>${productDetail?.selling_price ?? "Unavailable"}</h3>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Stock Quantity</p>
                    <h3 className={`mt-2 text-2xl font-semibold text-slate-900`}>{productDetail?.stock_quantity ?? "Unavailable"}</h3>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Description</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {productDetail?.description ?? "Unavailable"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Additional Information
                  </h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between border-b border-slate-100 py-3">
                      <span className="text-sm text-slate-500">Product ID</span>
                      <span className="text-sm font-medium text-slate-800">#{productDetail?.id ?? "Unavailable"}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 py-3">
                      <span className="text-sm text-slate-500">Category</span>
                      <span className="text-sm font-medium text-slate-800">{productDetail?.category?.category_name ?? "Unavailable"}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 py-3">
                      <span className="text-sm text-slate-500">Brand</span>
                      <span className="text-sm font-medium text-slate-800">{productDetail?.brand ?? "Unavailable"}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 py-3">
                      <span className="text-sm text-slate-500">Product Type</span>
                      <span className="text-sm font-medium text-slate-800">{productDetail?.type ?? "Unavailable"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        {
          productDetailStatus === "failed" && (
            <ErrorMessage message={"Failed to get product detail!"}/>
          )
        }
      </div>
    </div>
  );
};

export default ProductDetail;