export const initialState = {
  user: null,
  roomChatId: null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_ROOMCHATID: "SET_ROOMCHATID",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_ROOMCHATID:
      return {
        ...state,
        roomChatId: action.roomChatId,
      };
    default:
      return state;
  }
};

export default reducer;
