package com.time13.techcontentclassifier.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Manipulador global de exceções (@RestControllerAdvice).
 * 
 * Captura exceções lançadas durante o processamento de requisições HTTP
 * e formata respostas de erro padronizadas em JSON para o cliente.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Trata erros de validação de campos anotados com @Valid nos DTOs.
     * 
     * @param ex Exceção disparada quando um argumento de método não cumpre os critérios de validação
     * @return Mapa com o nome do campo e a mensagem de erro correspondente (HTTP 400 Bad Request)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RespostaErros> tratarValidacao(MethodArgumentNotValidException ex) {
        List<RespostaErros.FieldErrorDetail> campoErros = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(erro -> new RespostaErros.FieldErrorDetail(
                        erro.getField(),
                        erro.getDefaultMessage()))
                .toList();

        RespostaErros error = new RespostaErros(
                HttpStatus.BAD_REQUEST.value(),
                "Erro de Validação",
                "Um ou mais campos contêm valores inválidos.",
                campoErros
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Trata exceções ocorridas ao se comunicar com o serviço externo de Machine Learning.
     * 
     * @param ex Exceção personalizada MlServiceException
     * @return JSON estruturado indicando indisponibilidade do serviço de IA (HTTP 503 Service Unavailable)
     */
    @ExceptionHandler(MlServiceException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Map<String, String> tratarErroServicoIa(MlServiceException ex) {
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", "ML_SERVICE_UNAVAILABLE");
        erro.put("mensagem", ex.getMessage());
        return erro;
    }
}


