import { pengaduanActionTypes } from "./action";
import { PengaduanState } from "../../types";

const pengaduanInitialStat: PengaduanState = {
  pengaduans: [],
};

export default function reducer(state = pengaduanInitialStat, action: any) {
  switch (action.type) {
    case pengaduanActionTypes.GET:
      return {
        pengaduans: action.payload.pengaduans,
      };
    default:
      return state;
  }
}
