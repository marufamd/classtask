package com.classtask.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.classtask.server.security.APIError;
import com.classtask.server.util.DataNotFoundException;
import com.classtask.server.util.Logger;

@ControllerAdvice
public class GlobalExceptionHandler {
    @Autowired
    private Logger logger;

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<APIError> handleIllegalArgument(IllegalArgumentException ex) {
        APIError error = new APIError(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        logger.error(ex);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataNotFoundException.class)
    public ResponseEntity<APIError> handleDataException(DataNotFoundException ex) {
        APIError error = new APIError(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIError> handleGenericException(Exception ex) {
        APIError error = new APIError("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR.value());
        logger.error(ex);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

