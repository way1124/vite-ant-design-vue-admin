import Mock from 'mockjs';

import { userInfo } from './user';

Mock.mock('/api/list','get',{"data": [
	{
		"id":"1",
		"title":"title"
	}
]})

Mock.mock('/api/currentUser','get', userInfo)
