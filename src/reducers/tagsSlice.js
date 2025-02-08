import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../utils/api";

export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
  return api.get("/api/folders").then((response) => response.data);
});

export const createTag = createAsyncThunk(
  "tags/createTag",
  async (postdata) => {
    return api.post("/api/folders", postdata).then((response) => response.data);
  }
);

export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async (updatedata) => {
    return api
      .put("/api/folders/" + updatedata.id, updatedata)
      .then((response) => response.data);
  }
);
export const deleteTag = createAsyncThunk("tags/deleteTag", async (id) => {
  return api.delete("/api/folders/" + id).then((response) => response.data);
});

export const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    loading: false,
    data: [{ name: "initial", id: 0, description: "initial", color: "red" }],
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(createTag.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createTag.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(createTag.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateTag.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateTag.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(updateTag.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteTag.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteTag.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(deleteTag.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

// Action creators are generated for each case reducer function
// export const { } = tagsSlice.actions

export default tagsSlice.reducer;
