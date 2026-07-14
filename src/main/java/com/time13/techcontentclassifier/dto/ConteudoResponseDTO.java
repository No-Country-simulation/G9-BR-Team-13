package com.time13.techcontentclassifier.dto;

import java.util.List;

public record ConteudoResponseDTO(
        String categoria,
        double probabilidade,
        List<String> informacoesAdicionais
){
}

