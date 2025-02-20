package com.classtask.server.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.classtask.server.entity.Task;
import com.classtask.server.entity.User;
import com.classtask.server.repository.TaskRepository;
import com.classtask.server.request.TaskRequest;
import com.classtask.server.util.DataNotFoundException;
import com.classtask.server.util.Util;

import jakarta.transaction.Transactional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Transactional
    public List<Task> getTasksForUser(User user) {
        return taskRepository.findByUserId(user.getId());
    }

    public Task getTaskByIdAndUser(String taskId, User user) {
        return taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new DataNotFoundException("Task", taskId));
    }

    public Task createTask(TaskRequest taskRequest, User user) {
        Task task = new Task();

        task.setId(Util.randomId());
        task.setUserId(user.getId());
        task.setName(taskRequest.getName());
        task.setDate(taskRequest.getDate());
        task.setCreatedTime(new Timestamp(System.currentTimeMillis()));
        task.setLastModifiedTime(new Timestamp(System.currentTimeMillis()));
        task.setCompleted(false);

        Optional.ofNullable(taskRequest.getDescription()).ifPresent(task::setDescription);
        Optional.ofNullable(taskRequest.getColor()).ifPresent(task::setColor);
        Optional.ofNullable(taskRequest.getType()).ifPresent(task::setType);
        Optional.ofNullable(taskRequest.getCourseId()).ifPresent(task::setCourseId);

        return taskRepository.save(task);
    }

    public Task updateTask(String taskId, TaskRequest updatedTask, User user) {
        Task existingTask = getTaskByIdAndUser(taskId, user);

        Optional.ofNullable(updatedTask.getName()).ifPresent(existingTask::setName);
        Optional.ofNullable(updatedTask.getDescription()).ifPresent(existingTask::setDescription);
        Optional.ofNullable(updatedTask.getDate()).ifPresent(existingTask::setDate);
        Optional.ofNullable(updatedTask.getColor()).ifPresent(existingTask::setColor);
        Optional.ofNullable(updatedTask.getType()).ifPresent(existingTask::setType);
        Optional.ofNullable(updatedTask.getCourseId()).ifPresent(existingTask::setCourseId);
        Optional.ofNullable(updatedTask.isCompleted()).ifPresent(existingTask::setCompleted);

        existingTask.setLastModifiedTime(new Timestamp(System.currentTimeMillis()));

        return taskRepository.save(existingTask);
    }

    public void deleteTask(String taskId, User user) {
        Task task = getTaskByIdAndUser(taskId, user);
        taskRepository.delete(task);
    }
}
