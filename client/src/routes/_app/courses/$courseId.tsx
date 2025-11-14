/* eslint-disable react-hooks/exhaustive-deps */
import { ActionIcon, Badge, Card, Container, Flex, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDeleteCourse, useQueryCourse } from '../../../hooks/courses';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import CourseModal from '../../../components/modal/CourseModal';

export const Route = createFileRoute('/_app/courses/$courseId')({
	component: RouteComponent
});

function RouteComponent() {
	const { courseId } = Route.useParams();
	const navigate = useNavigate();

	const [opened, { open, close }] = useDisclosure();

	const { data: course, isLoading: courseLoading, error: courseError } = useQueryCourse(courseId);
	const { mutateAsync: deleteCourse } = useDeleteCourse(courseId);

	useEffect(() => {
		if (!courseLoading && !course) {
			navigate({ to: '/tasks' });
		}
	}, [courseLoading, course]);

	useEffect(() => {
		if (courseError) {
			console.error(courseError);
			navigate({ to: '/error', search: { message: courseError?.message } });
		}
	}, [courseError]);

	const handleDelete = async () => {
		try {
			await deleteCourse(null, {
				onSettled: () => {
					navigate({ to: '/courses' });
				}
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			notifications.show({
				title: 'Error',
				message: e?.message ?? 'An unknown error occurred',
				color: 'red'
			});
		}
	};

	return (
		<>
			<CourseModal opened={opened} close={close} courseId={courseId} />
			<Container size="md">
				<Card shadow="sm" mt="md" withBorder padding="lg" radius="md">
					<Flex direction="column" gap={15}>
						<Flex direction="row" justify="start" align="center">
							<Flex direction="row" gap={15} align="center">
								<Badge color={course?.color ?? 'var(--classtask-color)'} size="lg" circle />
								<Title>{course?.name ?? course?.code}</Title>
							</Flex>
							<Flex direction="row" ml="auto" gap={10}>
								<ActionIcon onClick={open} color="var(--classtask-color)" size="lg">
									{<IconEdit />}
								</ActionIcon>
								<ActionIcon onClick={handleDelete} color="red" size="lg">
									{<IconTrash />}
								</ActionIcon>
							</Flex>
						</Flex>
						<Text size="lg" fw="bold">
							{course?.code}
						</Text>
					</Flex>
				</Card>
			</Container>
		</>
	);
}
