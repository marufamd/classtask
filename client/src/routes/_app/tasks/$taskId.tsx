/* eslint-disable react-hooks/exhaustive-deps */
import { ActionIcon, Badge, Button, Card, Container, Flex, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import Loading from '../../../components/Loading';
import TaskModal from '../../../components/modal/TaskModal';
import PropertyField from '../../../components/PropertyField';
import { useQueryCourse } from '../../../hooks/courses';
import { useDeleteTask, useQueryTask } from '../../../hooks/tasks';
import { taskTypes } from '../../../util/constants';
import { TaskType } from '../../../util/interfaces';
import { formatDate } from '../../../util/util';

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
				onSettled: () => {
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
			<Loading loading={taskLoading || courseLoading}>
				<Container size="md">
					<Card shadow="sm" mt="md" withBorder padding="lg" radius="md">
						<Flex direction="column" gap={15}>
							<Flex direction="row" justify="start" align="center">
								<Flex direction="row" gap={15} align="center">
									<Badge color={task?.color ?? course?.color ?? 'var(--classtask-color)'} size="lg" circle />
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
					</Card>
				</Container>
			</Loading>
		</>
	);
}
