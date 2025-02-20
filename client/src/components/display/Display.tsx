import { ActionIcon, Box, Card, Flex, LoadingOverlay, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export default function Display({
	name,
	children,
	loading,
	addFn
}: {
	name: string;
	children?: React.ReactNode;
	loading: boolean;
	addFn?: React.MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<Card shadow="sm" mt="md">
			<Box pos="relative">
				<LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
				<Flex direction="row" justify="start" align="center">
					<Title>{name}</Title>
					<ActionIcon onClick={addFn} ml="auto" color="var(--classtask-color)" size="lg">
						{<IconPlus />}
					</ActionIcon>
				</Flex>
				{children}
			</Box>
		</Card>
	);
}
