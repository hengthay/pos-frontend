import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import saleReducer from "../feature/sales/saleSlice";
import productReducer from "../feature/products/productSlice";
import cartReducer from "../feature/cartTemp/cartTempSlice";
import categoryReducer from "../feature/categories/categorySlice";
import inventoryReducer from "../feature/inventories/inventorySlice";

const store = configureStore({
  reducer: {
    auths: authReducer,
    sales: saleReducer,
    products: productReducer,
    carts: cartReducer,
    categories: categoryReducer,
    inventories: inventoryReducer,
  }
});

export default store;