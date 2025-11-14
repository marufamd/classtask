import { useMediaQuery } from '@mantine/hooks';
import { AppShell } from '@mantine/core';
import { NavTabs } from './NavTabs';
import BottomBar from './BottomBar';
import { tabs } from '../../util/constants';
import { useLocation } from '@tanstack/react-router';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const isMobile = useMediaQuery('(max-width: 768px)');
	const isPWA = useMediaQuery('(display-mode: standalone)');
	const location = useLocation();

	const path = location.pathname.split('/').pop()?.toLowerCase() as string;

	// Calculate bottom padding for the fixed bottom bar
	// Base height (~86px for the bar) + PWA padding (20px if PWA) + extra margin (16px)
	const bottomPadding = isMobile ? (isPWA ? 122 : 102) : 0;

	return (
		<AppShell header={{ height: isMobile ? 57 : 97 }}>
			<AppShell.Header>
				<NavTabs tabs={tabs} path={path} />
			</AppShell.Header>

			<AppShell.Main pb={bottomPadding}>{children}</AppShell.Main>

			{isMobile && <BottomBar tabs={tabs} path={path} />}
		</AppShell>
	);
}
