package com.time13.techcontentclassifier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConteudoRequestDTO(

        @NotBlank(message = "O título não pode estar em branco.")
        @Size(min = 5, max = 200, message = "O título deve ter entre {min} e {max} caracteres.")
        String titulo,

        @NotBlank(message = "O texto técnico não pode estar vazio.")
        @Size(min = 20, message = "O texto deve ter pelo menos {min} caracteres para uma análise precisa.")
        String texto
) {
}
