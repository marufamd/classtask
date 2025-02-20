import dayjs from 'dayjs';
import { refresh } from './auth';
import { APIError, APIResponse } from './interfaces';

export function request<T>(path: string, init?: RequestInit) {
	const fetchUrl = `${import.meta.env.VITE_API_URL}${path}`;

	let options: RequestInit = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	if (init) {
		if ('headers' in init) {
			Object.assign(init.headers!, options.headers);
		} else {
			init.headers = options.headers;
		}

		options = init;
	}

	options.credentials = 'include';

	return fetch(fetchUrl, options) as Promise<FetchResponse<T>>;
}

interface FetchResponse<T> extends Response {
	json: () => Promise<T>;
}

export async function fetchAPI<T>(path: string, init?: RequestInit, retry: boolean = false) {
	let options: RequestInit = {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`
		}
	};

	if (init) {
		if ('headers' in init) {
			Object.assign(init.headers!, options.headers);
		} else {
			init.headers = options.headers;
		}

		options = init;
	}

	const res = await request<T>(path, options);

	const data = await res.json();

	if (res.status === 401 && !retry) {
		if ((data as APIResponse).message === 'Invalid or expired token') {
			await refresh();

			return fetchAPI<T>(path, init, true);
		}
	}

	if (!res.ok) {
		throw new APIError((data as APIResponse).message, {
			headers: res.headers,
			ok: res.ok,
			redirected: res.redirected,
			status: res.status,
			statusText: res.statusText,
			type: res.type,
			url: res.url
		});
	} else {
		return data as T;
	}
}

export function getAccessToken() {
	return sessionStorage.getItem('accessToken');
}

export function setAccessToken(token: string) {
	return sessionStorage.setItem('accessToken', token);
}

export function deleteAccessToken() {
	return sessionStorage.removeItem('accessToken');
}

export function getRefreshToken() {
	return localStorage.getItem('refreshToken');
}

export function setRefreshToken(token: string) {
	return localStorage.setItem('refreshToken', token);
}

export function deleteRefreshToken() {
	return localStorage.removeItem('refreshToken');
}

export function trim(str: string, length: number) {
	return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function formatDate(date?: dayjs.ConfigType) {
	return date ? dayjs(date).format('MMM D, YYYY h:mm A') : '';
}
