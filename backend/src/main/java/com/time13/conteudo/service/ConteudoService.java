package com.time13.conteudo.service;

import com.time13.conteudo.dto.*;
import com.time13.conteudo.entity.Conteudo;
import com.time13.conteudo.mapper.ConteudoMapper;
import com.time13.conteudo.repository.ConteudoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ConteudoService {
    private static final Logger log = LoggerFactory.getLogger(ConteudoService.class); //importado do grupo
    private final ConteudoRepository conteudoRepository;
    private final ClassificadorService classificadorService; //importado do grupo
    private final ConteudoMapper conteudoMapper; //importado do grupo

    //importado do grupo
    public ConteudoService(ConteudoRepository conteudoRepository,
                           ClassificadorService classificadorService,
                           ConteudoMapper conteudoMapper) {
        this.conteudoRepository = conteudoRepository;
        this.classificadorService = classificadorService;
        this.conteudoMapper = conteudoMapper;
    }

    //importado do grupo
    /**
     * Coordena o caso de uso completo: classifica o texto e responde ao cliente.
     * A persistência é melhor-esforço (seção 3.5 do doc): uma falha ao salvar não
     * pode impedir a resposta da classificação, que já foi calculada com sucesso.
     */
    public ConteudoResponseDTO classificar(ConteudoRequestDTO request) {
        ConteudoResponseDTO resposta = classificadorService.classificar(request);

        try {
            Conteudo conteudo = conteudoMapper.toEntity(request, resposta);
            conteudoRepository.save(conteudo);
        } catch (Exception e) {
            log.error("Falha ao persistir conteudo classificado (best-effort, resposta segue normalmente)", e);
        }

        return resposta;
    }
}