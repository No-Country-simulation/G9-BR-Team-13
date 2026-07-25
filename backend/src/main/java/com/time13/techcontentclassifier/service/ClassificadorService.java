package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;

/**
 * Contrato de interface da estratégia de classificação de conteúdo.
 * 
 * Permite flexibilidade de arquitetura (Padrão Strategy), possibilitando alternar entre
 * uma implementação mock/estática e uma chamada real de API de Machine Learning sem afetar
 * a camada de Controller ou a regra de persistência.
 */
public interface ClassificadorService {

    /**
     * Realiza o envio do conteúdo para classificação e retorna o resultado obtido.
     * 
     * @param request DTO com o título e texto do conteúdo
     * @return DTO com a categoria prevista, probabilidade e tags sugeridas
     */
    ConteudoResponseDTO classificar(ConteudoRequestDTO request);
}

