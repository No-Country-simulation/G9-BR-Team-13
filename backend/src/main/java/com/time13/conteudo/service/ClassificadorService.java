package com.time13.conteudo.service;

import com.time13.conteudo.dto.ConteudoRequestDTO;
import com.time13.conteudo.dto.ConteudoResponseDTO;

/**
 * Contrato da estratégia de classificação. Permite substituir o retorno estático
 * por uma integração real sem alterar o controller nem o fluxo de persistência.
 */
public interface ClassificadorService {
    ConteudoResponseDTO classificar(ConteudoRequestDTO request);
}
