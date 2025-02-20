import { Card, Container, Text, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const verifySearchSchema = z.object({
	message: z.string().default('')
});

export const Route = createFileRoute('/_app/error')({
	component: RouteComponent,
	validateSearch: verifySearchSchema
});

function RouteComponent() {
	const { message } = Route.useSearch();

	return (
		<Container size="lg">
			<Card shadow="sm">
				<Title ta="center">An error occurred.</Title>
				<Text size="md" ta="center">
					{message}
				</Text>
			</Card>
		</Container>
	);
}
