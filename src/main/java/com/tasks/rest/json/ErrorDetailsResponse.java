package com.tasks.rest.json;

public class ErrorDetailsResponse {
    
    private Long timestamp;
    private String error;
    private String message;
    private String details;
    private String path;
    private Integer status;

    public ErrorDetailsResponse(Long timestamp, String error, String message, String details, String path, Integer status) {
        this.timestamp = timestamp;
        this.error = error;
        this.message = message;
        this.details = details;
        this.path = path;
        this.status = status;
    }
    
    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
    
    
    
}
