const isHitNum = import.meta.env.VITE_RATE_HIT_COUNTER_HOUR
const initialState = {
  isCheck: false,
  isDashBoardToggle: false,
  isSessionTrigger: false,
  isSplitSscreen: true,
  isHits : 4,
  isPopupModal : true,
  isChatHistoryLoad : false
};

export const booleanReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLES":
      return {
        ...state,
        isCheck: !state.isCheck,
      };
    case "OPENDASH":
      return {
        ...state,
        isDashBoardToggle: true,
      };
    case "CLOSEDASH":
      return {
        ...state,
        isDashBoardToggle: false,
      };
    case "TRIGGER":
      return {
        ...state,
        isSessionTrigger: !state.isSessionTrigger,
      };
    case "CHAT":
      return {
        ...state,
        isSplitSscreen: true,
      };
    case "HISTORY":
      return {
        ...state,
        isSplitSscreen: false,
      };
    case "ISHIT":
        return {
        ...state,
        isHits: action.payload,
      };
    case "ISDEBUG":
        return {
        ...state,
        isPopupModal: !state.isPopupModal,
      };
      case "ISHISTORYLOAD":
        return {
          ...state,
          isChatHistoryLoad : action.payload
        }


    default:
      return state;
  }
};
