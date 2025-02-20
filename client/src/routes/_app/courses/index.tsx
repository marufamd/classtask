import { Container } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import CourseDisplay from '../../../components/display/CourseDisplay';

export const Route = createFileRoute('/_app/courses/')({
	component: RouteComponent
});

function RouteComponent() {
	return (
		<Container size="lg">
			<CourseDisplay />
		</Container>
	);
}
