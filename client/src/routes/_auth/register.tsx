import { Button, Container, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';

import Logo from '../../components/Logo';
import { request } from '../../util/util';
import { APIResponse } from '../../util/interfaces';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/register')({
	component: RouteComponent
});

const registerSchema = z
	.object({
		email: z.string().min(6, { message: 'Email must have at least 6 characters' }),
		displayName: z
			.string()
			.min(2, { message: 'Your name must have at least two letters.' })
			.refine((s) => /[a-zA-Z]/g.test(s), 'Your name can only contain letters.'),
		username: z
			.string()
			.min(3, { message: 'Username must have at least two letters.' })
			.refine((s) => /^[^\s]+$/g.test(s), 'Username cannot contain any spaces'),
		password: z.string().trim().min(8, { message: 'Password must be at least 8 characters.' }),
		passwordConfirm: z.string().trim().min(8, { message: 'Password must be at least 8 characters.' })
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords do not match',
		path: ['passwordConfirm']
	});

function RouteComponent() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const registerForm = useForm({
		mode: 'uncontrolled',
		initialValues: {
			email: '',
			displayName: '',
			username: '',
			password: '',
			passwordConfirm: ''
		},
		validate: zodResolver(registerSchema),
		enhanceGetInputProps: () => ({ disabled: loading })
	});

	const registerHandler = async (values: typeof registerForm.values) => {
		setLoading(true);

		try {
			const res = await request<APIResponse>('/auth/register', {
				method: 'POST',
				body: JSON.stringify(values)
			});

			if (!res.ok) {
				notifications.show({
					title: 'Registration Error',
					message: (await res.json()).message
				});

				return;
			}

			navigate({ to: '/verify', search: { status: 'registered' } });
		} catch (e) {
			notifications.show({
				title: 'Registration failed.',
				message: 'An unknown error occurred.',
				color: 'red'
			});

			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container size={420} my={40}>
			<Logo size={50} style={{ marginBottom: 20 }} />

			<Title ta="center">Create Your Account</Title>

			<form onSubmit={registerForm.onSubmit(registerHandler)}>
				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
					<TextInput
						withAsterisk
						label="Email"
						placeholder="Your email"
						mt="md"
						key={registerForm.key('email')}
						{...registerForm.getInputProps('email')}
					/>
					<TextInput
						withAsterisk
						label="Name"
						placeholder="Your name"
						mt="md"
						key={registerForm.key('displayName')}
						{...registerForm.getInputProps('displayName')}
					/>
					<TextInput
						withAsterisk
						label="Username"
						placeholder="Your username"
						mt="md"
						key={registerForm.key('username')}
						{...registerForm.getInputProps('username')}
					/>
					<PasswordInput
						withAsterisk
						label="Password"
						placeholder="Your password"
						mt="md"
						key={registerForm.key('password')}
						{...registerForm.getInputProps('password')}
					/>
					<PasswordInput
						label="Re-enter Password"
						placeholder="Your password"
						mt="md"
						key={registerForm.key('passwordConfirm')}
						{...registerForm.getInputProps('passwordConfirm')}
					/>
					<Button type="submit" fullWidth mt="xl" color="var(--classtask-color)" loading={loading}>
						Register
					</Button>
				</Paper>
			</form>
		</Container>
	);
}
