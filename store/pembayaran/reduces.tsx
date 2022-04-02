import { pembayaranActionTypes } from "./action";
import { PembayaranState } from "../../types";

const pembayaranInitialStat: PembayaranState = {
  pembayarans: [],
  message: null,
  error: false,
};

export default function reducer(state = pembayaranInitialStat, action: any) {
  switch (action.type) {
    case pembayaranActionTypes.GET:
      return {
        pembayarans: action.payload.pembayarans,
        message: action.payload.message,
        error: pembayaranInitialStat.error,
      };
    case pembayaranActionTypes.UPDATE:
      const pembayaranIndex = state.pembayarans.findIndex(
        (pembayaran) => pembayaran._id == action.payload.pembayaran._id
      );

      Object.assign(state.pembayarans[pembayaranIndex], {
        ...action.payload.pembayaran,
        ...state.pembayarans[pembayaranIndex],
      });

      return {
        pembayarans: state.pembayarans,
        message: action.payload.message,
        error: action.payload.error,
      };
    case pembayaranActionTypes.ERROR:
      return {
        pembayarans: state.pembayarans,
        error: action.payload.error,
        message: action.payload.message,
      };
    case pembayaranActionTypes.RESET:
      return {
        pembayarans: state.pembayarans,
        message: pembayaranInitialStat.message,
        error: false,
      };
    default:
      return state;
  }
}
