import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { fetchPurchaseById, fetchPurchases, resetPurchaseStatus, selectPurchaseDetailData, selectPurchaseStatusDetail, updatePurchase } from '../../feature/purchases/purchaseSlice';
import { fetchProducts, resetProductStatus, selectProducts, selectProductStatus } from '../../feature/products/productSlice';
import { fetchSuppliers, resetSupplierStatus, selectSuppliersData, selectSupplierStatus } from '../../feature/suppliers/supplierSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';

const emptyItem = {
  product_id: '',
  quantity: '',
  cost_price: '',
};
const PurchaseUpdate = () => {

  const [form, setForm] = useState({
    supplier_id: "",
    purchase_date: "",
    status: "pending",
    total_amount: "",
    items: [structuredClone(emptyItem)]
  });

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);

  const purchaseDetail = useSelector(selectPurchaseDetailData);
  const statusDetail = useSelector(selectPurchaseStatusDetail);
  // Supplier
  const suppliers = useSelector(selectSuppliersData);
  const supplierStatus = useSelector(selectSupplierStatus);
  // Products
  const products = useSelector(selectProducts);
  const productStatus = useSelector(selectProductStatus);

  // Fetch purchase detail
  useEffect(() => {
    if(id) dispatch(fetchPurchaseById(id));
  }, [id, dispatch]);

  // Fetch supplier and product
  useEffect(() => {
    if(supplierStatus === "idle") dispatch(fetchSuppliers());
    if(productStatus === "idle") dispatch(fetchProducts());
  }, [supplierStatus, productStatus, dispatch]);

  // console.log("Purchase detail: ", purchaseDetail);
  // console.log("Suppliers: ", suppliers);
  // console.log("Products: ", products);

  // When redux is ready
  useEffect(() => {
    if(!purchaseDetail) return;

    setForm({
      supplier_id: purchaseDetail?.supplier_id ?? "",
      purchase_date: purchaseDetail?.purchase_date
      ? purchaseDetail.purchase_date.split("T")[0]
      : "",
      status: purchaseDetail?.status ?? "pending",
      total_amount: purchaseDetail?.total_amount ?? "",
      items: purchaseDetail?.purchase_items?.map((item) => ({
        product_id: String(item.product_id),
        quantity: item.quantity,
        cost_price: item.cost_price,
      })) || [structuredClone(emptyItem)],
    });
  }, [purchaseDetail]);

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      // Get all items
      const items = [...prev.items];
      // Get each update item
      const updatedItem = {
        ...items[index],
        [name]: value,
      };

      // If product_id was selected, auto fill the product price
      if (name === 'product_id') {
        const selectedProduct = products.find(
          (prod) => String(prod.id) === String(value)
        );
        // Update price
        updatedItem.cost_price = selectedProduct?.cost_price || '';
      }
      // Assign items to that index
      items[index] = updatedItem;
      // Return item to form
      return { ...prev, items };
    });
  };

  // Add item
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, structuredClone(emptyItem)],
    }));
  };

  // Remove item
  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.length > 1
        ? prev.items.filter((_, i) => i !== index)
        : prev.items,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!form.supplier_id) return setIsError('Supplier is missing!');
      if (!form.purchase_date) return setIsError('Purchase Date is missing!');
      if (!form.status) return setIsError('Status is missing!');
      if (!form.items.length) return setIsError('At least one item is required!');

      for (const item of form.items) {
        if (!item.product_id) return setIsError('Each item needs a product!');
        if (!item.quantity) return setIsError('Each item needs quantity!');
        if (!item.cost_price) return setIsError('Each item needs cost price!');
      }

      // recalculate amount
      const totalAmount = form.items.reduce((sum, item) => {
        return sum + (Number(item.quantity) * Number(item.cost_price));
      }, 0);

      const payload = {
        supplier_id: form.supplier_id,
        purchase_date: form.purchase_date,
        status: form.status,
        total_amount: totalAmount,
        items: form.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          cost_price: item.cost_price,
        })),
      };

      await dispatch(updatePurchase({ id, payload })).unwrap();

      // Reset status
      dispatch(resetPurchaseStatus());
      dispatch(resetProductStatus());
      dispatch(resetSupplierStatus());
      

      Swal.fire({
        title: "Updated",
        text: "Your Purchase is updated successfully!",
        icon: "success",
        timer: 1500,
      });

      const timeOut = setTimeout(() => {
        navigate("/purchases");
      }, 2000);

      setForm({
        supplier_id: "",
        purchase_date: "",
        status: "pending",
        total_amount: "",
        items: []
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Your Purchase is updated failed!",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:my-4 my-2 md:p-4 p-2 bg-white shadow drop-shadow-white rounded-lg border border-gray-200">
      <div className="flex md:items-center items-start justify-between">
        <div>
          <h2 className="md:text-3xl font-medium sm:text-2xl text-xl text-gray-900 text-wrap">
            Update Purchase
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the form to update a new purchase.
          </p>
        </div>

        <Link
          to="/purchases"
          className="inline-flex items-center md:gap-2 gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft />
          Back
        </Link>
      </div>

      <div className="w-full md:my-6 my-4">
        <form onSubmit={handleSubmit} className="w-full p-3 space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="md:col-span-6 col-span-12 space-y-4">
              <div className="space-y-1 flex flex-col">
                <label htmlFor="supplier_id" className="text-sm font-medium text-gray-700">
                  Supplier <span className="text-base text-red-500">*</span>
                </label>
                <select
                  id="supplier_id"
                  name="supplier_id"
                  value={form.supplier_id}
                  onChange={handleMainChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="" disabled>Select Supplier</option>
                  {supplierStatus === 'succeeded' &&
                    suppliers?.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.supplier_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1 flex flex-col">
                <label htmlFor="purchase_date" className="text-sm font-medium text-gray-700">
                  Purchase Date <span className="text-base text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="purchase_date"
                  name="purchase_date"
                  value={form.purchase_date}
                  onChange={handleMainChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status <span className="text-base text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleMainChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-6 col-span-12 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200"
                >
                  <FiPlus />
                  Add Item
                </button>
              </div>

              {form.items.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Item {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                      disabled={form.items.length === 1}
                    >
                      <FiTrash2 />
                      Remove
                    </button>
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <label htmlFor={`product_id-${index}`} className="text-sm font-medium text-gray-700">
                      Product <span className="text-base text-red-500">*</span>
                    </label>
                    <select
                      id={`product_id-${index}`}
                      name="product_id"
                      value={item.product_id}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <option value="" disabled>Select Product</option>
                      {productStatus === 'succeeded' &&
                        products?.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.product_name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <label htmlFor={`quantity-${index}`} className="text-sm font-medium text-gray-700">
                      Quantity <span className="text-base text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      id={`quantity-${index}`}
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <label htmlFor={`cost_price-${index}`} className="text-sm font-medium text-gray-700">
                      Cost Price <span className="text-base text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      id={`cost_price-${index}`}
                      name="cost_price"
                      value={item.cost_price}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isError && <p className="text-base text-red-500">{isError}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <Link
              to="/purchases"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer disabled:bg-gray-200"
            >
              <FiSave />
              {loading ? 'Updating...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PurchaseUpdate