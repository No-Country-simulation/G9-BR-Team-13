package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.entity.Conteudo;
import com.time13.techcontentclassifier.mapper.ConteudoMapper;
import com.time13.techcontentclassifier.repository.ConteudoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
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

    public ConteudoResponseDTO classificar(ConteudoRequestDTO request) {

        // Classifica o conteúdo
        ConteudoResponseDTO resposta =
                classificadorService.classificar(request);

        // Converte para entidade
        Conteudo conteudo =
                conteudoMapper.toEntity(request, resposta);

        // Melhor esforço para persistência
        try {

            conteudoRepository.save(conteudo);

            log.info("Conteúdo salvo com sucesso.");

        } catch (Exception e) {

            log.error("Erro ao salvar conteúdo no banco.", e);

        }

        return resposta;
    }
}
