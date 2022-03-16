import AuthService from "../../services/auth";

export const authActionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

export const loginAuth =
  (username: string, password: string) => async (dispatch: any) => {
    const res = await AuthService.login(username, password);

    return dispatch({ type: authActionTypes.LOGIN, payload: res });
  };

export const logoutAuth = () => async (dispatch: any) => {
  const res = await AuthService.logout();

  dispatch({ type: authActionTypes.LOGOUT, payload: res });
};
