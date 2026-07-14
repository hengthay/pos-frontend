import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  suppliersData: [],
  status: "idle",
  error: null,
  supplierDetailData: null,
  statusDetail: "idle"
}

export const fetchSuppliers= createAsyncThunk(
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

export const fetchSupplierByPagination = createAsyncThunk(
  "suppliers/fetchSupplierByPagination", async (params = {}, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/suppliers`, { params });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Supplier was found!");
      }

      console.log("Supplier Response: ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch supplier: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchSupplierById = createAsyncThunk(
  "suppliers/fetchSupplierById", async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/suppliers/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Supplier was founds!");
      }

      console.log("Supplier Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch supplier: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createSupplier = createAsyncThunk(
  "suppliers/createSupplier", async (formData, thunkAPI) => {
    try {
      const res = await axiosInstace.post(`${API_BASE_URL}/suppliers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to create supplier!");
      }

      console.log("Supplier Created Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to create supplier: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateSupplier = createAsyncThunk(
  "suppliers/updateSupplier", async ({ id , formData }, thunkAPI) => {
    try {
      const res = await axiosInstace.put(`${API_BASE_URL}/suppliers/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to update supplier!");
      }

      console.log("Supplier Updated Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to update supplier: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const deleteSupplier = createAsyncThunk(
  "suppliers/deleteSupplier", async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.delete(`${API_BASE_URL}/suppliers/${id}`);

      if(res?.data?.data) return id;
      
      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Unable to delete supplier!");
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to delete supplier: ", msg);
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
      .addCase(fetchSupplierByPagination.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(fetchSupplierByPagination.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        state.suppliersData = action.payload;
      })
      .addCase(fetchSupplierByPagination.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(fetchSupplierById.pending, (state) => {
        state.error = null,
        state.statusDetail = "loading";
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.error = null,
        state.statusDetail = "succeeded";
        state.supplierDetailData = action.payload;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.statusDetail = "failed";
      })
      .addCase(createSupplier.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        if(Array.isArray(state.suppliersData)) {
          state.suppliersData.push(action.payload);
        }
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(updateSupplier.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const updated = action.payload;

        if(Array.isArray(state.suppliersData)) {
          state.suppliersData = state.suppliersData.map((sup) => sup.id === updated.id ? updated : sup);
        }

        state.supplierDetailData = updated;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(deleteSupplier.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const deletedId = action.payload;

        if(Array.isArray(state.suppliersData)) {
          state.suppliersData = state.suppliersData.filter((sup) => sup.id !== deletedId);
        }

        if(state.supplierDetailData?.id === deletedId.id) {
          state.supplierDetailData = null;
        }
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
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