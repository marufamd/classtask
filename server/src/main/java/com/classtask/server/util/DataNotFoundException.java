package com.classtask.server.util;

public class DataNotFoundException extends RuntimeException {
    public DataNotFoundException(String entityName, String id) {
        super(entityName + " with ID " + id + " not found");
    }
}
