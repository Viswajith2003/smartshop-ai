import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const { setOrders } = orderSlice.actions;
export default orderSlice.reducer;
