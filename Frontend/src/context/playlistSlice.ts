import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
  url: string;
  height: number;
  width: number;
}

interface PlaylistState {
  spotifyId: string;
  images: ImageState[];
  author: string;
  name: string;
  public: string;
}

const initialState: PlaylistState = {
  spotifyId: "",
  images: [],
  author: "",
  name: "",
  public: "",
};

const playlistSlice = createSlice({
  name: "playlist_slice",
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<PlaylistState>) => {
      return { ...action.payload };
    },
    deletePlaylist: (state) => {
      return { ...initialState };
    },
  },
});

export const { setPlaylist, deletePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
