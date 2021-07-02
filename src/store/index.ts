import { provide, inject, readonly, App } from "vue";

import { createState, IState } from "./state";
import { createAction, IAction } from "./action";

import { createPersistStorage } from "./persist_storage";

export const stateSymbol = Symbol("state");

export const state = createState();
export const action = createAction(state);
// 通过type来判断数据是否持久化
export const createStore = (type: boolean = false) => {
  return { action: readonly(action), state: type ? createPersistStorage<IState>(state) : readonly(state) };
};

interface IUseState {
  action: IAction;
  state: IState;
}
export const useState = () => inject<IUseState>(stateSymbol) as IUseState;
export const provideState = () => provide(stateSymbol, createStore(false));

export default {
  version: '0.0.1',
  install(app: App) {
    app.provide(stateSymbol, createStore(true))
  }
}
