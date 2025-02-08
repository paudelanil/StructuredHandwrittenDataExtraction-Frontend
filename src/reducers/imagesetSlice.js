import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../utils/api";

export const fetchImagesets = createAsyncThunk(
  "imagesets/fetchImageset",
  async () => {
    return api.get("/api/imagesets").then((response) => response.data);
  }
);

export const createImageset = createAsyncThunk(
  "imagesets/createImageset",
  async (postdata) => {
    return api.post("/api/imagesets", postdata).then((response) => {
      return response.data;
    });
  }
);

export const deleteImageset = createAsyncThunk(
  "imagesets/deleteImageset",
  async (id) => {
    return api.delete("/api/imageset/" + id).then((response) => {
      return response.data;
    });
  }
);

export const imagesetSlice = createSlice({
  name: "imagesets",
  initialState: {
    loading: false,
    data: [],
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchImagesets.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchImagesets.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchImagesets.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(createImageset.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createImageset.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(createImageset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    // builder.addCase(updateImageset.pending, (state, action) => {
    //     state.loading = true;
    // })
    // builder.addCase(updateImageset.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.error = "";
    // })
    // builder.addCase(updateImageset.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    // })
    builder.addCase(deleteImageset.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteImageset.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(deleteImageset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

// Action creators are generated for each case reducer function
// export const { } = tagsSlice.actions

export default imagesetSlice.reducer;
