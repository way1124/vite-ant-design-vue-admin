import { post } from '@/utils/request';

export interface FormState {
  autoLogin: boolean;
  type: string;
  userName: string;
  password: string;
}

export type Result = {
  currentAuthority: string;
  status: string;
  type: string;
}

export async function Login(params: FormState) {
  try {
    const data = await post<Result>('https://proapi.azurewebsites.net/api/login/account', params)
    return data
  } catch (error) {
    return {} as Result
  }
}

