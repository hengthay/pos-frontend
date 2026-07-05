import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  customersData: [],
  status: "idle",
  error: null,
  customerDetailData: null,
  statusDetail: "idle"
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers', async (page = 1, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/customers?page=${page}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No customers was found!");
      }

      console.log("Customers Response - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch customers: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById', async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/customers/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No customer was found!");
      }

      console.log("Customer Response - ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch customer: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer', async (formData, thunkAPI) => {
    try {
      const res = await axiosInstace.post(`${API_BASE_URL}/customers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to create customer!");
      }

      console.log("Customer Created Response - ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to create customer: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer', async ({ id, formData }, thunkAPI) => {
    try {
      const res = await axiosInstace.put(`${API_BASE_URL}/customers/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to update customer!");
      }

      console.log("Customer Updated Response - ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to update customer: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer', async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.delete(`${API_BASE_URL}/customers/${id}`);

      if(res?.data?.data) return id;

      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Unable to delete customer!");
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to delete customer: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);


const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    resetCustomerStatus: (state) => {
      state.error = null;
      state.status = "idle";
      state.statusDetail = "idle"
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.customersData = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.statusDetail = "loading";
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.statusDetail = "succeeded";
        state.error = null;
        state.customerDetailData = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.statusDetail = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(createCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.customersData = [...state.customersData, action.payload];
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(updateCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const updated = action.payload;

        state.customersData = state.customersData.map((cus) => cus.id === updated.id ? updated : cus);
        state.customerDetailData = updated;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const deletedId = action.payload;

        state.customersData = state.customersData.filter((cus) => cus.id !== deletedId);
        
        if(state?.customerDetailData?.id === deletedId) {
          state.customerDetailData = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
  }
});

export default customerSlice.reducer;
export const { resetCustomerStatus } = customerSlice.actions;
export const selectCustomers = (state) => state.customers.customersData;
export const selectCustomerStatus = (state) => state.customers.status;
export const selectCustomerError = (state) => state.customers.error;
export const selectCustomerDetailData = (state) => state.customers.customerDetailData;
export const selectCustomerStatusDetail = (state) => state.customers.statusDetail;