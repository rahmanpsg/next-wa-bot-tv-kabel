import { AuthState } from "types";
import { authActionTypes } from "./action";

const authInitialState: AuthState = {
  authenticated: false,
};

export default function reducer(state = authInitialState, action: any) {
  switch (action.type) {
    case authActionTypes.LOGIN:
      return { authenticated: !action.payload.error, ...action.payload };
    case authActionTypes.LOGOUT:
      return {
        authenticated: false,
      };
    default:
      return state;
  }
}
