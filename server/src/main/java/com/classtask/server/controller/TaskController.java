package com.classtask.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.classtask.server.entity.Task;
import com.classtask.server.entity.User;
import com.classtask.server.request.TaskRequest;
import com.classtask.server.service.TaskService;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks(@AuthenticationPrincipal User user) {
        return taskService.getTasksForUser(user);
    }

    @GetMapping("/{taskId}")
    public Task getTask(@PathVariable String taskId, @AuthenticationPrincipal User user) {
        return taskService.getTaskByIdAndUser(taskId, user);
    }

    @PostMapping
    public Task createTask(@RequestBody TaskRequest taskRequest, @AuthenticationPrincipal User user) {
        return taskService.createTask(taskRequest, user);
    }

    @PatchMapping("/{taskId}")
    public Task updateTask(
            @PathVariable String taskId,
            @RequestBody TaskRequest updatedTask,
            @AuthenticationPrincipal User user) {
        return taskService.updateTask(taskId, updatedTask, user);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable String taskId, @AuthenticationPrincipal User user) {
        taskService.deleteTask(taskId, user);
    }
}

