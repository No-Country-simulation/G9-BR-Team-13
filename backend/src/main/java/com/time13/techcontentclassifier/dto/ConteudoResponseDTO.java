package com.time13.techcontentclassifier.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record ConteudoResponseDTO(
        @JsonProperty("categoria") String categoria,
        double probabilidade,
        @JsonProperty("informacoes_adicionais") List<String> informacoesAdicionais
){
}

