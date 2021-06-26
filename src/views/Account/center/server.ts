import { get } from "@/utils/request";

export function getFakeList<T>() {
	return get<T>("/api/fake_list")
}
