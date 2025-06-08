import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginAdmin: null
};

const userSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.loginAdmin = action.payload;
    },  
    logOutSuccess: (state) => {
      state.loginAdmin = null;
    }
  },
});
// destructuring declaration
export const {
  signInSuccess,
  logOutSuccess,
  
} = userSlice.actions;  

export default userSlice.reducer;
