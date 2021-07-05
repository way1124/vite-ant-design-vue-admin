import Mock from 'mockjs';

import { parseQueryString } from "@/utils";

let testList: any[] = Array(100).fill({}).map((r, i) => {
	r = {
		avatar: "https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png",
		callNo: Mock.Random.integer(100, 1000),
		createdAt: Mock.Random.now(),
		desc: "这是一段描述",
		disabled: false,
		href: "https://ant.design",
		key: i,
		name: "TradeCode " + i,
		owner: "曲丽丽",
		progress: 72,
		status: Mock.Random.integer(0, 3) + '',
		updatedAt: Mock.Random.now(),
	}
	return r
}).reverse()

export const getList = (option: any) => {
	const { current, pageSize } = parseQueryString(option.url)
	return {
		current: current,
		data: testList.slice((Number(current)-1) * Number(pageSize), Number(current) * Number(pageSize)),
		pageSize,
		success: true,
		total: testList.length,
	}
}

export const addList = (option: any) => {
    const { name, desc } = JSON.parse(option.body)

    const i = testList.length + 1
    const r = {
        avatar: "https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png",
		callNo: Mock.Random.integer(100, 1000),
		createdAt: Mock.Random.now(),
		desc: desc,
		disabled: false,
		href: "https://ant.design",
		key: i,
		name: name,
		owner: "曲丽丽",
		progress: 72,
		status: Mock.Random.integer(0, 3) + '',
		updatedAt: Mock.Random.now(),
    }

    testList = [r, ...testList]
}
