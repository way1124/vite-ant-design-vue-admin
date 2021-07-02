import { IState, IUserState } from "./state";

import { removePersistStorage } from './persist_storage';

export interface IAction {
  [key: string]: (state: any) => void;
}

function updateToken(state: IState) {
  return (token: string) => state.token = token;
}

function updateUser(state: IState) {
  return (user: IUserState) => state.user = user;
}

function Logout(state: IState) {
  return () => removePersistStorage();
}

function updateLayoutNavTheme(state: IState) {
  return (theme: string) => state.layout.navTheme = theme;
}

function updateLayoutLayout(state: IState) {
  return (layout: string) => state.layout.layout = layout;
}

function updateLayoutFixedHeader(state: IState) {
  return (fixedHeader: boolean) => state.layout.fixedHeader = fixedHeader;
}
function updateLayoutFixSiderbar(state: IState) {
  return (fixSiderbar: boolean) => state.layout.fixSiderbar = fixSiderbar;
}
function updateLayoutPrimaryColor(state: IState) {
  return (color: string) => state.layout.primaryColor = color;
}
function updateLayoutContentWidth(state: IState) {
  return (width: string) => state.layout.contentWidth = width;
}
function updateLayoutMenuLocale(state: IState) {
  return (locale: boolean) => state.layout.menu.locale = locale;
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
    updateLayoutNavTheme: updateLayoutNavTheme(state),
    updateLayoutLayout: updateLayoutLayout(state),
    updateLayoutFixedHeader: updateLayoutFixedHeader(state),
    updateLayoutFixSiderbar: updateLayoutFixSiderbar(state),
    updateLayoutPrimaryColor: updateLayoutPrimaryColor(state),
    updateLayoutContentWidth: updateLayoutContentWidth(state),
    updateLayoutMenuLocale: updateLayoutMenuLocale(state),
  };
}
