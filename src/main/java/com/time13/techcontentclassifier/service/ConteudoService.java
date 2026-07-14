package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.entity.Conteudo;
import com.time13.techcontentclassifier.mapper.ConteudoMapper;
import com.time13.techcontentclassifier.repository.ConteudoRepository;
import org.springframework.stereotype.Service;

@Service
public class ConteudoService {
    private final ConteudoRepository conteudoRepository;
    private final ClassificadorService classificadorService;
    private final ConteudoMapper conteudoMapper;

    public ConteudoService(ConteudoRepository conteudoRepository,
                           ClassificadorService classificadorService,
                           ConteudoMapper conteudoMapper) {
        this.conteudoRepository = conteudoRepository;
        this.classificadorService = classificadorService;
        this.conteudoMapper = conteudoMapper;
    }

    /**
     * Coordena o caso de uso completo: classifica o texto, converte o resultado para
     * o modelo persistente e salva o conteúdo antes de responder ao cliente.
     */
    public ConteudoResponseDTO classificar(ConteudoRequestDTO request) {
        ConteudoResponseDTO resposta = classificadorService.classificar(request);
        Conteudo conteudo = conteudoMapper.toEntity(request, resposta);
        conteudoRepository.save(conteudo);
        return resposta;
    }
}
