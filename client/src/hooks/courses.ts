import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Course, CoursePayload, QueryError } from '../util/interfaces';
import { fetchAPI } from '../util/util';

export function useQueryCourses(enabled: boolean) {
	return useQuery<Course[], QueryError>({ queryKey: ['courses'], queryFn: () => fetchAPI<Course[]>('/courses'), enabled });
}

export function useQueryCourse(courseId?: string) {
	return useQuery<Course, QueryError>({
		queryKey: ['courses', courseId],
		queryFn: () => fetchAPI<Course>(`/courses/${courseId}`),
		enabled: Boolean(courseId)
	});
}

export function useCreateCourse() {
	const client = useQueryClient();

	return useMutation<Course, QueryError, Partial<CoursePayload>>({
		mutationFn: (payload) => {
			return fetchAPI<Course>('/courses', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['courses'] });
		}
	});
}

export function useUpdateCourse(courseId?: string) {
	const client = useQueryClient();

	return useMutation<Course, QueryError, Partial<CoursePayload>>({
		mutationFn: (payload) => {
			return fetchAPI<Course>(`/courses/${courseId}`, {
				method: 'PATCH',
				body: JSON.stringify(payload)
			});
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['courses'] });
		}
	});
}

export function useDeleteCourse(courseId: string) {
	const client = useQueryClient();

	return useMutation<Course, QueryError, unknown>({
		mutationFn: () => {
			return fetchAPI<Course>(`/courses/${courseId}`, {
				method: 'DELETE'
			});
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['courses'] });
		}
	});
}
