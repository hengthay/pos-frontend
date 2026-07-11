import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  salesData: [] || null,
  status: "idle",
  error: null,
  // Sale detail
  saleDetailData: null,
  statusDetail: "idle"
};

// Fetch all sales
export const fetchSales = createAsyncThunk(
  'sales/fetchSales', async (page = 1, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/sales?page=${page}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Sales was founds!");
      }

      console.log("Sale Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch sales: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

// Fetch sales by id
export const fetchSaleById = createAsyncThunk(
  'sales/fetchSaleById', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstace.get(`${API_BASE_URL}/sales/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Sale was found!");
      }

      console.log("Sale Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch sales: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

// Post new sale
export const createSale = createAsyncThunk(
  'sales/createSale', async ({ formData }, thunkAPI) => {
    try {
      console.log("Redux - ", formData);
      const res = await axiosInstace.post(`${API_BASE_URL}/sales`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to create sale");
      }

      console.log("Sale Created Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to create sale: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

// update sale
export const updateSale = createAsyncThunk(
  'sales/updateSale', async ({ id, formData }, thunkAPI) => {
    try {
      
      const res = await axiosInstace.put(`${API_BASE_URL}/sales/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to update sale");
      }

      console.log("Sale Update Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to update sale: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateSaleDetail = createAsyncThunk(
  'sales/updateSaleDetail', async ({ id, formData }, thunkAPI) => {
    try {
      
      const res = await axiosInstace.put(`${API_BASE_URL}/sales/${id}/detail`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to update sale detail!");
      }

      console.log("Sale Detail Update Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to update sale: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

// delete sale
export const deleteSale = createAsyncThunk(
  'sales/deleteSale', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstace.delete(`${API_BASE_URL}/sales/${id}`);

      if(res?.data?.data) return id;

      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Unable to delete sale!")
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to delete sale: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)


const saleSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        state.salesData = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = "failed";
      })
      .addCase(fetchSaleById.pending, (state) => {
        state.error = null;
        state.statusDetail = "loading";
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.error = null;
        state.statusDetail = "succeeded";
        state.saleDetailData = action.payload;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.statusDetail = "failed";
      })
      .addCase(createSale.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        if (Array.isArray(state.salesData)) {
          state.salesData.push(action.payload);
        } else {
          state.salesData = [action.payload];
        }
      })
      .addCase(createSale.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = "failed";
      })
      .addCase(updateSale.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        const updated = action.payload;

        if (Array.isArray(state.salesData)) {
          state.salesData = state.salesData.map((sale) =>
            sale.id === updated.id ? updated : sale
          );
        }

        state.saleDetailData = updated;
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = "failed";
      })
      .addCase(updateSaleDetail.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateSaleDetail.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        const updated = action.payload;

        if (Array.isArray(state.salesData)) {
          state.salesData = state.salesData.map((sale) =>
            sale.id === updated.id ? updated : sale
          );
        }

        state.saleDetailData = updated;
      })
      .addCase(updateSaleDetail.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = "failed";
      })
      .addCase(deleteSale.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        const deletedId = action.payload;
        
        if(Array.isArray(state.salesData)) {
          state.salesData = state.salesData.filter((sale) => sale.id !== deletedId);
        }

        if(state.saleDetailData?.id === deletedId) {
          state.saleDetailData = null;
        }
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = "failed";
      })
  }
});

export default saleSlice.reducer;
export const selectSalesData = (state) => state.sales.salesData;
export const selectSalesStatus = (state) => state.sales.status;
export const selectSalesError = (state) => state.sales.error;
export const selectSaleDetailData = (state) => state.sales.saleDetailData;
export const selectSaleStatusDetail = (state) => state.sales.statusDetail;
