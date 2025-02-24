/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Anchor, Badge, Checkbox, Group, Paper, ScrollArea, Select, SelectProps, Table } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { useQueryCourses } from '../../hooks/courses';
import { useQueryTasks, useUpdateTask } from '../../hooks/tasks';
import { columnData, taskTypes } from '../../util/constants';
import { Task, TaskType } from '../../util/interfaces';
import { formatDate, trim } from '../../util/util';
import TaskModal from '../modal/TaskModal';
import Display from './Display';

const colHelper = createColumnHelper<Task>();

const fallbackData: Task[] = [];

export default function TaskDisplay() {
	const navigate = useNavigate();
	const isMobile = useMediaQuery('(max-width: 768px)');

	const { data: tasks, isLoading: tasksLoading, error: taskError } = useQueryTasks();
	const { data: courses, isLoading: coursesLoading, error: courseError } = useQueryCourses(!tasksLoading);

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

	const { mutateAsync: updateTask } = useUpdateTask();

	const handleChange = async (taskId: string, props: Partial<Task>) => {
		try {
			await updateTask({ taskId, ...props });
		} catch (e: any) {
			notifications.show({
				title: 'Error',
				message: e?.message ?? 'An unknown error occurred',
				color: 'red'
			});

			console.error(e);
		}
	};

	const columns = useMemo(() => {
		return (Object.entries(columnData) as [keyof Task, string][]).map(([k, v]) => {
			const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => {
				const course = courses?.find((c) => c.id === option?.value);
				return (
					<Group flex="1" gap="xs">
						<Badge color={course?.color ?? 'var(--classtask-color)'} size="sm" circle />
						{option.label}
						{checked && <IconCheck style={{ marginInlineStart: 'auto' }} stroke={1.5} color="currentColor" opacity={0.6} size={18} />}
					</Group>
				);
			};

			if (k === 'completed') {
				return colHelper.accessor(k, {
					header: () => '',
					cell: (info) => {
						return (
							<Checkbox
								color="var(--classtask-color)"
								checked={info.getValue()}
								onChange={() => handleChange(info.cell.row.getValue('id'), { completed: !info.getValue() })}
							/>
						);
					}
				});
			}

			if (k === 'name') {
				return colHelper.accessor(k, {
					header: () => v,
					cell: (info) => (
						<Anchor component={Link} to={`/tasks/${info.cell.row.getValue('id')}`}>
							{trim(info.getValue(), 30)}
						</Anchor>
					)
				});
			}

			if (k === 'description') {
				return colHelper.accessor(k, {
					header: () => v,
					cell: (info) => trim(info.getValue(), 25)
				});
			}

			if (k === 'courseId') {
				return colHelper.accessor(k, {
					header: () => v,
					cell: (info) => {
						const course = courses?.find((c) => c.id === info.getValue());
						return !isMobile ? (
							<Select
								leftSection={<Badge color={course?.color ?? 'var(--classtask-color)'} size="xs" circle />}
								data={courses?.map((c) => ({ value: c.id, label: c.code })) ?? []}
								value={course?.id}
								onChange={(value) => handleChange(info.cell.row.getValue('id'), { courseId: value as string })}
								renderOption={renderSelectOption}
							/>
						) : course ? (
							<Badge style={{ fontFamily: 'sans-serif' }} color={course?.color ?? 'var(--classtask-color)'} size="md">
								{course?.code}
							</Badge>
						) : undefined;
					}
				});
			}

			if (k === 'date') {
				return colHelper.accessor(k, {
					header: () => v,
					cell: (info) => formatDate(info.getValue())
				});
			}

			if (k === 'type') {
				return colHelper.accessor(k, {
					header: () => v,
					cell: (info) => {
						return (
							<Select
								data={Object.entries(taskTypes).map(([k, v]) => ({ value: k, label: v }))}
								value={info.getValue().toString()}
								onChange={(value) => handleChange(info.cell.row.getValue('id'), { type: Number(value) as TaskType })}
							/>
						);
					}
				});
			}

			return colHelper.accessor(k, {
				header: () => v,
				cell: (info) => info.getValue()
			});
		});
	}, [coursesLoading, isMobile]);

	const data = useMemo(() => tasks, [tasks]);

	const [opened, { open, close }] = useDisclosure(false);

	const table = useReactTable({
		data: data ?? fallbackData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			columnVisibility: {
				color: false,
				id: false,
				userId: false,
				createdTime: false,
				lastModifiedTime: false,
				description: !isMobile,
				type: !isMobile
			}
		}
	});

	return (
		<>
			<TaskModal opened={opened} close={close} />
			<Display name="My Tasks" addFn={open} loading={tasksLoading || coursesLoading}>
				<Paper shadow="sm" mt={15}>
					<ScrollArea>
						<Table style={{ border: '1px solid var(--table-border-color)' }}>
							<Table.Thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<Table.Tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<Table.Th key={header.id}>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</Table.Th>
										))}
									</Table.Tr>
								))}
							</Table.Thead>
							<Table.Tbody>
								{table.getRowModel().rows.map((row) => (
									<Table.Tr
										key={row.id}
										style={{
											borderLeft: `3px solid ${row.getValue('color') ?? courses?.find((c) => c.id === row.getValue('courseId'))?.color ?? 'var(--classtask-color)'}`
										}}
									>
										{row.getVisibleCells().map((cell) => (
											<Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>
										))}
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</ScrollArea>
				</Paper>
			</Display>
		</>
	);
}
