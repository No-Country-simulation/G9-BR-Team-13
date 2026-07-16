package com.time13.conteudo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record ConteudoResponseDTO(
        @JsonProperty("categoria") String categoria,
        Double probabilidade,
        @JsonProperty("informacoes_adicionais") List<String> informacoesAdicionais
) {
}