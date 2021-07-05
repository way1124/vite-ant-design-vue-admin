import { get, post } from '@/utils/request';
import { tansParams } from '@/utils';
import { APIResult } from "./data";


// /api/rule
export async function addRule(params: any) {
  try {
    const data = await post<APIResult>('/api/rule', params)
    return data
  } catch (error) {
    return {}
  }
}

export async function getList(params: any) {
  try {
    const data = await get<APIResult>('/api/rule?' + tansParams(params), params)
    return data
  } catch (error) {
    return {} as APIResult
  }
}
