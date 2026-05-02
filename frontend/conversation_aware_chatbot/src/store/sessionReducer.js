import { isSession } from "react-router-dom";

const initialState = {
  isSession: "103f1059-690a-4d38-85c8-aace59262293",
};

export const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        isSession: action.payload,
      };

    default:
      return state;
  }
};