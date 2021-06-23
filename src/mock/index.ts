import Mock from 'mockjs';

import { userInfo } from './user';
import { articleList } from './article';

Mock.mock('/api/list','get',{"data": [
	{
		"id":"1",
		"title":"title"
	}
]})

Mock.mock('/api/currentUser', 'get', userInfo)
Mock.mock('/api/fake_list', 'get', articleList)
