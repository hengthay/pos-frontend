import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import saleReducer from "../feature/sales/saleSlice";
import productReducer from "../feature/products/productSlice";
import cartReducer from "../feature/cartTemp/cartTempSlice";


const store = configureStore({
  reducer: {
    auths: authReducer,
    sales: saleReducer,
    products: productReducer,
    carts: cartReducer,
  }
});

export default store;