import { Moment } from 'moment';

export type IRepositoryForm = {
	name: string;
	url: string;
	owner: string;
	approver: string;
	dateRange: Moment | undefined;
	type: string;
}

export type ITaskForm = {
	name2: string;
	url2: string;
	owner2: string;
	approver2: string;
	dateRange2: Moment | undefined;
	type2: string;
}
