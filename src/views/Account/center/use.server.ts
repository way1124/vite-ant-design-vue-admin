import { ref, onMounted, Ref } from "vue";
import { get } from "@/utils/request";

export function getFakeList<T>() {
	return get<T>("/api/fake_list")
}

export function useServer<T>() {
	const data = ref<T>();
	const loading = ref(true)
	const getList = () => {
		getFakeList<T>().then((r) => {
			loading.value = false
			data.value = r
		});
	};

	onMounted(getList);

	return {
		data,
		loading,
	}
}

export function useUserInfo<T>() {
	const data: Ref<T> = ref<T>() as Ref<T>;
	const loading = ref(true)

	const getUserInfo = () => {
		loading.value = true
		get<T>('/api/currentUser').then(r => {
			data.value = r
			loading.value = false
		})
	}
	onMounted(getUserInfo)

	return { data, loading }
}