package com.tasks.config;

public class TokenException extends RuntimeException {

    public TokenException() {
        super("Token is not valid");
    }
}
