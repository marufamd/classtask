import { Container } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import TaskDisplay from '../../../components/display/TaskDisplay';

export const Route = createFileRoute('/_app/tasks/')({
	component: RouteComponent
});

function RouteComponent() {
	return (
		<Container size="lg">
			<TaskDisplay />
		</Container>
	);
}
