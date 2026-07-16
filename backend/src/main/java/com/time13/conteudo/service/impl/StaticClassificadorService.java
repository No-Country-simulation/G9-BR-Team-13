package com.time13.conteudo.service.impl;

import com.time13.conteudo.dto.ConteudoRequestDTO;
import com.time13.conteudo.dto.ConteudoResponseDTO;
import com.time13.conteudo.service.ClassificadorService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação temporária usada para validar o contrato do endpoint enquanto o
 * mecanismo definitivo de classificação ainda não está integrado.
 */
@Service
public class StaticClassificadorService implements ClassificadorService {
    @Override
    public ConteudoResponseDTO classificar(ConteudoRequestDTO request) {
        return new ConteudoResponseDTO(
                "Backend",
                0.98,
                List.of("Java", "Spring Boot", "API REST")
        );
    }
}
