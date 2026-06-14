import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    signedUpUsers: [],
    inventoryItems: [],
    stockEntries: [],
    stockHistory: [],
  },
  reducers: {
    setInventory: (state, action) => {
      state.inventoryItems = action.payload;
    },
    setStockEntries: (state, action) => {
      state.stockEntries = action.payload;
    },
    setStockHistory: (state, action) => {
      state.stockHistory = action.payload;
    },
    addInventoryItem: (state, action) => {
      state.inventoryItems.unshift(action.payload);
    },
    updateInventoryItem: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.inventoryItems.findIndex(
        (item) => item._id === id || item.id === id
      );
      if (index !== -1) {
        state.inventoryItems[index] = {
          ...state.inventoryItems[index],
          ...updatedData,
        };
      }
    },
    deleteInventoryItem: (state, action) => {
      const id = action.payload;
      state.inventoryItems = state.inventoryItems.filter(
        (item) => item._id !== id && item.id !== id
      );
    },
    // Clears user-scoped data on logout. `signedUpUsers` is intentionally
    // untouched (it's admin-managed, not session-scoped).
    clearUsersData: (state) => {
      state.inventoryItems = [];
      state.stockEntries = [];
      state.stockHistory = [];
    },
  },
});

export const {
  setInventory,
  setStockEntries,
  setStockHistory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  clearUsersData,
} = usersSlice.actions;

export default usersSlice.reducer;
