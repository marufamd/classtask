import { ActionIcon, Box, Card, Group, Paper, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import { useQueryTasks } from '../../hooks/tasks';
import { Task } from '../../util/interfaces';
import classes from './CalendarDisplay.module.css';
import { useQueryCourses } from '../../hooks/courses';
import { CLASSTASK_COLOR } from '../../util/constants';

interface EventCalendarProps {
	onTaskClick?: (task: Task) => void;
}

export function CalendarDisplay({ onTaskClick }: EventCalendarProps) {
    const { data: tasks = [] } = useQueryTasks();
    const { data: courses = [] } = useQueryCourses(true);
    
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

	// Get the first day of the month and calculate grid info
	const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
	const startingDayOfWeek = firstDayOfMonth.getDay();
	const daysInMonth = lastDayOfMonth.getDate();

    const getTaskColor = (task: Task) => {
        const course = courses.find(c => c.id === task.courseId);
        return task.color || course?.color || CLASSTASK_COLOR;
    };

	// Navigation handlers
	const goToPreviousMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
	};

	const goToNextMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	};

	// Group tasks by date
	const tasksByDate = tasks.reduce(
		(acc, task) => {
			if (task.date) {
				const taskDate = new Date(task.date);
				const dateKey = `${taskDate.getFullYear()}-${taskDate.getMonth()}-${taskDate.getDate()}`;
				if (!acc[dateKey]) {
					acc[dateKey] = [];
				}
				acc[dateKey].push(task);
			}
			return acc;
		},
		{} as Record<string, Task[]>
	);

	// Get tasks for a specific day
	const getTasksForDay = (day: number): Task[] => {
		const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
		return tasksByDate[dateKey] || [];
	};

	// Generate calendar days
	const calendarDays = [];
	const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;

	for (let i = 0; i < totalCells; i++) {
		const dayNumber = i - startingDayOfWeek + 1;
		const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
		const isToday =
			isCurrentMonth &&
			dayNumber === new Date().getDate() &&
			currentDate.getMonth() === new Date().getMonth() &&
			currentDate.getFullYear() === new Date().getFullYear();

		calendarDays.push({
			dayNumber: isCurrentMonth ? dayNumber : null,
			isCurrentMonth,
			isToday,
			tasks: isCurrentMonth ? getTasksForDay(dayNumber) : []
		});
	}

	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder className={classes.calendarCard}>
			<Stack gap="md">
				{/* Calendar Header */}
				<Group justify="space-between" align="center">
					<Title order={2}>
						{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
					</Title>
					<Group gap="xs">
						<ActionIcon variant="default" size="lg" onClick={goToPreviousMonth} aria-label="Previous month">
							<IconChevronLeft size={18} />
						</ActionIcon>
						<ActionIcon variant="default" size="lg" onClick={goToNextMonth} aria-label="Next month">
							<IconChevronRight size={18} />
						</ActionIcon>
					</Group>
				</Group>

				{/* Calendar Grid */}
				<Box className={classes.calendarGrid}>
					{/* Week day headers */}
					{weekDays.map((day) => (
						<Paper key={day} className={classes.weekdayHeader} p="xs">
							<Text size="sm" fw={600} ta="center">
								{day}
							</Text>
						</Paper>
					))}

					{/* Calendar days */}
					{calendarDays.map((day, index) => {
						const isSelected = selectedDate && 
							day.dayNumber === selectedDate.getDate() && 
							currentDate.getMonth() === selectedDate.getMonth() && 
							currentDate.getFullYear() === selectedDate.getFullYear();

						return (
							<Paper
								key={index}
								className={`${classes.calendarDay} ${!day.isCurrentMonth ? classes.otherMonth : ''} ${day.isToday ? classes.today : ''} ${isSelected ? classes.selected : ''}`}
								onClick={() => {
									if (day.dayNumber) {
										setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day.dayNumber));
									}
								}}
								withBorder
								p="xs"
							>
								{day.dayNumber && (
									<>
										<Text size="sm" fw={day.isToday ? 700 : 500} mb="xs" className={classes.dayNumber}>
											{day.dayNumber}
										</Text>
										
										{/* Desktop view: Show task badges */}
										<Stack gap={4} className={classes.taskListDesktop}>
											{day.tasks.map((task) => {
												const taskDate = new Date(task.date);
												const hours = taskDate.getHours();
												const minutes = taskDate.getMinutes();
												const ampm = hours >= 12 ? 'PM' : 'AM';
												const displayHours = hours % 12 || 12;
												const displayMinutes = minutes.toString().padStart(2, '0');
												const timeString = `${displayHours}:${displayMinutes} ${ampm}`;

												return (
													<UnstyledButton
														key={task.id}
														className={classes.taskBadge}
														onClick={(e) => {
															e.stopPropagation();
															onTaskClick?.(task);
														}}
													>
														<Box
															className={classes.taskBadgeContent}
															style={{
																backgroundColor: `${getTaskColor(task)}15`,
																borderLeft: `3px solid ${getTaskColor(task)}`
															}}
														>
															<Group justify="space-between" align="center" gap="xs" wrap="nowrap">
																<Text size="xs" fw={500} className={classes.taskName}>
																	{task.name}
																</Text>
																<Text size="xs" c="dimmed" className={classes.taskTime}>
																	{timeString}
																</Text>
															</Group>
														</Box>
													</UnstyledButton>
												);
											})}
										</Stack>

										{/* Mobile view: Show colored dots */}
										<Group gap={4} className={classes.taskDotsMobile} justify="center">
											{day.tasks.slice(0, 3).map((task) => (
												<Box
													key={task.id}
													className={classes.taskDot}
													style={{ backgroundColor: getTaskColor(task) }}
												/>
											))}
											{day.tasks.length > 3 && (
												<Text size="xs" c="dimmed" className={classes.moreIndicator}>
													+{day.tasks.length - 3}
												</Text>
											)}
										</Group>
									</>
								)}
							</Paper>
						);
					})}
				</Box>

				{/* Mobile task list for selected date */}
				{selectedDate && (
					<Box className={classes.selectedDateTasks}>
						<Title order={3} mb="sm">
							{monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
						</Title>
						{(() => {
							const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
							const tasksForDay = tasksByDate[dateKey] || [];
							
							if (tasksForDay.length === 0) {
								return <Text c="dimmed" size="sm">No events</Text>;
							}

							return (
								<Stack gap="xs">
									<Text size="sm" c="dimmed">{tasksForDay.length} event{tasksForDay.length !== 1 ? 's' : ''}</Text>
									{tasksForDay.map((task) => {
										const taskDate = new Date(task.date);
										const hours = taskDate.getHours();
										const minutes = taskDate.getMinutes();
										const ampm = hours >= 12 ? 'PM' : 'AM';
										const displayHours = hours % 12 || 12;
										const displayMinutes = minutes.toString().padStart(2, '0');
										const timeString = `${displayHours}:${displayMinutes} ${ampm}`;

										return (
											<UnstyledButton
												key={task.id}
												className={classes.selectedTaskItem}
												onClick={() => onTaskClick?.(task)}
											>
												<Box
													className={classes.selectedTaskContent}
													style={{
														backgroundColor: `${getTaskColor(task)}15`,
														borderLeft: `3px solid ${getTaskColor(task)}`
													}}
												>
													<Group justify="space-between" align="center" wrap="nowrap">
														<Text size="sm" fw={500}>
															{task.name}
														</Text>
														<Text size="sm" c="dimmed">
															{timeString}
														</Text>
													</Group>
												</Box>
											</UnstyledButton>
										);
									})}
								</Stack>
							);
						})()}
					</Box>
				)}
			</Stack>
		</Card>
	);
}
