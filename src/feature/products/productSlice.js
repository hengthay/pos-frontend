import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  productsData: [] || null,
  status: "idle",
  error: null,
  // Product detail
  productDetailData: null,
  statusDetail: "idle"
}

// Fetch product
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts', async (_, thunkAPI) => {
    try { 
      const res = await axiosInstace.get(`${API_BASE_URL}/products`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No products was founds!");
      }

      console.log("Product Response - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch products: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

// Fetch product detail
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstace.get(`${API_BASE_URL}/products/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("No product was found!");
      }

      console.log("Product Response: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to fetch product by id: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

// Post new product
export const createProduct = createAsyncThunk(
  'products/createProduct', async ({ formData }, thunkAPI) => {
    try {
      
      const res = await axiosInstace.post(`${API_BASE_URL}/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to create product!");
      }

      console.log("Product Created Response - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to create product: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

// Update product
export const updateProduct = createAsyncThunk(
  'products/updateProduct', async ({ id, formData }, thunkAPI) => {
    try {
      
      const res = await axiosInstace.put(`${API_BASE_URL}/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Unable to update product!");
      }

      console.log("Product Updated Response - ", res?.data?.data);

      return res?.data?.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to update product: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstace.delete(`${API_BASE_URL}/products/${id}`);

      if(res?.data?.data) return id;

      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Unable to delete product!");
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to delete product: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductStatus: (state) => {
      state.status = "idle";
      state.statusDetail = "idle";
    }
  }, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        state.productsData = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.error = null,
        state.statusDetail = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.error = null,
        state.statusDetail = "succeeded";
        state.productDetailData = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.statusDetail = "failed";
      })
      .addCase(createProduct.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        state.productsData = [...state.productsData, action.payload];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(updateProduct.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const updated = action.payload;

        state.productsData = state.productsData.map((product) => product.id === updated.id ? updated : product);

        state.productDetailData = updated;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.error = null,
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.error = null,
        state.status = "succeeded";
        const deletedId = action.payload;

        state.productsData = state.productsData.filter((product) => product.id !== deletedId);

        if(state.productDetailData?.id === deletedId) {
          state.productDetailData = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!",
        state.status = "failed";
      })
      
  }
})

export default productSlice.reducer;
export const { resetProductStatus } = productSlice.actions;
export const selectProducts = (state) => state.products.productsData;
export const selectProductStatus = (state) => state.products.status;
export const selectProductError = (state) => state.products.error;
export const selectProductDetailData = (state) => state.products.productDetailData;
export const selectProductStatusDetail = (state) => state.products.statusDetail;