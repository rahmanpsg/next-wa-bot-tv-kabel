import PembayaranService from "../../services/pembayaran";

export const pembayaranActionTypes = {
  GET: "GET_PEMBAYARAN",
  UPDATE: "UPDATE_PEMBAYARAN",
  ERROR: "ERROR_PEMBAYARAN",
  RESET: "RESET_PEMBAYARAN",
};

export const getAllPembayaran = () => async (dispatch: any) => {
  const res = await PembayaranService.getAll();

  return dispatch({ type: pembayaranActionTypes.GET, payload: res });
};

export const terimaPembayaran = (id: string) => async (dispatch: any) => {
  try {
    const res = await PembayaranService.put(id, true);

    return dispatch({ type: pembayaranActionTypes.UPDATE, payload: res });
  } catch (error) {
    return dispatch({ type: pembayaranActionTypes.ERROR, payload: error });
  }
};

export const tolakPembayaran = (id: string) => async (dispatch: any) => {
  try {
    const res = await PembayaranService.put(id, false);

    return dispatch({ type: pembayaranActionTypes.UPDATE, payload: res });
  } catch (error) {
    return dispatch({ type: pembayaranActionTypes.ERROR, payload: error });
  }
};

export const resetPembayaran = () => (dispatch: any) => {
  return dispatch({ type: pembayaranActionTypes.RESET });
};
