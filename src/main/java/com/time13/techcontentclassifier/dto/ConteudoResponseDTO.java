package com.time13.techcontentclassifier.dto;

import java.util.List;

public record ConteudoResponseDTO(
        String categoria,
        Double probabilidade,
        List<String> informacoesAdicionais
){
}

