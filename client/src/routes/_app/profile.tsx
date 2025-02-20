import { Avatar, Button, Card, Container, Flex, Title } from '@mantine/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../util/auth';
import PropertyField from '../../components/PropertyField';
import { deleteAccessToken, deleteRefreshToken, request, getAccessToken } from '../../util/util';

export const Route = createFileRoute('/_app/profile')({
	component: RouteComponent
});

function RouteComponent() {
	const user = useAuthStore((state) => state.user);
	const setUser = useAuthStore((state) => state.setUser);

	const navigate = useNavigate();

	const logoutHandler = async () => {
		try {
			await request('/auth/logout', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getAccessToken()}`
				}
			});
		} catch (e) {
			console.error(e);
		} finally {
			deleteAccessToken();
			deleteRefreshToken();

			setUser(null);

			navigate({ to: '/login' });
		}
	};

	return (
		<Container size={500} mt="md">
			<Card withBorder shadow="sm" radius="md">
				<Flex direction="column" gap={10} justify="center" align="center">
					<Avatar size={130} radius="100%" />
					<Title ta="center">{user!.displayName}</Title>
				</Flex>
				<Flex direction="column" align="start" justify="start" gap={10}>
					<PropertyField name="Email" value={user!.email} />
					<PropertyField name="Username" value={user!.username} />
					<PropertyField name="Account Creation Time" value={new Date(user!.createdTime).toLocaleString()} />
				</Flex>
				<Button onClick={logoutHandler} mt="xl" color="red">
					Sign Out
				</Button>
			</Card>
		</Container>
	);
}
