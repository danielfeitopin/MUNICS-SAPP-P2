package com.tasks.business.exceptions;

public class InvalidStateException extends Exception {

    private static final long serialVersionUID = 5966970242879415538L;

    public InvalidStateException(String message) {
        super(message);
    }

}
