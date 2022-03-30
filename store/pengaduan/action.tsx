import PengaduanService from "../../services/pengaduan";

export const pengaduanActionTypes = {
  GET: "GET_PENGADUAN",
};

export const getAllPengaduan = () => async (dispatch: any) => {
  const res = await PengaduanService.getAll();

  return dispatch({ type: pengaduanActionTypes.GET, payload: res });
};
