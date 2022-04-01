import { rekeningActionTypes } from "./action";
import { RekeningState } from "../../types";

const rekeningInitialStat: RekeningState = {
  rekenings: [],
  message: null,
  error: false,
  errors: null,
};

export default function reducer(state = rekeningInitialStat, action: any) {
  switch (action.type) {
    case rekeningActionTypes.GET:
      return {
        rekenings: action.payload.rekenings,
        message: action.payload.message,
        error: rekeningInitialStat.error,
        errors: rekeningInitialStat.errors,
      };
    case rekeningActionTypes.ADD:
      return {
        rekenings: [...state.rekenings, action.payload.rekening],
        message: action.payload.message,
        error: action.payload.error,
        errors: rekeningInitialStat.errors,
      };
    case rekeningActionTypes.UPDATE:
      const rekeningIndex = state.rekenings.findIndex(
        (rekening) => rekening._id == action.payload.rekening._id
      );

      Object.assign(state.rekenings[rekeningIndex], action.payload.rekening);

      return {
        rekenings: state.rekenings,
        message: action.payload.message,
        error: action.payload.error,
        errors: rekeningInitialStat.errors,
      };
    case rekeningActionTypes.DELETE: {
      const rekeningIndex = state.rekenings.findIndex(
        (rekening) => rekening._id == action.payload.id
      );

      if (rekeningIndex != -1) state.rekenings.splice(rekeningIndex, 1);

      return {
        rekenings: state.rekenings,
        message: action.payload.message,
        error: action.payload.error,
        errors: rekeningInitialStat.errors,
      };
    }
    case rekeningActionTypes.ERROR:
      const errors = new Map<string, string>();

      for (const key in action.payload.errors) {
        errors.set(key, action.payload.errors[key]);
      }

      return {
        rekenings: state.rekenings,
        error: action.payload.error,
        message: action.payload.message,
        errors: errors,
      };
    case rekeningActionTypes.RESET:
      return {
        rekenings: state.rekenings,
        message: rekeningInitialStat.message,
        error: false,
        errors: new Map<string, string>(),
      };
    default:
      return state;
  }
}
