package com.time13.techcontentclassifier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object (DTO) para envio de requisição de classificação de conteúdo.
 * 
 * Contém regras de validação Bean Validation (@NotBlank, @Size) ativadas via @Valid no Controller.
 * 
 * @param titulo Título do artigo ou postagem (obrigatório, 3 a 200 caracteres)
 * @param texto Texto/corpo do conteúdo a ser classificado (obrigatório, 20 a 5000 caracteres)
 */
public record ConteudoRequestDTO (

        @NotBlank(message = "O título é obrigatório")
        @Size(min = 3, max = 200, message = "O título deve ter entre 3 e 200 caracteres")
        String titulo,

        @NotBlank(message = "O texto é obrigatório")
        @Size(min = 20, max = 5000, message = "O texto deve ter entre 20 e 5000 caracteres")
        String texto
){
}

