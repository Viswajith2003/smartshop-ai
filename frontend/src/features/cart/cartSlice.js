import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from './cartAPI';
import { couponAPI } from '../../services/api';
import { getUser } from '../../services/axiosInstance';
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
      const response = await cartAPI.deleteCartItem(productId);
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

export const toggleSelectionDB = createAsyncThunk(
  'cart/toggleSelectionDB',
  async (productId, { rejectWithValue }) => {
    try {
      const user = getUser();
      if (!user) return rejectWithValue('User not logged in');
      const response = await cartAPI.toggleSelection({ userId: user.id || user._id, productId });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle selection');
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle selection');
    }
  }
);

export const applyCouponDB = createAsyncThunk(
    'cart/applyCoupon',
    async ({ code, totalPrice }, { rejectWithValue }) => {
        try {
            const response = await couponAPI.applyCoupon({ code, totalPrice });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Invalid or expired coupon';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  loading: false,
  error: null,
  appliedCoupon: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
      state.appliedCoupon = null;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
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
      })
      .addCase(toggleSelectionDB.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      // Apply Coupon
      .addCase(applyCouponDB.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyCouponDB.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload;
        toast.success('Coupon applied successfully!');
      })
      .addCase(applyCouponDB.rejected, (state) => {
        state.loading = false;
        state.appliedCoupon = null;
      });
  }
});

export const { clearCart, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;
