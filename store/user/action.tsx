import UserService from "../../services/user";

export const userActionTypes = {
  GET: "GET_USER",
  ADD: "ADD_USER",
  UPDATE: "UPDATE_USER",
  DELETE: "DELETE_USER",
  ERROR: "ERROR_USER",
  RESET: "RESET_USER",
};

export const getUsers = () => async (dispatch: any) => {
  const res = await UserService.get();

  return dispatch({ type: userActionTypes.GET, payload: res });
};

export const addUser = (formData: FormData) => async (dispatch: any) => {
  try {
    const res = await UserService.post(formData);
    return dispatch({ type: userActionTypes.ADD, payload: res });
  } catch (error: any) {
    return dispatch({ type: userActionTypes.ERROR, payload: error });
  }
};

export const editUser =
  (formData: FormData, id: string) => async (dispatch: any) => {
    try {
      const res = await UserService.put(formData, id);
      return dispatch({ type: userActionTypes.UPDATE, payload: res });
    } catch (error: any) {
      return dispatch({ type: userActionTypes.ERROR, payload: error });
    }
  };

export const deleteUser = (id: string) => async (dispatch: any) => {
  try {
    const res = await UserService.delete(id);
    return dispatch({ type: userActionTypes.DELETE, payload: res });
  } catch (error: any) {
    return dispatch({ type: userActionTypes.ERROR, payload: error });
  }
};

export const resetUser = () => (dispatch: any) => {
  return dispatch({ type: userActionTypes.RESET });
};
