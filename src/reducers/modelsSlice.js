import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../utils/api";

export const fetchmodels = createAsyncThunk("models/fetchmodel", async () => {
  return api.get("/api/models").then((response) => response.data);
});

export const createmodel = createAsyncThunk(
  "models/createmodel",
  async (postdata) => {
    return api
      .post("/api/train/" + postdata.image_set_id, postdata)
      .then((response) => {
        return response.data;
      });
  }
);

export const deletemodel = createAsyncThunk(
  "models/deletemodel",
  async (id) => {
    return api.delete("/api/model/" + id).then((response) => {
      return response.data;
    });
  }
);

export const modelsSlice = createSlice({
  name: "models",
  initialState: {
    loading: false,
    data: [],
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchmodels.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchmodels.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchmodels.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
    builder.addCase(createmodel.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createmodel.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(createmodel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deletemodel.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deletemodel.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(deletemodel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

// Action creators are generated for each case reducer function
// export const { } = tagsSlice.actions

export default modelsSlice.reducer;
