package com.tasks.business.exceptions;

public class PermissionException extends Exception{
    public PermissionException() {
        super("Not allowed");
    }
}
