
export type Result = {
  name: string;
  desc: string;
  avatar?: string;
  callNo?: number;
  createdAt?: string;
  disabled?: boolean;
  href?: string;
  key?: number;
  owner?: string;
  progress?: number;
  status?: string;
  updatedAt?: string;
}
export type APIResult = {
  current: number;
  pageSize: string;
  success: boolean;
  total: number;
  data: Result[];
};

export interface IColumns {
  title: string;
  dataIndex: string;
  [key: string]: boolean | string | {[key: string]: string}[] | Object | string[];
}