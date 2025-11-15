package com.classtask.server.entity;

import java.io.Serializable;
import java.sql.Timestamp;

import java.util.List;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.OrderBy;
import lombok.Data;

@Data
@Entity
@Table(name = "courses")
public class Course implements Serializable {
    @Id
    private String id;

    @Column(name = "color")
    private String color;

    @Column(name = "name")
    private String name;

    @Column(name = "code")
    private String code;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "created_time")
    private Timestamp createdTime;

    @Column(name = "last_modified_time")
    private Timestamp lastModifiedTime;

    @OneToMany
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    @OrderBy("date ASC, createdTime ASC")
    private List<Task> tasks;
}
