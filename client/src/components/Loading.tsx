import { Box, LoadingOverlay } from '@mantine/core';

export default function Loading({ loading, children }: { loading: boolean; children: React.ReactNode }) {
	return (
		<Box pos="relative">
			<LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
			{children}
		</Box>
	);
}
