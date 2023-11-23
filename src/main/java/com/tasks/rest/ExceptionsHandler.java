package com.tasks.rest;

import com.tasks.business.exceptions.DuplicatedResourceException;
import com.tasks.business.exceptions.InalidStateException;
import com.tasks.business.exceptions.InstanceNotFoundException;
import com.tasks.rest.json.ErrorDetailsResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class ExceptionsHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(ExceptionsHandler.class);

    @ExceptionHandler(InstanceNotFoundException.class)
    public final ResponseEntity<ErrorDetailsResponse> handleInstanceNotFoundException(
        InstanceNotFoundException ex, WebRequest request) {
        logger.warn(ex.getMessage(), ex);
        ErrorDetailsResponse errorDetails = new ErrorDetailsResponse(System.currentTimeMillis(), "Not Found", 
        ex.getMessage(), null, request.getContextPath(), 404);
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(InalidStateException.class)
    public final ResponseEntity<ErrorDetailsResponse> handleInvalidStateException(
        InalidStateException ex, WebRequest request) {
        logger.warn(ex.getMessage(), ex);
        ErrorDetailsResponse errorDetails = new ErrorDetailsResponse(System.currentTimeMillis(), "Invalid State", 
        ex.getMessage(), null, request.getContextPath(), 404);
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(DuplicatedResourceException.class)
    public final ResponseEntity<ErrorDetailsResponse> handleDuplicatedResourceException(
        DuplicatedResourceException ex, WebRequest request) {
        logger.warn(ex.getMessage(), ex);
        ErrorDetailsResponse errorDetails = new ErrorDetailsResponse(System.currentTimeMillis(), "Duplicated Resource", 
        ex.getMessage(), null, request.getContextPath(), 404);
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }
}
