package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
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

/**
 * Serviço responsável por orquestrar os casos de uso de conteúdo:
 * 1. Classificação de textos via Machine Learning e persistência em banco.
 * 2. Consulta de conteúdos por palavras-chave.
 */
@Service
public class ConteudoService {
    private static final Logger log = LoggerFactory.getLogger(ConteudoService.class);

    private final ConteudoRepository conteudoRepository;
    private final ClassificadorService classificadorService;
    private final ConteudoMapper conteudoMapper;
    private final TagsRepository tagsRepository;

    public ConteudoService(ConteudoRepository conteudoRepository,
                           ClassificadorService classificadorService,
                           ConteudoMapper conteudoMapper, 
                           TagsRepository tagsRepository) {
        this.conteudoRepository = conteudoRepository;
        this.classificadorService = classificadorService;
        this.conteudoMapper = conteudoMapper;
        this.tagsRepository = tagsRepository;
    }

    /**
     * Garante a reutilização ou criação das tags sugeridas no banco de dados.
     * Se a tag já existir pelo nome, ela é reutilizada; caso contrário, é persistida.
     */
    private List<Tags> obterOuCriarTags(List<Tags> tags) {
        List<Tags> resultado = new ArrayList<>();

        for (Tags tag : tags) {
            Tags persistida = tagsRepository.findByNome(tag.getNome())
                    .orElseGet(() -> tagsRepository.save(tag));
            resultado.add(persistida);
        }
        return resultado;
    }

    /**
     * Coordena o caso de uso completo de classificação:
     * - Envia o texto para a IA via `classificadorService`.
     * - Tenta persistir o resultado no banco de dados em regime de "melhor esforço" (best-effort).
     * 
     * @param request DTO com título e texto a ser processado
     * @return DTO com os resultados fornecidos pelo classificador
     */
    public ConteudoResponseDTO classificar(ConteudoRequestDTO request) {
        // Solcita a classificação ao serviço de ML
        ConteudoResponseDTO resposta = classificadorService.classificar(request);

        // Tenta salvar no banco de dados; se falhar, loga o erro mas NÃO trava o retorno ao cliente
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

    /**
     * Busca conteúdos cadastrados que contenham a palavra-chave informada
     * no título, texto, categoria, informações adicionais ou tags.
     * 
     * @param termo Termo/palavra-chave a ser pesquisado
     * @return Lista de conteúdos formatados como ConteudoResponseDTO
     */
    public List<ConteudoResponseDTO> buscarPorPalavraChave(String termo) {
        List<Conteudo> resultados = conteudoRepository.buscarPorPalavraChave(termo);
        return resultados.stream()
                .map(conteudoMapper::toResponseDTO)
                .toList();
    }
}

