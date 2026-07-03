import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  inventoriesData: [],
  status: "idle",
  error: null,
  inventoryDetailData: null,
  statusDetail: "idle"
}

export const fetchInventories = createAsyncThunk(
  'inventories/fetchInventories', async (page = 1, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/inventory-transactions?page=${page}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No inventories record was found!")
      }

      console.log("Inventories Response Data - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch inventories: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const fetchInventoryById = createAsyncThunk(
  'inventories/fetchInventoryById', async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/inventory-transactions/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No inventory record was found!")
      }

      console.log("Inventories Response Data - ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch inventory: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const inventorySlice = createSlice({
  name: "inventories",
  initialState,
  reducers: {
    resetInventoryStatus: (state) => {
      state.error = null;
      state.status = "idle";
      state.statusDetail = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventories.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchInventories.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        state.inventoriesData = action.payload;
      })
      .addCase(fetchInventories.rejected, (state, action) => {
        state.error = null;
        state.status = "failed";
      })
      .addCase(fetchInventoryById.pending, (state) => {
        state.error = null;
        state.statusDetail = "loading";
      })
      .addCase(fetchInventoryById.fulfilled, (state, action) => {
        state.error = null;
        state.statusDetail = "succeeded";
        state.inventoryDetailData = action.payload;
      })
      .addCase(fetchInventoryById.rejected, (state, action) => {
        state.error = null;
        state.statusDetail = "failed";
      })
  }
})

export default inventorySlice.reducer;
export const { resetInventoryStatus } = inventorySlice.actions;
export const selectInventories = (state) => state.inventories.inventoriesData;
export const selectInventoryStatus = (state) => state.inventories.status;
export const selectInventoryError = (state) => state.inventories.error;
export const selectInventoryDetailData = (state) => state.inventories.inventoryDetailData;
export const selectInventoryDetailStatus = (state) => state.inventories.statusDetail;
