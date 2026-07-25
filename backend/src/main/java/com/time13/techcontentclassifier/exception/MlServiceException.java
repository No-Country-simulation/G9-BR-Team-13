package com.time13.techcontentclassifier.exception;

/**
 * Exceção personalizada lançada quando ocorre alguma falha de comunicação ou timeout
 * com o serviço externo de Machine Learning / IA.
 */
public class MlServiceException extends RuntimeException {
    public MlServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

