package com.time13.techcontentclassifier.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ExplicabilidadeDTO(
        @JsonProperty("termo") String termo,
        @JsonProperty("peso") double peso
) {
}