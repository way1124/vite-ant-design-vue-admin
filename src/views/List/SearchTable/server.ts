import { get, post } from '@/utils/request';
import { tansParams } from '@/utils';
import { APIResult } from "./data";

const queryData = (params: any) => {
  // return `https://proapi.azurewebsites.net/api/rule&${new URLSearchParams(params)}`;
  return `https://proapi.azurewebsites.net/api/rule?${tansParams(params)}`;
};

export async function getList(params: any) {
  try {
    const data = await get<APIResult>(queryData(params))
    return data
  } catch (error) {
    return {} as APIResult
  }
}

// https://proapi.azurewebsites.net//api/rule
export async function addRule(params: any) {
  try {
    const data = await post<APIResult>('https://proapi.azurewebsites.net/api/rule', params)
    return data
  } catch (error) {
    return {}
  }
}
