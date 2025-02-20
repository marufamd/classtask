import { useMediaQuery } from '@mantine/hooks';
import { AppShell } from '@mantine/core';
import { NavTabs } from './NavTabs';
import BottomBar from './BottomBar';
import { tabs } from '../../util/constants';
import { useLocation } from '@tanstack/react-router';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const isMobile = useMediaQuery('(max-width: 768px)');
	const location = useLocation();

	const path = location.pathname.split('/').pop()?.toLowerCase() as string;

	return (
		<AppShell header={{ height: isMobile ? 57 : 97 }}>
			<AppShell.Header>
				<NavTabs tabs={tabs} path={path} />
			</AppShell.Header>

			<AppShell.Main>{children}</AppShell.Main>

			{isMobile && <BottomBar tabs={tabs} path={path} />}
		</AppShell>
	);
}
