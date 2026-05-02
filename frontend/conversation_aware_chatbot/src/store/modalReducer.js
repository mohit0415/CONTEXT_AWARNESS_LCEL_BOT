const initialState = {
  isModal: false,
  isMsg:'',
  isLogoutModal:false
};

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ONCLOSE":
      return {
        ...state,
        isModal: false,
      };

    case "ONOPEN":
      return {
        ...state,
        isModal: true,
      };

    case "MSGIS":
        return {
            ...state,
            isMsg : action.payload
        }
     case "ONLOGOUTCLOSE":
      return {
        ...state,
        isLogoutModal: false,
      };

    case "ONLOGOUTOOPEN":
      return {
        ...state,
        isLogoutModal: true,
      };
    default:
      return state;
  }
};