import Mock from 'mockjs';

import { userInfo, loginAccount } from './user';
import { articleList } from './article';

Mock.mock('/api/list','get',{"data": [
	{
		"id":"1",
		"title":"title"
	}
]})

Mock.mock('/api/login/account', 'post', loginAccount)
Mock.mock('/api/currentUser', 'get', userInfo)
Mock.mock('/api/fake_list', 'get', articleList)
