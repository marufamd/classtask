import { ActionIcon, Container, Flex, Tabs, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import classes from './NavTabs.module.css';
import Logo from '../Logo';
import type { Tab } from '../../util/constants';
import { useNavigate } from '@tanstack/react-router';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function NavTabs({ tabs, path }: { tabs: Tab[]; path: string }) {
	const navigate = useNavigate();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { colorScheme: _, setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme();

	const toggleColorScheme = () => {
		setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
	};

	const items = tabs.map((tab) => (
		<Tabs.Tab value={tab.label.toLowerCase()} key={tab.label}>
			<Flex direction="row" align="center" justify="center" gap={5}>
				{<tab.icon size={18} />}
				{tab.label as string}
			</Flex>
		</Tabs.Tab>
	));

	return (
		<div className={classes.header}>
			<Flex direction="row" align="center" justify="space-between" w="100vw" p="0 10px var(--mantine-spacing-sm) 10px">
				<div style={{ width: 24 }}></div>
				<Logo size={34} />
				<ActionIcon color="var(--classtask-color)" size="lg" onClick={toggleColorScheme}>
					{computedColorScheme === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
				</ActionIcon>
			</Flex>

			<Container fluid size="md">
				<Tabs
					value={path}
					variant="outline"
					visibleFrom="sm"
					onChange={(value) => navigate({ to: `/${value}` })}
					classNames={{
						root: classes.tabs,
						list: classes.tabsList,
						tab: classes.tab
					}}
				>
					<Tabs.List>{items}</Tabs.List>
				</Tabs>
			</Container>
		</div>
	);
}
