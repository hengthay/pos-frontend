import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";


const store = configureStore({
  reducer: {
    auths: authReducer
  }
});

export default store;