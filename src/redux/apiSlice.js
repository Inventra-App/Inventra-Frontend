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
  },
});

export const { setAccessToken, setRefreshToken, setUser, setRegistrationEmail } = apiSlice.actions;
export default apiSlice.reducer;