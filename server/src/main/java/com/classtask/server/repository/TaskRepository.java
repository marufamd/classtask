package com.classtask.server.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classtask.server.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByUserIdOrderByDateAsc(String userId);

    List<Task> findByUserIdOrderByDateAscCreatedTimeAsc(String userId);

    Optional<Task> findByIdAndUserId(String id, String userId);
}
