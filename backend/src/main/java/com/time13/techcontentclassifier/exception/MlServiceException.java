package com.time13.techcontentclassifier.exception;

public class MlServiceException extends RuntimeException {
    public MlServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
