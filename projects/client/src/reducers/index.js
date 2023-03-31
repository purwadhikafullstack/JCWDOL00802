import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import reduxThunk from "redux-thunk";

export const globalStore = configureStore(
  {
    reducer: {
      userReducer,
    },
  },
  applyMiddleware(reduxThunk)
);
