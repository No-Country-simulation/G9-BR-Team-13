package com.time13.conteudo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record ConteudoResponseDTO(
        @JsonProperty("categoria") String categoriaPrincipal,
        Double probabilidade,
        @JsonProperty("informacoes_adicionais") List<String> informacoesAdicionais,
        @JsonProperty("tags_sugeridas") List<String> tagsSugeridas
) {}