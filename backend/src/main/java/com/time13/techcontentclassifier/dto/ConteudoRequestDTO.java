package com.time13.techcontentclassifier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConteudoRequestDTO (

        @NotBlank(message = "O título é obrigatório")
        @Size(min = 3, max = 200, message = "O título deve ter entre 3 e 200 caracteres")
        String titulo,

        @NotBlank(message = "O texto é obrigatório")
        @Size(min = 20, max = 5000, message = "O texto deve ter entre 20 e 5000 caracteres")
        String texto
){
}
