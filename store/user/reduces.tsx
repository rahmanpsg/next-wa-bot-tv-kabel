import { userActionTypes } from "./action";
import { UserState } from "../../types";

const userInitialStat: UserState = {
  users: [],
  message: null,
  error: false,
  errors: null,
};

export default function reducer(state = userInitialStat, action: any) {
  switch (action.type) {
    case userActionTypes.GET:
      return {
        users: action.payload.users,
        message: action.payload.message,
        error: action.payload.error,
        errors: userInitialStat.errors,
      };
    case userActionTypes.ADD:
      return {
        users: [action.payload.user, ...state.users],
        message: action.payload.message,
        error: action.payload.error,
        errors: userInitialStat.errors,
      };
    case userActionTypes.UPDATE:
      const userIndex = state.users.findIndex(
        (user) => user._id == action.payload.user._id
      );

      Object.assign(state.users[userIndex], action.payload.user);

      return {
        users: state.users,
        message: action.payload.message,
        error: action.payload.error,
        errors: userInitialStat.errors,
      };
    case userActionTypes.ERROR:
      const errors = new Map<string, string>();

      for (const key in action.payload.errors) {
        errors.set(key, action.payload.errors[key]);
      }

      return {
        users: state.users,
        error: action.payload.error,
        errors,
        message: action.payload.message,
      };
    case userActionTypes.RESET:
      return {
        users: state.users,
        message: userInitialStat.message,
        error: false,
        errors: new Map<string, string>(),
      };
    default:
      return state;
  }
}
