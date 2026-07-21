import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  salesReport: null,
  purchasesReport: null,
  expenseReport: null,
  profitLossReport: null,
  status: "idle",
  error: null,
}

export const fetchSalesReport = createAsyncThunk(
  "reports/fetchSalesReport", async (params = {}, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/reports/sales`, { params });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Sale Reports was found!");
      }

      console.log("Sale Reports Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch sale reports: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchPurchasesReport = createAsyncThunk(
  "reports/fetchPurchasesReport", async (params = {}, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/reports/purchases`, { params });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Purchase Reports was found!");
      }

      console.log("Purchase Reports Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch purchase reports: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchExpenseReport = createAsyncThunk(
  "reports/fetchExpenseReport", async (params = {}, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/reports/expenses`, { params });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Expense Reports was found!");
      }

      console.log("Expense Reports Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch expense reports: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchProfitLossReport = createAsyncThunk(
  "reports/fetchProfitLossReport", async (params = {}, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/reports/profit-loss`, { params });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Profit-Loss Reports was found!");
      }

      console.log("Profit-Loss Reports Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch profit-less reports: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    resetReportStatus: (state) => {
      state.error = null;
      state.status = "idle";
      state.statusDetail = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReport.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
      .addCase(fetchPurchasesReport.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchPurchasesReport.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.purchasesReport = action.payload;
      })
      .addCase(fetchPurchasesReport.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
      .addCase(fetchExpenseReport.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchExpenseReport.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.expenseReport = action.payload;
      })
      .addCase(fetchExpenseReport.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
      .addCase(fetchProfitLossReport.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchProfitLossReport.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.profitLossReport = action.payload;
      })
      .addCase(fetchProfitLossReport.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
  }
})

export default reportSlice.reducer;
export const { resetReportStatus } = reportSlice.actions;
export const selectSalesReports = (state) => state.reports.salesReport;
export const selectPurchasesReports = (state) => state.reports.purchasesReport;
export const selectExpensesReports = (state) => state.reports.expenseReport;
export const selectProfitLossReports = (state) => state.reports.profitLossReport;
export const selectReportStatus = (state) => state.reports.status;
export const selectReportError = (state) => state.reports.error;