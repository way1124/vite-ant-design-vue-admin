import Mock from 'mockjs';

import { userInfo, loginAccount } from './user';
import { articleList } from './article';
import { getList, addList } from "./list";

Mock.mock('/api/login/account', 'post', loginAccount)
Mock.mock('/api/currentUser', 'get', userInfo)
Mock.mock('/api/fake_list', 'get', articleList)
Mock.mock(RegExp('/api/rule' + '.*'), 'get', getList)
Mock.mock('/api/rule', 'post', addList)


// Mock.mock('/api/test', /post|get/i, (option: any) => {
// 	const { current, pageSize } = JSON.parse(option.body)
// 	return {
// 		current: current,
// 		data: testList.slice((current-1) * pageSize, current * pageSize),
// 		pageSize,
// 		success: true,
// 		total: testList.length,
// 	}
// })
