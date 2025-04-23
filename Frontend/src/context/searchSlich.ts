import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchTerm: string;
}

const initialState: SearchState = {
  searchTerm: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<SearchState>) => {
      state.searchTerm = action.payload.searchTerm;
    },
    clearSearchTerm: (state) => {
      state.searchTerm = "";
    },
  },
});

export const { setSearchTerm, clearSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;
