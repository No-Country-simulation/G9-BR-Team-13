package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.entity.Conteudo;
import com.time13.techcontentclassifier.mapper.ConteudoMapper;
import com.time13.techcontentclassifier.repository.ConteudoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConteudoService {
    private static final Logger log = LoggerFactory.getLogger(ConteudoService.class);

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

    /**
     * Busca conteúdos já processados que contenham a palavra-chave informada
     * no título, texto, categoria ou informações adicionais.
     */
    public List<ConteudoResponseDTO> buscarPorPalavraChave(String termo) {
        List<Conteudo> resultados = conteudoRepository.buscarPorPalavraChave(termo);
        return resultados.stream()
                .map(conteudoMapper::toResponseDTO)
                .toList();
    }
}
