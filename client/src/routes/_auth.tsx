import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../util/auth';

export const Route = createFileRoute('/_auth')({
	component: RouteComponent,
	beforeLoad: () => {
		if (useAuthStore.getState().user !== null) {
			throw redirect({
				to: '/tasks'
			});
		}
	}
});

function RouteComponent() {
	return (
		<>
			<Outlet />
		</>
	);
}
