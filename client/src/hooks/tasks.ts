import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryError, Task, TaskPayload } from '../util/interfaces';
import { fetchAPI } from '../util/util';

export function useQueryTasks() {
	return useQuery<Task[], QueryError>({ queryKey: ['tasks'], queryFn: () => fetchAPI<Task[]>('/tasks') });
}

export function useQueryTask(taskId?: string) {
	return useQuery<Task, QueryError>({
		queryKey: ['tasks', taskId],
		queryFn: () => fetchAPI<Task>(`/tasks/${taskId}`),
		enabled: Boolean(taskId)
	});
}

export function useCreateTask() {
	const client = useQueryClient();

	return useMutation<Task, QueryError, Partial<TaskPayload>>({
		mutationFn: (payload) => {
			return fetchAPI<Task>('/tasks', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['tasks'] });
		}
	});
}

export function useUpdateTask() {
	const client = useQueryClient();

	return useMutation<Task, QueryError, Partial<TaskPayload & { taskId: string }>>({
		mutationFn: ({ taskId, ...payload }) => {
			return fetchAPI<Task>(`/tasks/${taskId}`, {
				method: 'PATCH',
				body: JSON.stringify(payload)
			});
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['tasks'] });
		}
	});
}

export function useDeleteTask(taskId: string) {
	const client = useQueryClient();

	return useMutation<Task, QueryError, unknown>({
		mutationFn: () => {
			return fetchAPI<Task>(`/tasks/${taskId}`, {
				method: 'DELETE'
			});
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['tasks'] });
		}
	});
}
