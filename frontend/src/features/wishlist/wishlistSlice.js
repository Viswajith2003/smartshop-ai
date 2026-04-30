import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistAPI } from './wishlistAPI';
import { logout as logoutAction } from '../auth/authSlice';
import { toast } from 'react-toastify';

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await wishlistAPI.getWishlist();
            return response.data; // This is the wishlist object
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggleWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await wishlistAPI.toggleWishlist(productId);
            // Show toast based on the action returned from backend
            const { action, wishlist } = response.data;
            if (action === 'added') {
                toast.success('Product added to wishlist');
            } else {
                toast.info('Product removed from wishlist');
            }
            return wishlist.items; // Return the items array
        } catch (error) {
            const message = error.response?.status === 401 
                ? 'Please login to add item to the wishlist' 
                : (error.response?.data?.message || 'Failed to update wishlist');
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlistState: (state) => {
            state.items = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.error = null;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Toggle Wishlist
            .addCase(toggleWishlist.pending, (state) => {
                // We keep it empty or use optimistic updates? 
                // Let's just wait for fulfillment to ensure sync with DB
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                state.items = action.payload; // Already items array from thunk
                state.error = null;
            })
            .addCase(toggleWishlist.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Clear on logout
            .addCase(logoutAction, (state) => {
                state.items = [];
                state.error = null;
                state.loading = false;
            });
    }
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
