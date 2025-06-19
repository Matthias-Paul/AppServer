import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loginAdmin: null,
  churchProfile: null
}

const userSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.loginAdmin = action.payload
    },
    logOutSuccess: (state) => {
      state.loginAdmin = null
    },
    UpdateChurchProfile: (state, action) => {
      state.churchProfile = action.payload
    }
  }
})
// destructuring declaration
export const { signInSuccess, logOutSuccess, UpdateChurchProfile } = userSlice.actions

export default userSlice.reducer
