import { configureStore } from "@reduxjs/toolkit";
import slices from "./slices";

const store = configureStore({
  reducer: slices,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
