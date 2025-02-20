import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { routeTree } from './routeTree.gen';
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

import './index.css';
import { Notifications } from '@mantine/notifications';

const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	context: {
		queryClient
	},
	defaultPreload: 'intent',
	defaultPreloadStaleTime: 0
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<MantineProvider defaultColorScheme="auto">
					<Notifications />
					<RouterProvider router={router} />
				</MantineProvider>
			</QueryClientProvider>
		</StrictMode>
	);
}
