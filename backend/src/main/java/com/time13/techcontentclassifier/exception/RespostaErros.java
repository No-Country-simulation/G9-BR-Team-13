package com.time13.techcontentclassifier.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Estrutura padronizada para retornos de erro da API.
 */
@JsonInclude(JsonInclude.Include.NON_NULL) // Omite a lista de 'erros' quando for null (ex: nos erros 415 e 500)
public record RespostaErros(
        int status,
        String titulo,
        String mensagem,
        LocalDateTime timestamp,
        List<FieldErrorDetail> erros
) {
    public RespostaErros(int status, String titulo, String mensagem) {
        this(status, titulo, mensagem, LocalDateTime.now(), null);
    }

    public RespostaErros(int status, String titulo, String mensagem, List<FieldErrorDetail> erros) {
        this(status, titulo, mensagem, LocalDateTime.now(), erros);
    }

    /**
     * Detalhamento de erros em campos específicos (usado no 400 Bad Request).
     */
    public record FieldErrorDetail(String campo, String mensagem) {}
}
