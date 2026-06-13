import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    signedUpUsers: [], 
    inventoryItems: [],
  },
  reducers: {
    signUp: (state, action) => {
      const newUser = action.payload;
      state.signedUpUsers.push(newUser);
    },
    

    setInventory: (state, action) => {
      state.inventoryItems = action.payload;
    },
    addInventoryItem: (state, action) => {
      state.inventoryItems.push(action.payload);
    },
    updateInventoryItem: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.inventoryItems.findIndex(item => item.id === id);
      if (index !== -1) {
        state.inventoryItems[index] = { ...state.inventoryItems[index], ...updatedData };
      }
    },
    deleteInventoryItem: (state, action) => {
      const id = action.payload;
      state.inventoryItems = state.inventoryItems.filter(item => item.id !== id);
    }
  },
});

export const { signUp, setInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = usersSlice.actions;
export default usersSlice.reducer;