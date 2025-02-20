import { IconBook, IconCalendar, IconListCheck, IconUser } from '@tabler/icons-react';
import { Task, TaskType } from './interfaces';

export const tabs: Tab[] = [
	{ label: 'Tasks', icon: IconListCheck, href: '/tasks' },
	{ label: 'Courses', icon: IconBook, href: '/courses' },
	{ label: 'Calendar', icon: IconCalendar, href: '/calendar' },
	{ label: 'Profile', icon: IconUser, href: '/profile' }
];

export interface Tab {
	label: string;
	icon: typeof IconBook;
	href: string;
}

export const columnData: Record<keyof Task, string> = {
	completed: '',
	name: 'Name',
	description: 'Details',
	courseId: 'Course',
	date: 'Deadline',
	type: 'Type',
	color: '',
	id: '',
	userId: '',
	createdTime: '',
	lastModifiedTime: ''
};

export const taskTypes: Record<TaskType, string> = {
	[TaskType.Assignment]: 'Assignment',
	[TaskType.Quiz]: 'Quiz',
	[TaskType.Test]: 'Test',
	[TaskType.Exam]: 'Exam',
	[TaskType.Other]: 'None'
};
