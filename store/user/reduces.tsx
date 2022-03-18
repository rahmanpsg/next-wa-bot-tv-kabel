import { userActionTypes } from "./action";
import { UserState } from "../../types";

const userInitialStat: UserState = {
  users: [],
};

export default function reducer(state = userInitialStat, action: any) {
  switch (action.type) {
    case userActionTypes.UPDATE:
      return { ...action.payload };
    default:
      return state;
  }
}
