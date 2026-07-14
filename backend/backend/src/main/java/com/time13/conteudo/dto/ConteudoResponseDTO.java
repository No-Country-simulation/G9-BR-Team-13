package com.time13.conteudo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record ConteudoResponseDTO(
        @JsonProperty("id_conteudo") Long idConteudo,
        ClassificacaoDTO classificacao,
        @JsonProperty("resumo_automatico") String resumoAutomatico,
        @JsonProperty("conteudos_relacionados") List<ConteudoRelacionadoDTO> conteudosRelacionados
) {}