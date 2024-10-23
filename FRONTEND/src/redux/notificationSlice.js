import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "",
  className: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.className =
        action.payload.type === "success"
          ? "success"
          : action.payload.type === "error"
          ? "error"
          : "info";
    },
    clearNotification: (state) => {
      state.message = "";
      state.type = "";
      state.className = "";
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
