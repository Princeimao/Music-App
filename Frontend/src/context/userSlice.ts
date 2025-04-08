import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string;
  name: string;
  email: string;
  profile_picture: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userId: "",
  name: "",
  email: "",
  profile_picture: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      return { ...action.payload, isAuthenticated: true };
    },
    logout: (state) => {
      return { ...initialState };
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
