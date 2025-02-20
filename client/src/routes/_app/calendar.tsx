import { Card, Container, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/calendar')({
	component: RouteComponent
});

function RouteComponent() {
	return (
		<Container size="lg">
			<Card shadow="sm" mt="md">
				<Title>Calendar</Title>
				Coming Soon!
			</Card>
		</Container>
	);
}
