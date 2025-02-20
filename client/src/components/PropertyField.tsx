import { Flex, MantineStyleProp, Text } from '@mantine/core';

export default function PropertyField({ name, value, style }: { name: string; value: string | React.ReactNode; style?: MantineStyleProp }) {
	return (
		<Flex direction="column" gap={5} style={style} align="flex-start">
			<Text c="dimmed" fw="bold">
				{name}
			</Text>
			{typeof value === 'string' ? <Text>{value}</Text> : value}
		</Flex>
	);
}
