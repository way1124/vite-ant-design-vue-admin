import { IState } from "./state";

import { removePersistStorage } from './persist_storage';

export interface IAction {
  [key: string]: (state: any) => void;
}

function updateToken(state: IState) {
  return (token: string) => {
    state.token = token;
  };
}

function updateUser(state: IState) {
  return (user: any) => {
    state.user = user;
  };
}

function Logout(state: IState) {
  return (item: any) => {
    removePersistStorage()
  };
}

/**
 * 创建Action
 * @param state
 */
export function createAction(state: IState) {
  return {
    updateToken: updateToken(state),
    updateUser: updateUser(state),
    Logout: Logout(state),
  };
}
