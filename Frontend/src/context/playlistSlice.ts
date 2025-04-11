import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ImageState {
  url: string;
  height: number;
  width: number;
}

export interface PlaylistState {
  spotifyId: string;
  images: ImageState[];
  author: string;
  name: string;
  public: boolean;
}

const initialState: PlaylistState[] = [];

const playlistSlice = createSlice({
  name: "playlist_slice",
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<PlaylistState[]>) => {
      return [...action.payload];
    },
    deletePlaylist: (state) => {
      return { ...initialState };
    },
  },
});

export const { setPlaylist, deletePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
