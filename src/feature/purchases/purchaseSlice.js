import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  purchasesData: [],
  status: "idle",
  error: null,
  purchaseDetailData: null,
  statusDetail: "idle"
}

export const fetchPurchases = createAsyncThunk(
  "purchases/fetchPurchases", async (page = 1, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/purchases?page=${page}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Purchases was founds!");
      }

      console.log("Purchases Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch purchases: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchPurchaseById = createAsyncThunk(
  "purchases/fetchPurchaseById", async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/purchases/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Purchase was founds!");
      }

      console.log("Purchase Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch purchase: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createPurchase = createAsyncThunk(
  "purchases/createPurchase", async (payload, thunkAPI) => {
    try {
      const res = await axiosInstace.post(`${API_BASE_URL}/purchases`, payload, {
        headers: {
          "Content-Type" : "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to create new purchase!");
      }

      console.log("Purchase Created Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to create purchase: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updatePurchase = createAsyncThunk(
  "purchases/updatePurchase", async ({ id, payload }, thunkAPI) => {
    try {
      const res = await axiosInstace.put(`${API_BASE_URL}/purchases/${id}`, payload, {
        headers: {
          "Content-Type" : "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to update purchase!");
      }

      console.log("Purchase Updated Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to update purchase: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const deletePurchase = createAsyncThunk(
  'sales/deletePurchase', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstace.delete(`${API_BASE_URL}/purchases/${id}`);

      if(res?.data?.data) return id;

      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Unable to delete purchase!")
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to delete purchase: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const purchaseSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {
    resetPurchaseStatus: (state) => {
      state.status = "idle";
      state.statusDetail = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        state.purchasesData = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(fetchPurchaseById.pending, (state) => {
        state.error = null,
        state.statusDetail = "loading";
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.error = null,
        state.statusDetail = "succeeded";
        state.purchaseDetailData = action.payload;
      })
      .addCase(fetchPurchaseById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.statusDetail = "failed";
      })
      .addCase(createPurchase.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        if(Array.isArray(state.purchasesData)) {
          state.purchasesData.push(action.payload);
        }
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(updatePurchase.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const updated = action.payload;

        if(Array.isArray(state.purchasesData)) {
          state.purchasesData = state.purchasesData.map((purchase) => purchase.id === updated.id ? updated : purchase);
        }

        state.purchaseDetailData = updated;
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(deletePurchase.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const deletedId = action.payload;

        if(Array.isArray(state.purchasesData)) {
          state.purchasesData = state.purchasesData.filter((purchase) => purchase.id !== deletedId);
        }

        if(state.purchaseDetailData?.id === deletedId) {
          state.purchaseDetailData = null;
        }
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
  }
})

export default purchaseSlice.reducer;
export const { resetPurchaseStatus } = purchaseSlice.actions;
export const selectPurchasesData = (state) => state.purchases.purchasesData;
export const selectPurchaseStatus = (state) => state.purchases.status;
export const selectPurchaseError = (state) => state.purchases.error;
export const selectPurchaseDetailData = (state) => state.purchases.purchaseDetailData;
export const selectPurchaseStatusDetail = (state) => state.purchases.statusDetail;