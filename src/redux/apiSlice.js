import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
  name: "apiSlice",
  initialState: {
    accessToken: null,
    refreshToken: null,
    user: null,
    registrationEmail: "",
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRegistrationEmail: (state, action) => {
      state.registrationEmail = action.payload;
    },
    // Wipes auth-related state when the user logs out.
    // We keep `registrationEmail` so any in-progress sign-up flow isn't disturbed.
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const {
  setAccessToken,
  setRefreshToken,
  setUser,
  setRegistrationEmail,
  clearAuth,
} = apiSlice.actions;
export default apiSlice.reducer;
