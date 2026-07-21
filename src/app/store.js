import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import saleReducer from "../feature/sales/saleSlice";
import productReducer from "../feature/products/productSlice";
import cartReducer from "../feature/cartTemp/cartTempSlice";
import categoryReducer from "../feature/categories/categorySlice";
import inventoryReducer from "../feature/inventories/inventorySlice";
import customerReducer from "../feature/customers/customerSlice";
import purchaseReducer from "../feature/purchases/purchaseSlice";
import supplierReducer from "../feature/suppliers/supplierSlice";
import expenseReducer from "../feature/expenses/expenseSlice";
import paymentReducer from "../feature/payments/paymentSlice";
import reportReducer from "../feature/reports/reportSlice";

const store = configureStore({
  reducer: {
    auths: authReducer,
    sales: saleReducer,
    products: productReducer,
    carts: cartReducer,
    categories: categoryReducer,
    customers: customerReducer,
    inventories: inventoryReducer,
    purchases: purchaseReducer,
    suppliers: supplierReducer,
    expenses: expenseReducer,
    payments: paymentReducer,
    reports: reportReducer
  }
});

export default store;