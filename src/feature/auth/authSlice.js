import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstace } from "../../components/APIConfig";

const initialState = {
  userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null,
  status: "idle",
  error: null
}

export const fetchUser = createAsyncThunk(
  'auths/fetchUser', async (_, thunkAPI) => {
    try {
      
      const res = await axiosInstace.get(`${API_BASE_URL}/users`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });

      if(!res?.data?.data) {
        return console.log("No record.");
      }

      console.log("Response data: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to get user: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const loginUser = createAsyncThunk(
  'auths/loginUser', async ({ payload }, thunkAPI) => {
    try {
      const res = await axiosInstace.post(`${API_BASE_URL}/login`, payload, {
        headers: {
          'Content-Type': "application/json",
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Failed to login!");
      }

      console.log('Response data: ', res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to login: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

// export const registerUser = createAsyncThunk(
//   'auths/registerUser', async ({ formData }, thunkAPI) => {
//     try {
      
//       const res = await axiosInstace.post(`${API_BASE_URL}/users`, formData);

//       if(!res?.data?.data) {
//         return thunkAPI.rejectWithValue("Failed to create user!");
//       }

//       console.log("Reponses data: ", res?.data?.data);

//       return res?.data?.data ?? null;
//     } catch (error) {
//       const msg = error?.response?.data?.message;
//       console.log("Error to create user: ", msg);
//       console.log("143 pv");
//       return thunkAPI.rejectWithValue(msg);
//     }
//   }
// );

export const logoutUser = createAsyncThunk(
  'auths/logoutUser', async (_, thunkAPI) => {
    try {

      const res = await axiosInstace.post(`${API_BASE_URL}/logout`);
      
      console.log("Responses data: ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log("Error to logout: ", msg);
      console.log("143 pv");
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const authSlice = createSlice({
  name: "auths",
  initialState,
  reducers: {
    forceLogout: (state) => {
      state.userData = null;
      state.error = null;
      state.status = 'idle';
      localStorage.removeItem('userData');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.userData = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.userData = action.payload;

        // Set token to localStorage
        localStorage.setItem("userData", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.userData = null;

        // Remove token from localStorage
        localStorage.removeItem("userData");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
  }
});

export default authSlice.reducer;
export const { forceLogout } = authSlice.actions;
export const selectUser = state => state.auths.userData;
export const selectUserStatus = state => state.auths.status;
export const selectUserError = state => state.auths.error;