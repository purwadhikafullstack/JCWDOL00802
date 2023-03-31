const INITIAL_STATE = {
  id_user: 0,
  email: "",
  role: 0,
};

export const userReducer = (state = INITIAL_STATE, action) => {
  console.log("data dr fungsi user", action);
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, ...action.payload };
    case "LOGOUT":
      return INITIAL_STATE;
    default:
      return state;
  }
};
