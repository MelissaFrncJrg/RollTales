import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "https://rolltales-api.onrender.com/profile",
      {
        withCredentials: true,
      }
    );
    if (response.data) {
      dispatch(
        setUser({
          userId: response.data.userId,
          userEmail: response.data.userEmail,
          isAdmin: response.data.isAdmin,
        })
      );
    }
  } catch (error) {
    dispatch(clearUser());
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    userEmail: null,
    isAdmin: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
      state.isAdmin = action.payload.isAdmin;
    },
    clearUser: (state) => {
      state.userId = null;
      state.userEmail = null;
      state.isAdmin = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
