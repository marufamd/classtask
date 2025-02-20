package com.classtask.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.classtask.server.entity.Course;
import com.classtask.server.entity.User;
import com.classtask.server.request.CourseRequest;
import com.classtask.server.service.CourseService;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<Course> getAllCourses(@AuthenticationPrincipal User user) {
        return courseService.getCoursesForUser(user);
    }

    @GetMapping("/{courseId}")
    public Course getCourse(@PathVariable String courseId, @AuthenticationPrincipal User user) {
        return courseService.getCourseByIdAndUser(courseId, user);
    }

    @PostMapping
    public Course createCourse(@RequestBody CourseRequest courseRequest, @AuthenticationPrincipal User user) {
        return courseService.createCourse(courseRequest, user);
    }

    @PatchMapping("/{courseId}")
    public Course updateCourse(
            @PathVariable String courseId,
            @RequestBody CourseRequest updatedCourse,
            @AuthenticationPrincipal User user) {
        return courseService.updateCourse(courseId, updatedCourse, user);
    }

    @DeleteMapping("/{courseId}")
    public void deleteCourse(@PathVariable String courseId, @AuthenticationPrincipal User user) {
        courseService.deleteCourse(courseId, user);
    }
}

