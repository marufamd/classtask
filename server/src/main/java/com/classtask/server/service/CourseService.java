package com.classtask.server.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.classtask.server.entity.Course;
import com.classtask.server.entity.User;
import com.classtask.server.repository.CourseRepository;
import com.classtask.server.request.CourseRequest;
import com.classtask.server.util.DataNotFoundException;
import com.classtask.server.util.Util;

import jakarta.transaction.Transactional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Transactional
    public List<Course> getCoursesForUser(User user) {
        return courseRepository.findByUserId(user.getId());
    }

    public Course getCourseByIdAndUser(String courseId, User user) {
        return courseRepository.findByIdAndUserId(courseId, user.getId())
                .orElseThrow(() -> new DataNotFoundException("Course", courseId));
    }

    public Course createCourse(CourseRequest courseRequest, User user) {
        Course course = new Course();

        course.setId(Util.randomId());
        course.setUserId(user.getId());
        course.setName(courseRequest.getName());
        course.setCode(courseRequest.getCode());
        course.setCreatedTime(new Timestamp(System.currentTimeMillis()));
        course.setLastModifiedTime(new Timestamp(System.currentTimeMillis()));

        Optional.ofNullable(courseRequest.getColor()).ifPresent(course::setColor);

        return courseRepository.save(course);
    }

    public Course updateCourse(String courseId, CourseRequest updatedCourse, User user) {
        Course existingCourse = getCourseByIdAndUser(courseId, user);

        Optional.ofNullable(updatedCourse.getName()).ifPresent(existingCourse::setName);
        Optional.ofNullable(updatedCourse.getCode()).ifPresent(existingCourse::setCode);
        Optional.ofNullable(updatedCourse.getColor()).ifPresent(existingCourse::setColor);

        existingCourse.setLastModifiedTime(new Timestamp(System.currentTimeMillis()));

        return courseRepository.save(existingCourse);
    }

    public void deleteCourse(String courseId, User user) {
        Course course = getCourseByIdAndUser(courseId, user);
        courseRepository.delete(course);
    }
}


