package com.time13.techcontentclassifier.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object (DTO) para retorno de conteúdos já classificados e persistidos,
 * usado pelo endpoint de consulta (GET /conteudo).
 *
 * Diferente de {@link ConteudoResponseDTO} (contrato fixo do edital para o POST /conteudo),
 * este DTO expõe também os campos originais do conteúdo (id, título, texto e data de criação),
 * necessários para telas de listagem/detalhe no frontend.
 *
 * @param id Identificador do registro persistido
 * @param titulo Título original enviado na classificação
 * @param texto Texto original enviado na classificação
 * @param categoria Categoria identificada pelo modelo de IA
 * @param probabilidade Grau de confiança do modelo na classificação feita (0.0 a 1.0)
 * @param informacoesAdicionais Tags e termos adicionais identificados sobre o conteúdo
 * @param criadoEm Data e hora em que o conteúdo foi classificado e persistido
 */
public record ConteudoHistoricoDTO(
        Long id,
        String titulo,
        String texto,
        @JsonProperty("categoria") String categoria,
        double probabilidade,
        @JsonProperty("informacoes_adicionais") List<String> informacoesAdicionais,
        @JsonProperty("criado_em") LocalDateTime criadoEm
) {
}
