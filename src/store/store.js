import { configureStore } from "@reduxjs/toolkit";

import tagsReducer from "../reducers/tagsSlice";
import imagesetsReducer from "../reducers/imagesetSlice";
import modelsReducer from "../reducers/modelsSlice";

export default configureStore({
  reducer: {
    tags: tagsReducer,
    imagesets: imagesetsReducer,
    models: modelsReducer,
  },
});
