import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI, getUser } from '../../utils/api';
import { toast } from 'react-toastify';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, price }, { rejectWithValue }) => {
    try {
      const user = getUser();
      if (!user) {
        toast.error('Please login to add items to cart');
        return rejectWithValue('User not logged in');
      }
      const response = await cartAPI.addToCart({ userId: user.id || user._id, productId, quantity, price });
      toast.success('Item added to cart');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  }
);

export const removeFromCartDB = createAsyncThunk(
  'cart/removeFromCartDB',
  async (productId, { rejectWithValue }) => {
    try {
      const user = getUser();
      if (!user) return rejectWithValue('User not logged in');
      const response = await cartAPI.deleteCartItem(user.id || user._id, productId);
      toast.success('Item removed from cart');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const updateQuantityDB = createAsyncThunk(
  'cart/updateQuantityDB',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const user = getUser();
      if (!user) return rejectWithValue('User not logged in');
      const response = await cartAPI.updateQuantity({ userId: user.id || user._id, productId, quantity });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
      })
      // Remove from Cart
      .addCase(removeFromCartDB.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(updateQuantityDB.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      });
  }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
