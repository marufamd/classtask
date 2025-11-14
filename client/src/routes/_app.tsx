import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import AppLayout from '../components/layout/AppLayout';
import { useAuthStore } from '../util/auth';
import NotFound from '../components/display/NotFound';

export const Route = createFileRoute('/_app')({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (useAuthStore.getState().user === null) {
			context.queryClient.invalidateQueries();

			throw redirect({
				to: '/login'
			});
		}
	},
	notFoundComponent: () => (
		<AppLayout>
			<NotFound />
		</AppLayout>
	)
});

function RouteComponent() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
