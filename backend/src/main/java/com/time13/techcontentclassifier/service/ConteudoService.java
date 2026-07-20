package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.*;
import com.time13.techcontentclassifier.entity.Conteudo;
import com.time13.techcontentclassifier.entity.Tags;
import com.time13.techcontentclassifier.mapper.ConteudoMapper;
import com.time13.techcontentclassifier.repository.ConteudoRepository;
import com.time13.techcontentclassifier.repository.TagsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConteudoService {
    private static final Logger log = LoggerFactory.getLogger(ConteudoService.class); //importado do grupo
    private final ConteudoRepository conteudoRepository;
    private final ClassificadorService classificadorService; //importado do grupo
    private final ConteudoMapper conteudoMapper; //importado do grupo
    private final TagsRepository tagsRepository;

    //importado do grupo
    public ConteudoService(ConteudoRepository conteudoRepository,
                           ClassificadorService classificadorService,
                           ConteudoMapper conteudoMapper, TagsRepository tagsRepository) {
        this.conteudoRepository = conteudoRepository;
        this.classificadorService = classificadorService;
        this.conteudoMapper = conteudoMapper;
        this.tagsRepository = tagsRepository; //acrescentei o tagsRepository
    }

    //persistência das Tags para saber se existem e depois salvar
    private List<Tags> obterOuCriarTags(List<Tags> tags) {
        List<Tags> resultado = new ArrayList<>();

        for (Tags tag : tags) {
            Tags persistida = tagsRepository.findByNome(tag.getNome())
                    .orElseGet(() -> tagsRepository.save(tag));
            resultado.add(persistida);
        }
        return resultado;
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
            conteudo.setTagsSugeridas(
                    obterOuCriarTags(conteudo.getTagsSugeridas())
            );
            conteudoRepository.save(conteudo);
        } catch (Exception e) {
            log.error("Falha ao persistir conteudo classificado (best-effort, resposta segue normalmente)", e);
        }

        return resposta;
    }
}