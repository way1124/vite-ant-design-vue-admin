interface IFormStateOptions {
  key: string;
  value: string;
  [key: string]: any;
}

export interface FormState {
  [key: string]: any;
}

export interface IFormState {
  label: string;
  value: string;
  element: string;
  options?: IFormStateOptions[];
  hide?: boolean;
  props?: any;
}