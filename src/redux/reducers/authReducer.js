import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    auth: {
      _id: "",
      fullname: "",
      email: "",
      avatar: "",
    },
  },
  reducers: {
    addUser: (state, action) => {
      state.auth = action.payload;
    },
    removeUser: (state, action) => {
      state.auth = action.payload;
    },
    editUser: (state, actions) => {
      state.auth = actions.payload;
    },
  },
});

export const { addUser, removeUser, editUser } = authSlice.actions;

export default authSlice.reducer;
