import { readonly, watch, toRaw } from "vue";
import { PersistStorage } from '@/utils/storage';
import { IState } from "./state";

// 数据持久化
export function persistStorage<T>(key = "default") {
  const persistStorage = new PersistStorage<T>(key)

  function createPersistStorage<T>(state: any): T {
    // init value
    Object.entries(persistStorage.getItem(key)).forEach(([key, value]) => {
      state[key] = value;
    });
  
    watch(state, () => {
      const stateRow = toRaw(state);
      persistStorage.setItem(stateRow);
    });
  
    return readonly(state);
  }

  function removePersistStorage() {
    persistStorage.clear()
  }

  return { createPersistStorage, removePersistStorage }
}

const { createPersistStorage, removePersistStorage } = persistStorage<IState>()

export { createPersistStorage, removePersistStorage }

