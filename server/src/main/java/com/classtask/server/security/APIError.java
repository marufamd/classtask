package com.classtask.server.security;

public class APIError {
    private final String message;
    private final int status;

    public APIError(String message, int status) {
        this.message = message;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public int getStatus() {
        return status;
    }

    @Override
    public String toString() {
        return "APIError{" +
                "message='" + message + '\'' +
                ", status=" + status +
                '}';
    }
}

