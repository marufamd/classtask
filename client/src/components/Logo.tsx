import { Flex, Image, MantineStyleProp, Text } from '@mantine/core';

export default function Logo({ size = 200, style }: { size?: number | string; style?: MantineStyleProp }) {
	return (
		<Flex direction="row" gap={7} align="center" justify="center" style={style || {}}>
			<Image radius="xl" h={size} w={size} src="/logo.png" />
			<Text ff="Afacad Flux" style={{ fontSize: size, fontWeight: 500, margin: '-10px 0px -10px 0px' }}>
				ClassTask
			</Text>
		</Flex>
	);
}
