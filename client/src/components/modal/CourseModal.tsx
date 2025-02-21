import { useNavigate } from '@tanstack/react-router';
import { useCreateCourse, useQueryCourse, useUpdateCourse } from '../../hooks/courses';
import { useEffect } from 'react';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { Box, Button, ColorInput, Flex, LoadingOverlay, Modal, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';

const courseFormSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255, 'Name can only be 255 characters'),
	code: z.string().min(1, 'Code is required').max(32, 'Code can only be 32 characters'),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex code')
		.optional()
});

export default function CourseModal({ opened, close, courseId }: { opened: boolean; close: () => void; courseId?: string }) {
	const navigate = useNavigate();

	const { data: course, isLoading: loadingQuery, error } = useQueryCourse(courseId);

	useEffect(() => {
		if (error) {
			console.error(error);
			navigate({ to: '/error', search: { message: error?.message } });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	const { isPending: loadingCreate, mutateAsync: createCourse } = useCreateCourse();
	const { isPending: loadingUpdate, mutateAsync: updateCourse } = useUpdateCourse(courseId);

	const courseForm = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: course?.name ?? '',
			code: course?.code ?? ''
		},
		validate: zodResolver(courseFormSchema),
		enhanceGetInputProps: () => ({ disabled: loadingQuery || loadingCreate || loadingUpdate })
	});

	const saveHandler = async (values: typeof courseForm.values) => {
		const payload = {
			...values
		};

		const options = {
			onSuccess: () => {
				notifications.show({
					title: 'Success',
					message: `${courseId ? 'Updated' : 'Created'} the course`
				});
			}
		};

		try {
			console.log(values);

			if (courseId) {
				await updateCourse(payload, options);
			} else {
				await createCourse(payload, options);
			}

			close();
			courseForm.reset();
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
		<form id="course-form" onSubmit={courseForm.onSubmit(saveHandler)}>
			<Box pos="relative">
				<LoadingOverlay visible={loadingQuery || loadingCreate || loadingUpdate} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
				<Modal size="md" opened={opened} onClose={close} title={courseId ? 'Edit Course' : 'Create Course'}>
					<TextInput
						withAsterisk
						label="Name"
						placeholder="Enter name"
						key={courseForm.key('name')}
						{...courseForm.getInputProps('name')}
					/>
					<TextInput
						mt={10}
						withAsterisk
						label="Code"
						placeholder="Enter code"
						key={courseForm.key('code')}
						{...courseForm.getInputProps('code')}
					/>
					<ColorInput
						mt={10}
						label="Color"
						placeholder="Select color"
						key={courseForm.key('color')}
						{...courseForm.getInputProps('color')}
					/>
					<Flex direction="row" align="center" justify="center" mt={10}>
						<Button
							type="submit"
							form="course-form"
							color="var(--classtask-color)"
							loading={loadingQuery || loadingCreate || loadingUpdate}
						>
							Save
						</Button>
					</Flex>
				</Modal>
			</Box>
		</form>
	);
}
