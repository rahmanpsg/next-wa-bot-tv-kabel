import WaService from "../../services/wa";

export const waActionTypes = {
  UPDATE: "UPDATE_WA",
  WAITING: "WAITING_WA",
  RUNNING: "RUNNING_WA",
};

export const getStatus = () => async (dispatch: any) => {
  const res = await WaService.get();

  return dispatch({ type: waActionTypes.UPDATE, payload: res });
};

export const runWaBot = () => async (dispatch: any) => {
  dispatch({
    type: waActionTypes.WAITING,
    payload: { loading: true, message: "Loading..." },
  });

  const res = await WaService.run();

  if (res.qr) return dispatch({ type: waActionTypes.WAITING, payload: res });
  else return dispatch({ type: waActionTypes.UPDATE, payload: res });
};

export const stopWaBot = () => async (dispatch: any) => {
  dispatch({
    type: waActionTypes.WAITING,
    payload: { loading: true, message: "Loading..." },
  });

  const res = await WaService.stop();

  return dispatch({ type: waActionTypes.UPDATE, payload: res });
};
