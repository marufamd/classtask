export interface User {
	id: string;
	displayName: string;
	username: string;
	passwordHash: string;
	email: string;
	createdTime: number;
	verified: boolean;
	verificationToken: string;
	tokenExpiryTime: string;
}

export interface Task {
	id: string;
	date: number;
	name: string;
	description: string;
	color: string;
	type: TaskType;
	completed: boolean;
	courseId: string;
	userId: string;
	createdTime: number;
	lastModifiedTime: number;
}

export type TaskPayload = Omit<Task, 'id' | 'createdTime' | 'lastModifiedTime'>;

export interface Course {
	id: string;
	color: string;
	name: string;
	code: string;
	userId: string;
	createdTime: number;
	lastModifiedTime: number;
}

export type CoursePayload = Omit<Course, 'id' | 'createdTime' | 'lastModifiedTime'>;

export enum TaskType {
	Assignment,
	Quiz,
	Test,
	Exam,
	Other
}

export interface APIResponse {
	message: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export class APIError extends Error {
	public constructor(message: string, data: ErrorData) {
		super(message);
		Object.assign(this, data);
	}
}

export interface ErrorData {
	headers: Headers;
	ok: boolean;
	redirected: boolean;
	status: number;
	statusText: string;
	type: ResponseType;
	url: string;
}

export type QueryError = APIError & ErrorData;
