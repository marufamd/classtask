import { Badge, Card, Flex, SimpleGrid, Text } from '@mantine/core';
import Display from './Display';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

import classes from './CourseDisplay.module.css';
import { useQueryCourses } from '../../hooks/courses';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import CourseModal from '../modal/CourseModal';

export default function CourseDisplay() {
	const navigate = useNavigate();
	const isMobile = useMediaQuery('(max-width: 768px)');

	const [opened, { open, close }] = useDisclosure(false);

	const { data: courses, isLoading, error } = useQueryCourses(true);

	useEffect(() => {
		if (error) {
			console.error(error);
			navigate({ to: '/error', search: { message: error?.message } });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	return (
		<>
			<CourseModal opened={opened} close={close} />
			<Display name="My Courses" loading={isLoading} addFn={open}>
				<SimpleGrid cols={isMobile ? 1 : 3} mt={15}>
					{courses?.map((course) => {
						return (
							<Card
								component="button"
								className={classes.courseCard}
								onClick={() =>
									navigate({
										to: '/courses/$courseId',
										params: {
											courseId: course.id
										}
									})
								}
							>
								<Flex direction="row" gap={15} align="center">
									<Badge color={course.color} size="lg" circle />
									<Flex direction="column">
										<Text fw="bold" size="lg">
											{course.name}
										</Text>
										<Text c="dimmed" size="md">
											{course.code}
										</Text>
									</Flex>
								</Flex>
							</Card>
						);
					})}
				</SimpleGrid>
			</Display>
		</>
	);
}
