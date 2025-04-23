import { configureStore } from "@reduxjs/toolkit";
import playlistSlice from "../playlistSlice";
import searchSlice from "../searchSlich";
import userSlice from "../userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    playlist: playlistSlice,
    search: searchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
