
type IMember = {
	avatar: string;
	name: string;
	id: string;
}

export type ICenter = {
	id: string;
	owner: string;
	title: string;
	avatar: string;
	cover: string;
	status: string;
	percent: number;
	logo: string;
	href: string;
	updatedAt: string;
	createdAt: string;
	subDescription: string;
	description: string;
	activeUser: number;
	newUser: number;
	star: number;
	like: number;
	message: number;
	content: string;
	members: IMember[]
}

export type ISource = Pick<ICenter, 'title'|'avatar'|'activeUser'|'newUser'>;
export type IArticle = Pick<ICenter, 'id'|'description'|'owner'|'avatar'|'href'|'updatedAt'|'star'|'like'|'message'|'title'>
export type IProject = Pick<ICenter, 'id'|'cover'|'title'|'subDescription'|'members'>
