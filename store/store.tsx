import {
  createStore,
  applyMiddleware,
  combineReducers,
  AnyAction,
  Store,
} from "redux";
import { Reducer } from "redux";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";

import authState from "./auth/reduces";
import waState from "./wa/reduces";
import userState from "./user/reduces";

import { State } from "types";

const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV != "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const combineReducer = combineReducers({
  authState,
  waState,
  userState,
});

const reducer: Reducer<State, AnyAction> = (state, action) => {
  if (action.type == HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    return nextState;
  } else {
    return combineReducer(state, action);
  }
};

const initStore = () => createStore(reducer, bindMiddleware([thunkMiddleware]));

export const wrapper = createWrapper<Store<State>>(initStore);
