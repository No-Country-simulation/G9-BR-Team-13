package com.time13.conteudo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ConteudoRelacionadoDTO(
        @JsonProperty("id_relacionado") String idRelacionado,
        String titulo,
        @JsonProperty("score_similaridade") Double scoreSimilaridade
) {}