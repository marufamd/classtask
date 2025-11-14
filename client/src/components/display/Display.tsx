import { ActionIcon, Card, Flex, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Loading from '../Loading';

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
		<Loading loading={loading}>
			<Card shadow="sm" mt="md" padding="lg" radius="md" withBorder>
				<Flex direction="row" justify="start" align="center">
					<Title>{name}</Title>
					<ActionIcon onClick={addFn} ml="auto" color="var(--classtask-color)" size="lg">
						{<IconPlus />}
					</ActionIcon>
				</Flex>
				{children}
			</Card>
		</Loading>
	);
}
