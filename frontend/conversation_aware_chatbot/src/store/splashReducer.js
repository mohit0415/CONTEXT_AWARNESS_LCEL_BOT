const initialState = {
  isSplash:true
};

export const splashReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case "ISSPLASHSTOP":
        return {
            ...state,
            isSplash : false
        }
    default:
      return state;
  }
};