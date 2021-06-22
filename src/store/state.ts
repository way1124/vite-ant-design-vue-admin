import { reactive } from "vue";

export interface IState {
  token: string;
  user: any;
}

export const State: IState = {
  token: "",
  user: {
    currentAuthority: "",
    status: "",
    type: "",
  },
};

export function createState() {
  return reactive(State);
}
