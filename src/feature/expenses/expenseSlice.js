import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  expensesData: [],
  status: "idle",
  error: null,
  expenseDetailData: null,
  statusDetail: "idle"
}

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses", async (params = {}, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/expenses`, { params });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No expenses was founds!");
      }

      console.log("Expenses Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch expenses: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchExpenseById = createAsyncThunk(
  "expenses/fetchExpenseById", async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/expenses/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Expense was founds!");
      }

      console.log("Expense Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch expense: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createExpense = createAsyncThunk(
  "expenses/createExpense", async (formData, thunkAPI) => {
    try {
      console.log('Redux data: ', formData)
      const res = await axiosInstace.post(`${API_BASE_URL}/expenses`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to create expense!");
      }

      console.log("Expense Created Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to create expense: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense", async ({ id , formData }, thunkAPI) => {
    try {
      const res = await axiosInstace.put(`${API_BASE_URL}/expenses/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to update expenses!");
      }

      console.log("Expense Updated Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to update expense: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense", async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.delete(`${API_BASE_URL}/expenses/${id}`);

      if(res?.data?.data) return id;
      
      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Unable to delete expense!");
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to delete expense: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    resetExpenseStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.statusDetail = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        state.expensesData = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(fetchExpenseById.pending, (state) => {
        state.error = null,
        state.statusDetail = "loading";
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.error = null,
        state.statusDetail = "succeeded";
        state.expenseDetailData = action.payload;
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.statusDetail = "failed";
      })
      .addCase(createExpense.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        if(Array.isArray(state.expensesData)) {
          state.expensesData.push(action.payload);
        }
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(updateExpense.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const updated = action.payload;

        if(Array.isArray(state.expensesData)) {
          state.expensesData = state.expensesData.map((exp) => exp.id === updated.id ? updated : exp);
        }

        state.expenseDetailData = updated;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(deleteExpense.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const deletedId = action.payload;

        if(Array.isArray(state.expensesData)) {
          state.expensesData = state.expensesData.filter((exp) => exp.id !== deletedId);
        }

        if(state.expenseDetailData?.id === deletedId.id) {
          state.expenseDetailData = null;
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
  }
})

export default expenseSlice.reducer;
export const { resetExpenseStatus } = expenseSlice.actions;
export const selectExpensesData = (state) => state.expenses.expensesData;
export const selectExpenseStatus = (state) => state.expenses.status;
export const selectExpenseError = (state) => state.expenses.error;
export const selectExpenseDetailData = (state) => state.expenses.expenseDetailData;
export const selectExpenseStatusDetail = (state) => state.expenses.statusDetail;