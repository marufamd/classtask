package com.classtask.server.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classtask.server.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByUserId(String userId);

    Optional<Course> findByIdAndUserId(String id, String userId);
}
