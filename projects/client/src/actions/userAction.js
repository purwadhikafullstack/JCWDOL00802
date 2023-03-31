export const loginAction = (data) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: data,
  };
};

export const logoutAction = () => {
  localStorage.removeItem("cnc_login");
  return {
    type: "LOGOUT",
  };
};
