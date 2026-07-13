package com.time13.conteudo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ConteudoRequestDTO(

        @NotBlank(message = "O título não pode estar em branco.")
        @Size(min = 5, max = 200, message = "O título deve ter entre {min} e {max} caracteres.")
        String titulo,

        @NotBlank(message = "O texto técnico não pode estar vazio.")
        @Size(min = 20, message = "O texto deve ter pelo menos {min} caracteres para uma análise precisa.")
        String texto,

        @NotBlank(message = "O autor é obrigatório.")
        String autor,

        @NotNull(message = "O tipo de documento deve ser informado.")
        @JsonProperty("tipo_documento")
        TipoDocumento tipoDocumento
) {
}
