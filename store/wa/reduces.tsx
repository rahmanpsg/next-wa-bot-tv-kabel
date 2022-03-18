import { waActionTypes } from "./action";
import { WaState } from "../../types";

const waInitialStat: WaState = {
  run: false,
  message: "Whatsapp Bot Belum Berjalan",
  loading: true,
  qr: null,
};

export default function reducer(state = waInitialStat, action: any) {
  switch (action.type) {
    case waActionTypes.UPDATE:
      return { loading: false, ...action.payload };
    case waActionTypes.WAITING:
      return { loading: true, ...action.payload };
    case waActionTypes.RUNNING:
      return { loading: false, run: true, message: "Whatsap Bot Berjalan" };
    default:
      return state;
  }
}
