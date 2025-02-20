import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponse, User } from './interfaces';
import { deleteAccessToken, deleteRefreshToken, getRefreshToken, request, setAccessToken } from './util';

export async function refresh() {
	const res = await request<LoginResponse>('/auth/refresh', {
		method: 'POST',
		body: JSON.stringify({ refreshToken: getRefreshToken() })
	});

	if (!res.ok) {
		deleteRefreshToken();
		deleteAccessToken();
		useAuthStore.setState({ user: null });
		return false;
	}

	const data = await res.json();

	setAccessToken(data.accessToken);

	return true;
}

interface AuthStore {
	user: User | null;
	setUser: (user: AuthStore['user']) => void;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user })
		}),
		{
			name: 'user-storage'
		}
	)
);
