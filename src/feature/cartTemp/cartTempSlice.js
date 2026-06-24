import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  status: "idle",
  error: null
}

const cartTempSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      // Get data from store
      const { product_id, quantity = 1, unit_price, product_name, image_url } = action.payload;
      // Find if item exist
      const exisitingIndex = state.items.findIndex(item => item.product_id === product_id);
      // If exist increase quantity, otherwise add to items
      if(exisitingIndex >= 0) {
        state.items[exisitingIndex].quantity += quantity;
      }else {
        state.items.push({
          product_id,
          product_name,
          quantity,
          unit_price,
          image_url
        });
      }
      // Recalculate price
      cartTempSlice.caseReducers.calculateTotals(state);
    },
    removeItemFromCart: (state, action) => {
      const { product_id } = action.payload;
      
      state.items = state.items.filter((product) => product.product_id !== product_id); // Filtered out item

      cartTempSlice.caseReducers.calculateTotals(state);
    },
    increaseQuantityOnCart: (state, action) => {
      const { product_id } = action.payload;
      const item = state.items.find(item => item.product_id === product_id); // find 
      
      // update cart
      if(item) {
        item.quantity += 1;
        cartTempSlice.caseReducers.calculateTotals(state);
      }
    },
    decreaseQuantityOnCart: (state, action) => {
      const { product_id } = action.payload;
      const item = state.items.find(item => item.product_id === product_id);

      if(item) {
        item.quantity = Math.max(1, item.quantity - 1);;
        cartTempSlice.caseReducers.calculateTotals(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      cartTempSlice.caseReducers.calculateTotals(state);
    },
    calculateTotals: (state) => {
      const taxRate = 0;  
      const discountRate = 0;  
      
      state.subtotal = state.items.reduce(
        (sum, item) => sum + (item.quantity * item.unit_price),
        0
      );
      state.tax = state.subtotal * taxRate;
      state.discount = state.subtotal * discountRate;
      state.total = state.subtotal + state.tax - state.discount;
    },
    resetCartItemStatus: (state) => {
      state.status = "idle";
    }
  }
});

export default cartTempSlice.reducer;
export const { addItemToCart, removeItemFromCart, increaseQuantityOnCart, decreaseQuantityOnCart, clearCart, resetCartItemStatus } = cartTempSlice.actions;
export const selectCartItems = (state) => state.carts.items;
export const selectCartStatus = (state) => state.carts.status;
export const selectCartSubtotal = (state) => state.carts.subtotal;
export const selectCartTax = (state) => state.carts.tax;
export const selectCartDiscount = (state) => state.carts.discount;
export const selectCartTotal = (state) => state.carts.total;
export const selectCartError = (state) => state.carts.error;