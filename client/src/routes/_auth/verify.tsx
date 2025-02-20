/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Container, Text, Title } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Logo from '../../components/Logo';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { request } from '../../util/util';
import { APIResponse } from '../../util/interfaces';
import { notifications } from '@mantine/notifications';

const verifySearchSchema = z.object({
	email: z.string().default(''),
	status: z.enum(['registered', 'failed', '']).default(''),
	token: z.string().default('')
});

export const Route = createFileRoute('/_auth/verify')({
	component: RouteComponent,
	validateSearch: verifySearchSchema
});

function RouteComponent() {
	const { email, status, token } = Route.useSearch();

	const navigate = useNavigate();

	const [verified, setVerified] = useState(false);

	useEffect(() => {
		if (!token?.length && !status?.length) {
			navigate({ to: '/login' });
			return;
		}
	}, []);

	useEffect(() => {
		(async () => {
			if (token?.length && !verified) {
				const res = await request(`/auth/verify?token=${token}`);

				if (!res.ok) {
					navigate({ to: '/verify', search: { status: 'failed' } });
					return;
				}

				setVerified(true);
			}
		})();
	}, []);

	let titleText, descText;

	if (verified) {
		titleText = 'Verification Successful';
		descText = 'Your account has successfully been verified. You can now login!';
	} else {
		switch (status) {
			case 'failed':
				titleText = 'Verification Failed';
				descText = 'Could not verify your account. The verification token is either invalid or expired.';
				break;
			case 'registered':
			default:
				titleText = 'Verify Your Account';
				descText = 'A link has been sent to your email. Please check your spam and/or junk folders.';
				break;
		}
	}

	const handleResend = async () => {
		const res = await request<APIResponse>(`/auth/refresh-verification?email=${encodeURIComponent(email)}`);
		if (!res.ok) {
			notifications.show({
				title: 'Error',
				message: 'Unable to resend email. Please try again later.',
				color: 'red'
			});
			return;
		}

		notifications.show({
			title: 'Success',
			message: 'A new email has been sent.'
		});
	};

	return (
		<Container size={500} my={40}>
			<Logo size={50} style={{ marginBottom: 20 }} />

			<Title ta="center">{titleText}</Title>

			<Text mt="lg" ta="center">
				{descText}
			</Text>

			{!verified && Boolean(email?.length) && (
				<Button onClick={handleResend} fullWidth mt="xl" color="var(--classtask-color)">
					Resend Email
				</Button>
			)}

			{verified && (
				<Button onClick={() => navigate({ to: '/login' })} fullWidth mt="xl" color="var(--classtask-color)">
					Login
				</Button>
			)}
		</Container>
	);
}
