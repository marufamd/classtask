import { Flex, Paper, Text } from '@mantine/core';
import type { Tab } from '../../util/constants';

import classes from './BottomBar.module.css';
import { useNavigate } from '@tanstack/react-router';
import { useMediaQuery } from '@mantine/hooks';

export default function BottomBar({ tabs, path }: { tabs: Tab[]; path: string }) {
	const navigate = useNavigate();
	const isPWA = useMediaQuery("(display-mode: standalone)");

	return (
		<Paper
			shadow="md"
			radius="md"
			withBorder
			style={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'space-around',
				backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
				zIndex: 999,
				paddingBottom: isPWA ? '20px' : 0
			}}
		>
			{tabs.map((tab, index) => (
				<>
					<Flex
						key={tab.label as string}
						direction="column"
						align="center"
						justify="center"
						gap={6}
						className={classes.nav}
						data-active={path === tab.label.toLowerCase() || undefined}
						onClick={() => navigate({ to: tab.href })}
					>
						{<tab.icon size={28} />}
						<Text fw={700} size="xs" ta="center">
							{tab.label as string}
						</Text>
					</Flex>
					{index < tabs.length - 1 && (
						<div
							style={{
								width: '1px',
								backgroundColor: 'light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))',
								height: '70px',
								alignSelf: 'center'
							}}
						/>
					)}
				</>
			))}
		</Paper>
	);
}
