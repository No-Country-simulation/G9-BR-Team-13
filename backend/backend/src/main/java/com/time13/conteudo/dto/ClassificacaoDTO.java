package com.time13.conteudo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record ClassificacaoDTO(
        @JsonProperty("categoria_principal") String categoriaPrincipal,
        Double probabilidade,
        @JsonProperty("tags_sugeridas") List<String> tagsSugeridas
) {}