export enum IStorage {
  localStorage = "localStorage",
  sessionStorage = "sessionStorage",
}

export class PersistStorage<T> {

  private STORAGE_KEY: string = "--VITE-STORAGE--";
  private key: string = "";
  private storage: Storage = window[IStorage.localStorage];

  constructor(key: string = "default", storage: IStorage = IStorage.localStorage) {
    this.key = key
    this.storage = window[storage]
  }

  setItem(state: T) {
    const stateRow = this.getItem();
    stateRow[this.key] = state;
    const stateStr = JSON.stringify(stateRow);
    this.storage.setItem(this.STORAGE_KEY, stateStr);
  }

  getItem(key?: string) {
    const stateStr = this.storage.getItem(this.STORAGE_KEY) || "{}";
    const stateRow = JSON.parse(stateStr) || {};
    return key ? stateRow[key] || {} : stateRow;
  }

  removeItem(key?: string) {
    this.storage.removeItem(key || this.key)
  }

  clear() {
    this.storage.clear()
  }

}