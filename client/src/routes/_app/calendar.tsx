import { Container } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CalendarDisplay } from '../../components/display/CalendarDisplay';
import { Task } from '../../util/interfaces';

export const Route = createFileRoute('/_app/calendar')({
	component: RouteComponent
});

function RouteComponent() {
	const navigate = useNavigate();

	const handleTaskClick = (task: Task) => {
		void navigate({ to: '/tasks/$taskId', params: { taskId: task.id } });
	};

	return (
		<Container size="xl" py="md" style={{ height: '100%' }}>
			<CalendarDisplay onTaskClick={handleTaskClick} />
		</Container>
	);
}
