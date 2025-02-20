import { Anchor, Button, Container, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Logo from '../../components/Logo';
import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { request, setAccessToken, setRefreshToken } from '../../util/util';
import { APIResponse, LoginResponse } from '../../util/interfaces';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '../../util/auth';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/login')({
	component: RouteComponent
});

const loginSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'Username must have at least two letters.' })
		.refine((s) => /^[^\s]+$/g.test(s), 'Username cannot contain any spaces'),
	password: z.string().trim().min(8, { message: 'Password must have at least 8 characters.' })
});

function RouteComponent() {
	const setUser = useAuthStore((state) => state.setUser);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const loginForm = useForm({
		mode: 'uncontrolled',
		initialValues: {
			username: '',
			password: ''
		},
		validate: zodResolver(loginSchema),
		enhanceGetInputProps: () => ({ disabled: loading })
	});

	const loginHandler = async (values: typeof loginForm.values) => {
		setLoading(true);

		try {
			const res = await request<LoginResponse | APIResponse>('/auth/login', {
				method: 'POST',
				body: JSON.stringify(values)
			});

			if (!res.ok) {
				const { message } = (await res.json()) as APIResponse;

				switch (res.status) {
					case 401:
						notifications.show({
							title: 'Login failed.',
							message,
							color: 'red'
						});

						loginForm.setErrors({ username: message, password: message });
						return;
					case 403:
						notifications.show({
							title: 'Login failed.',
							message,
							color: 'yellow'
						});
						return;
					default:
						notifications.show({
							title: 'Login failed.',
							message,
							color: 'red'
						});
						return;
				}
			}

			const data = (await res.json()) as LoginResponse;

			setAccessToken(data.accessToken);
			setRefreshToken(data.refreshToken);
			setUser(data.user);

			await navigate({ to: '/tasks' });
		} catch (e) {
			notifications.show({
				title: 'Login failed.',
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

			<Title ta="center">Log In To Your Account</Title>

			<Text c="dimmed" size="sm" ta="center" mt={5}>
				Don't have an account?{' '}
				<Anchor size="sm" component="button" onClick={() => navigate({ to: '/register' })}>
					Register
				</Anchor>
			</Text>

			<form onSubmit={loginForm.onSubmit(loginHandler)}>
				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
					<TextInput
						withAsterisk
						label="Username"
						placeholder="Your username"
						key={loginForm.key('username')}
						{...loginForm.getInputProps('username')}
					/>
					<PasswordInput
						withAsterisk
						label="Password"
						placeholder="Your password"
						mt="md"
						key={loginForm.key('password')}
						{...loginForm.getInputProps('password')}
					/>
					<Button type="submit" fullWidth mt="xl" color="var(--classtask-color)" loading={loading}>
						Sign in
					</Button>
				</Paper>
			</form>
		</Container>
	);
}
