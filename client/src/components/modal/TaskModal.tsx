/* eslint-disable react-hooks/exhaustive-deps */
import { Badge, Box, Button, ColorInput, Flex, LoadingOverlay, Modal, Select, Textarea, TextInput } from '@mantine/core';
import { useCreateTask, useQueryTask, useUpdateTask } from '../../hooks/tasks';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { DateTimePicker } from '@mantine/dates';
import { z } from 'zod';
import { taskTypes } from '../../util/constants';
import { useForm, zodResolver } from '@mantine/form';
import { useQueryCourses } from '../../hooks/courses';
import { TaskType } from '../../util/interfaces';
import { notifications } from '@mantine/notifications';

const taskFormSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Details are required'),
	date: z.date(),
	courseId: z.string(),
	type: z.string(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex code')
		.optional()
});

export default function TaskModal({ opened, close, taskId }: { opened: boolean; close: () => void; taskId?: string }) {
	const navigate = useNavigate();

	const { data: taskData, isLoading: taskLoading, error: taskError } = useQueryTask(taskId);
	const { data: courses, isLoading: courseLoading, error: courseError } = useQueryCourses(!taskLoading);

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
	}, [courseError]);

	const { isPending: loadingCreate, mutateAsync: createTask } = useCreateTask();
	const { isPending: loadingUpdate, mutateAsync: updateTask } = useUpdateTask();

	const taskForm = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: taskData?.name ?? '',
			description: taskData?.description ?? '',
			date: taskData?.date ? new Date(taskData.date) : undefined,
			courseId: taskData?.courseId ?? '',
			type: (taskData?.type ?? TaskType.Other).toString()
		},
		validate: zodResolver(taskFormSchema),
		enhanceGetInputProps: () => ({ disabled: taskLoading || courseLoading || loadingCreate || loadingUpdate })
	});

	const saveHandler = async (values: typeof taskForm.values) => {
		const payload = {
			...values,
			type: Number(values.type),
			date: values.date ? values.date.getTime() : undefined
		};

		const options = {
			onSuccess: () => {
				notifications.show({
					title: 'Success',
					message: `${taskId ? 'Updated' : 'Created'} the task`
				});
			}
		};

		try {
			console.log(values);

			if (taskId) {
				await updateTask({ taskId, ...payload }, options);
			} else {
				await createTask(payload, options);
			}

			close();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			notifications.show({
				title: 'Error',
				message: e?.message ?? 'An unknown error occurred',
				color: 'red'
			});

			console.error(e);
		}
	};

	return (
		<form id="task-form" onSubmit={taskForm.onSubmit(saveHandler)}>
			<Box pos="relative">
				<LoadingOverlay
					visible={taskLoading || courseLoading || loadingCreate || loadingUpdate}
					zIndex={1000}
					overlayProps={{ radius: 'sm', blur: 2 }}
				/>
				<Modal size="md" opened={opened} onClose={close} title={taskId ? 'Edit Task' : 'Create Task'}>
					<TextInput withAsterisk label="Name" placeholder="Enter name" key={taskForm.key('name')} {...taskForm.getInputProps('name')} />
					<Textarea
						mt={10}
						label="Details"
						placeholder="Enter details"
						autosize
						minRows={2}
						maxRows={6}
						key={taskForm.key('description')}
						{...taskForm.getInputProps('description')}
					/>
					<DateTimePicker
						mt={10}
						label="Deadline"
						placeholder="Enter deadline"
						key={taskForm.key('date')}
						{...taskForm.getInputProps('date')}
					/>
					<Select
						mt={10}
						label="Course"
						leftSection={
							<Badge
								color={courses?.find((c) => c.id === taskForm.getValues().courseId)?.color ?? 'var(--classtask-color)'}
								size="sm"
							/>
						}
						placeholder="Select course"
						data={courses?.map((c) => ({ value: c.id, label: c.code })) ?? []}
						key={taskForm.key('course')}
						{...taskForm.getInputProps('course')}
					/>
					<Select
						mt={10}
						label="Type"
						leftSection={''}
						data={Object.entries(taskTypes).map(([k, v]) => ({ value: k, label: v }))}
						key={taskForm.key('type')}
						{...taskForm.getInputProps('type')}
					/>
					<ColorInput mt={10} label="Color" placeholder="Select color" key={taskForm.key('color')} {...taskForm.getInputProps('color')} />
					<Flex direction="row" align="center" justify="center" mt={10}>
						<Button
							type="submit"
							form="task-form"
							color="var(--classtask-color)"
							loading={taskLoading || courseLoading || loadingCreate || loadingUpdate}
						>
							Save
						</Button>
					</Flex>
				</Modal>
			</Box>
		</form>
	);
}
