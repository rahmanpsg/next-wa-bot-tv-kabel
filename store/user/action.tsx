import UserService from "../../services/user";

export const userActionTypes = {
  UPDATE: "UPDATE_USER",
};

export const getUsers = () => async (dispatch: any) => {
  const res = await UserService.get();

  return dispatch({ type: userActionTypes.UPDATE, payload: res });
};
