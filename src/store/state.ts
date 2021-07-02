import { reactive } from "vue";

import settings, { DefaultSettings } from '@/config/settings';

export type ILayoutState = Pick<DefaultSettings, 'navTheme' | 'primaryColor' | 'layout' | 'fixSiderbar' | 'fixedHeader' | 'contentWidth' | 'menu'>

export type IUserState = {
  currentAuthority: string;
  status: string;
  type: string;
}

export type IState = {
  token: string;
  user: IUserState;
  layout: ILayoutState;
}


export const State: IState = {
  token: "",
  
  user: {
    currentAuthority: "",
    status: "",
    type: "",
  },

  layout: {
    navTheme: settings.navTheme,
    primaryColor: settings.primaryColor,
    layout: settings.layout,
    fixSiderbar: settings.fixSiderbar,
    fixedHeader: settings.fixedHeader,
    contentWidth: settings.contentWidth,
    menu: settings.menu
  },

};

export function createState(): IState {
  return reactive(State);
}
