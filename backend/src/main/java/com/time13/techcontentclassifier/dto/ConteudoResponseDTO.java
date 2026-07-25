package com.time13.techcontentclassifier.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Data Transfer Object (DTO) para retorno dos resultados da classificação de conteúdo.
 * 
 * Utiliza anotações do Jackson (@JsonProperty) para alinhar a nomenclatura dos campos no JSON
 * retornado ao frontend ou recebido do serviço de Machine Learning.
 * 
 * @param categoria Categoria principal identificada pelo modelo de IA (ex: "Front-end", "DevOps")
 * @param probabilidade Percentual/grau de confiança do modelo na classificação feita (0.0 a 1.0)
 * @param informacoesAdicionais Tags e termos adicionais identificados sobre o conteúdo
 */
public record ConteudoResponseDTO(
        @JsonProperty("categoria") String categoria,
        double probabilidade,
        @JsonProperty("informacoes_adicionais") List<String> informacoesAdicionais
){
}


