import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  categoriesData: [],
  status: "idle",
  error: null,
  categoryDetailData: null,
  statusDetail: "idle"
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories', async (_, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/categories`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Categories was found!");
      }

      console.log("Category Response - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch categories: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById', async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.get(`${API_BASE_URL}/categories/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No Category was found!");
      }

      console.log("Category Response - ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch category by id: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/createCategory', async (formData, thunkAPI) => {
    try {
      const res = await axiosInstace.post(`${API_BASE_URL}/categories`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to create category!");
      }

      console.log("Category Created Response - ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to create category: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory', async ({ id, formData }, thunkAPI) => {
    try {
      const res = await axiosInstace.put(`${API_BASE_URL}/categories/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to update category!");
      }

      console.log("Category Updated Response - ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to update category: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory', async (id, thunkAPI) => {
    try {
      const res = await axiosInstace.delete(`${API_BASE_URL}/categories/${id}`);

      if(res?.data?.data) return id;

      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Unable to delete category!")
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to delete category: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategoryStatus: (state) => {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.categoriesData = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.statusDetail = "loading";
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.statusDetail = "succeeded";
        state.error = null;
        state.categoryDetailData = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.statusDetail = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.categoriesData = [...state.categoriesData, action.payload];
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const updated = action.payload;

        state.categoriesData = state.categoriesData.map((cate) => cate.id === updated.id ? updated : cate);
        state.categoryDetailData = updated;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const deletedId = action.payload;

        state.categoriesData = state.categoriesData.filter((cate) => cate.id !== deletedId);
        
        if(state?.categoryDetailData?.id === deletedId) {
          state.categoryDetailData = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong!";
      })
  }
});

export default categorySlice.reducer;
export const { resetCategoryStatus } = categorySlice.actions;
export const selectCategories = (state) => state.categories.categoriesData;
export const selectCategoryStatus = (state) => state.categories.status;
export const selectCategoryError = (state) => state.categories.error;
export const selectCategoryDetailData = (state) => state.categories.categoryDetailData;
export const selectCategoryStatusDetail = (state) => state.categories.statusDetail;