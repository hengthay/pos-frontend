import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  paymentsData: [],
  status: "idle",
  error: null,
  paymentDetailData: null,
  statusDetail: "idle"
}

export const fetchPaymentByPagination = createAsyncThunk(
  "payments/fetchPaymentByPagination", async (params = {}, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/payments`, { params });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Payment was found!");
      }

      console.log("Payment Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch payment: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchPaymentById = createAsyncThunk(
  "payments/fetchPaymentById", async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/payments/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Payment was founds!");
      }

      console.log("Payment Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch payment: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createSalePayment = createAsyncThunk(
  "payments/createSalePayment", async ({ saleId, formData }) => {
    try {
      const res = await axiosInstace.post(`${API_BASE_URL}/sales/${saleId}/payments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to create new sale payment!");
      }

      console.log("Sale Payment Created Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to create sale payment: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updatePayment = createAsyncThunk(
  "payments/updatePayment", async ({ id , formData }, thunkAPI) => {
    try {
      const res = await axiosInstace.put(`${API_BASE_URL}/payments/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to update payment!");
      }

      console.log("Payment Updated Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to update payment: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const deletePayment = createAsyncThunk(
  "payments/deletePayment", async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.delete(`${API_BASE_URL}/payments/${id}`);

      if(res?.data?.data) return id;
      
      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Unable to delete payment!");
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to delete payment: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    resetPaymentStatus: (state) => {
      state.error = null;
      state.status = "idle";
      state.statusDetail = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentByPagination.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(fetchPaymentByPagination.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        state.paymentsData = action.payload;
      })
      .addCase(fetchPaymentByPagination.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(fetchPaymentById.pending, (state) => {
        state.error = null,
        state.statusDetail = "loading";
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.error = null,
        state.statusDetail = "succeeded";
        state.paymentDetailData = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.statusDetail = "failed";
      })
      .addCase(createSalePayment.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(createSalePayment.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        if(Array.isArray(state.paymentsData)) {
          state.paymentsData.push(action.payload);
        }
      })
      .addCase(createSalePayment.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(updatePayment.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const updated = action.payload;

        if(Array.isArray(state.paymentsData)) {
          state.paymentsData = state.paymentsData.map((payment) => payment.id === updated.id ? updated : payment);
        }

        state.paymentDetailData = updated;
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(deletePayment.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const deletedId = action.payload;

        if(Array.isArray(state.paymentsData)) {
          state.paymentsData = state.paymentsData.filter((payment) => payment.id !== deletedId);
        }

        if(state.paymentDetailData?.id === deletedId.id) {
          state.paymentDetailData = null;
        }
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
  }
});

export default paymentSlice.reducer;
export const { resetPaymentStatus } = paymentSlice.actions;
export const selectPaymentsData = (state) => state.payments.paymentsData;
export const selectPaymentStatus = (state) => state.payments.status;
export const selectPaymentError = (state) => state.payments.error;
export const selectPaymentDetailData = (state) => state.payments.paymentDetailData;
export const selectPaymentStatusDetail = (state) => state.payments.statusDetail;