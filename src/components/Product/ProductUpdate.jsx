import { useEffect, useState } from 'react'
import { FiArrowLeft, FiSave, FiUpload } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchCategories, resetCategoryStatus, selectCategories, selectCategoryStatus } from '../../feature/categories/categorySlice';
import { fetchProductById, resetProductStatus, selectProductDetailData, updateProduct } from '../../feature/products/productSlice';
import { useDispatch, useSelector } from 'react-redux';

const ProductUpdate = () => {
  const [form, setForm] = useState({
    product_name: "",
    brand: "",
    cost_price: 0,
    selling_price: 0,
    stock_quantity: 0,
    image_url: null,
    type: "",
    category_id: "",
    description: "",
  })

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const categories = useSelector(selectCategories);
  const categoryStatus = useSelector(selectCategoryStatus);
  const productDetail = useSelector(selectProductDetailData);
  console.log(productDetail);

  // Fetch categories
  useEffect(() => {
    if(categoryStatus === "idle") dispatch(fetchCategories());
  }, [categoryStatus, dispatch]);

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;

    if(name === "image_url") {
      const file = files?.[0];

      setForm((prev) => ({
        ...prev,
        image_url: file || null
      }));
      if(file) setPreview(URL.createObjectURL(file));
      return;
    }else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Fetch product detail
  useEffect(() => {
    if(id) dispatch(fetchProductById(id));
  }, [id, dispatch]);

  // Append data to form
  useEffect(() => {
    if(!productDetail) return;

    setForm({
      product_name: productDetail?.product_name || "",
      brand: productDetail?.brand || "",
      cost_price: productDetail?.cost_price || 0,
      selling_price: productDetail?.selling_price || 0,
      stock_quantity: productDetail?.stock_quantity || 0,
      image_url: productDetail?.image_url || null,
      type: productDetail?.type || "",
      category_id: productDetail?.category_id || "",
      description: productDetail?.description || "",
    });

    // Set current image
    setCurrentImage(productDetail?.image_url);
    setPreview(null);
  }, [productDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if(!form.product_name || !form.category_id || !form.cost_price || !form.selling_price || !form.stock_quantity) {
        setIsError("Name, Category, Price and Quantity are required!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("product_name", form.product_name);
      formData.append("brand", form.brand);
      formData.append("cost_price", form.cost_price);
      formData.append("selling_price", form.selling_price);
      formData.append("stock_quantity", form.stock_quantity);
      formData.append("category_id", form.category_id);
      formData.append("description", form.description);
      formData.append("type", form.type);
      
      if (form.image_url) {
        formData.append("image_url", form.image_url); 
      }

      await dispatch(updateProduct({ id, formData })).unwrap();

      // Reset category status and product status
      dispatch(resetCategoryStatus());
      dispatch(resetProductStatus());

      Swal.fire({
        title: "Update",
        text: "Your Product is updated successfully!",
        icon: "success",
        timer: 1500,
      });

      const timeOut = setTimeout(() => {
        navigate("/products");
      }, 2000);

      setForm({
        product_name: "",
        brand: "",
        cost_price: 0,
        selling_price: 0,
        stock_quantity: 0,
        image_url: null,
        type: "",
        category_id: "",
        description: "",
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your Product is update failed!",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  console.log(form);

  const displayedImage =
    preview ||
    (currentImage
      ? `${import.meta.env.VITE_BASE_URL}/storage/${currentImage}`
      : null);

  return (
    <div className='w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow drop-shadow-white rounded-lg border border-gray-200'>
      <div className="flex md:items-center items-start justify-between">
        <div>
          <h2 className="md:text-3xl font-medium sm:text-2xl text-xl text-gray-900 text-wrap">
            Update New Product
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the form to update a new product.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center md:gap-2 gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft />
          Back
        </Link>
      </div>
      <div className='w-full md:my-6 my-4'>
        <form 
          onSubmit={handleSubmit}
          className="w-full p-3 space-y-6"
          encType="multipart/form-data"
          >
          <div className="grid grid-cols-12 items-center justify-center gap-6 mx-auto">
            <div className="md:col-span-8 col-span-12 flex flex-col item-start justify-start space-y-4">
              {/* Title */}
              <div className="space-y-1 flex flex-col">
                <label id="product_name" className="text-sm font-medium text-gray-700">
                  Product Name <span className='text-base text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  value={form.product_name}
                  onChange={handleOnChange}
                  required
                  placeholder="e.g. Roumdoul Rice"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label id="brand" className="text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={form.brand}
                  onChange={handleOnChange}
                  placeholder="e.g. Product of Cambodia"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div className="space-y-1 flex flex-col">
                <label id="stock_quantity" className="text-sm font-medium text-gray-700">
                  Stock Quantity <span className='text-base text-red-500'>*</span>
                </label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  value={form.stock_quantity}
                  onChange={handleOnChange}
                  required
                  placeholder="e.g. 2 or 3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div className="space-y-1 flex flex-col">
                <label id="type" className="text-sm font-medium text-gray-700">
                  Product Type
                </label>
                <select 
                  name="type" 
                  id="type" 
                  value={form.type}
                  required
                  onChange={handleOnChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200">
                  <option value="">Select Type</option>
                  <option value="New Rice">New Rice</option>
                  <option value="New Rice">Old Rice</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1 flex flex-col">
                <label
                  id="category_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Category <span className='text-base text-red-500'>*</span>
                </label>
                <select 
                  name="category_id" 
                  id="category_id" 
                  value={form.category_id}
                  required
                  onChange={handleOnChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200">
                  <option value="">Select Category</option>
                  {
                    categories?.length > 0 && (
                      categories.map((cate) => (
                        <option key={cate.id} value={cate?.id}>{cate?.category_name}</option>
                      ))
                    )
                  }
                </select>
              </div>
              {/* Description */}
              <div className="space-y-1 flex flex-col">
                <label id="description" className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea 
                  name="description" 
                  id="description"
                  value={form.description}
                  onChange={handleOnChange}
                  rows={4}
                  required
                  placeholder="Description..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                  />
              </div>
            </div>

            <div className="space-y-2 md:col-span-4 col-span-12 flex flex-col">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Product Image
              </p>

              <div className="flex flex-col items-start gap-6">
                {/* Preview */}
                <div className="w-full h-70 border border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                  {displayedImage ? (
                    <img
                      src={displayedImage}
                      alt="preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="space-y-2 flex flex-col">
                      <span className="sm:text-sm text-xs text-gray-400 text-center px-2">
                        No image selected
                      </span>
                      <span className="sm:text-sm text-xs text-gray-400 text-center px-2">
                        Accept type: JPG, PNG, JPEG, SVG
                      </span>
                      <span className="sm:text-sm text-xs text-gray-400 text-center px-2">
                        File Size should be less than 2 MB.
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <p className="flex justify-end items-end w-full">
                  <label
                    id="image_url"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
                  >
                    <FiUpload />
                    Upload image
                    <input
                      type="file"
                      id="image_url"
                      name="image_url"
                      accept="image/*"
                      onChange={handleOnChange}
                      className="hidden"
                    />
                  </label>
                </p>
              </div>

              <div className="space-y-1 flex flex-col">
                <label id="cost_price" className="text-sm font-medium text-gray-700">
                  Cost Price <span className='text-base text-red-500'>*</span>
                </label>
                <input
                  type="number"
                  id="cost_price"
                  name="cost_price"
                  value={form.cost_price}
                  onChange={handleOnChange}
                  required
                  placeholder="e.g. $10.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label id="selling_price" className="text-sm font-medium text-gray-700">
                  Selling Price <span className='text-base text-red-500'>*</span>
                </label>
                <input
                  type="number"
                  id="selling_price"
                  name="selling_price"
                  value={form.selling_price}
                  onChange={handleOnChange}
                  required
                  placeholder="e.g. $15.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>
            
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/products"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
            >
              <FiSave />
              Save
            </button>
          </div>
        </form>
        {isError && <p className="text-base text-red-500">{isError}</p>}
      </div>
    </div>
  )
}

export default ProductUpdate