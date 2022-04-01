import RekeningService from "../../services/rekening";

export const rekeningActionTypes = {
  GET: "GET_REKENING",
  ADD: "ADD_REKENING",
  UPDATE: "UPDATE_REKENING",
  DELETE: "DELETE_REKENING",
  ERROR: "ERROR_REKENING",
  RESET: "RESET_REKENING",
};

export const getAllRekening = () => async (dispatch: any) => {
  const res = await RekeningService.getAll();

  return dispatch({ type: rekeningActionTypes.GET, payload: res });
};

export const addRekening = (formData: FormData) => async (dispatch: any) => {
  try {
    const res = await RekeningService.post(formData);

    return dispatch({ type: rekeningActionTypes.ADD, payload: res });
  } catch (error) {
    return dispatch({ type: rekeningActionTypes.ERROR, payload: error });
  }
};

export const editRekening =
  (formData: FormData, id: string) => async (dispatch: any) => {
    try {
      const res = await RekeningService.put(formData, id);

      return dispatch({ type: rekeningActionTypes.UPDATE, payload: res });
    } catch (error) {
      return dispatch({ type: rekeningActionTypes.ERROR, payload: error });
    }
  };

export const deleteRekening = (id: string) => async (dispatch: any) => {
  try {
    const res = await RekeningService.delete(id);

    return dispatch({ type: rekeningActionTypes.DELETE, payload: res });
  } catch (error) {
    return dispatch({ type: rekeningActionTypes.ERROR, payload: error });
  }
};

export const resetRekening = () => (dispatch: any) => {
  return dispatch({ type: rekeningActionTypes.RESET });
};
