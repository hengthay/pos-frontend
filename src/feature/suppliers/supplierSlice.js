import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  suppliersData: [],
  status: "idle",
  error: null,
  supplierDetailData: null,
  statusDetail: "idle"
}

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchSuppliers", async (_, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/suppliers`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Suppliers was founds!");
      }

      console.log("Suppliers Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch suppliers: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    resetSupplierStatus: (state) => {
      state.error = null;
      state.status = "idle";
      state.statusDetail = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        state.suppliersData = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
  }
});

export default supplierSlice.reducer;
export const { resetSupplierStatus } = supplierSlice.actions;
export const selectSuppliersData = (state) => state.suppliers.suppliersData;
export const selectSupplierStatus = (state) => state.suppliers.status;
export const selectSupplierError = (state) => state.suppliers.error;
export const selectSupplierDetailData = (state) => state.suppliers.supplierDetailData;
export const selectSupplierStatusDetail = (state) => state.suppliers.statusDetail;