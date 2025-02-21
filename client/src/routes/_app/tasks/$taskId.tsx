/* eslint-disable react-hooks/exhaustive-deps */
import { ActionIcon, Badge, Box, Button, Card, Container, Flex, LoadingOverlay, Text, Title } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDeleteTask, useQueryTask } from '../../../hooks/tasks';
import { useEffect } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { TaskType } from '../../../util/interfaces';
import PropertyField from '../../../components/PropertyField';
import { taskTypes } from '../../../util/constants';
import { formatDate } from '../../../util/util';
import { useQueryCourse } from '../../../hooks/courses';
import TaskModal from '../../../components/modal/TaskModal';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

export const Route = createFileRoute('/_app/tasks/$taskId')({
	component: RouteComponent
});

function RouteComponent() {
	const { taskId } = Route.useParams();
	const navigate = useNavigate();

	const [opened, { open, close }] = useDisclosure();

	const { data: task, isLoading: taskLoading, error: taskError } = useQueryTask(taskId);
	const { data: course, isLoading: courseLoading, error: courseError } = useQueryCourse(task?.courseId);
	const { mutateAsync: deleteTask } = useDeleteTask(taskId);

	useEffect(() => {
		if (!taskLoading && !task) {
			navigate({ to: '/tasks' });
		}
	}, [taskLoading, task]);

	useEffect(() => {
		if (taskError) {
			console.error(taskError);
			navigate({ to: '/error', search: { message: taskError?.message } });
		}
	}, [taskError]);

	useEffect(() => {
		if (courseError) {
			console.error(courseError);
			navigate({ to: '/error', search: { message: courseError?.message } });
		}
	}, [taskError]);

	const handleDelete = async () => {
		try {
			await deleteTask(null, {
				onSuccess: () => {
					navigate({ to: '/tasks' });
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
			<TaskModal taskId={taskId} opened={opened} close={close} />
			<Container size="md">
				<Card shadow="sm" mt="md">
					<Box pos="relative">
						<LoadingOverlay visible={taskLoading || courseLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
						<Flex direction="column" gap={15}>
							<Flex direction="row" justify="start" align="center">
								<Flex direction="row" gap={15} align="center">
									<Badge color={task?.color ?? 'var(--classtask-color)'} size="lg" circle />
									<Title>{task?.name}</Title>
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
							<Text size="md">{task?.description ?? ''}</Text>
							{task?.type !== TaskType.Other ? (
								<PropertyField name="Type" value={taskTypes[task?.type ?? TaskType.Other]} />
							) : undefined}
							{task?.courseId?.length ? (
								<PropertyField
									name="Course"
									value={
										<Button
											onClick={() => navigate({ to: `/courses/${course?.code}` })}
											radius="lg"
											color="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))"
											leftSection={<Badge color={course?.color ?? 'var(--classtask-color)'} size="sm" circle />}
										>
											{course?.code}
										</Button>
									}
								/>
							) : undefined}
							<PropertyField name="Deadline" value={formatDate(task?.date)} />
							<PropertyField name="Completed" value={task?.completed ? 'Yes' : 'No'} />
						</Flex>
					</Box>
				</Card>
			</Container>
		</>
	);
}
