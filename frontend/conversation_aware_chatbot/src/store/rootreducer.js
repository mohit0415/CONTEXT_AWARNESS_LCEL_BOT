import { combineReducers } from "redux";
import { loaderReducer } from "./loaderReducer";
import { modalReducer } from "./modalReducer";
import { splashReducer } from "./splashReducer";
import { sessionReducer } from "./sessionReducer";
import { booleanReducer } from "./booleanReducer";

export const rootReducer = combineReducers({
  isLoad: loaderReducer,
  isModal:modalReducer,
  isSplash : splashReducer,
  isSession : sessionReducer,
  isBoolean : booleanReducer
});