package com.classtask.server.request;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class TaskRequest {
    private Timestamp date;
    private String name;
    private String description;
    private String color;
    private int type;
    private String courseId;
    private boolean completed;
}
