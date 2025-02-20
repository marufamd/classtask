import { Card, Container, Flex, Text, Title } from '@mantine/core';

export default function NotFound() {
	return (
		<Container size="lg">
			<Card shadow="sm" mt="md">
				<Flex direction="column" justify="center" align="center">
					<Title>404</Title>
					<Text size="lg">This page was not found.</Text>
				</Flex>
			</Card>
		</Container>
	);
}
