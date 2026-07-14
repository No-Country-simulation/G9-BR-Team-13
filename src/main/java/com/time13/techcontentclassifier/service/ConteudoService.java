package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.entity.Conteudo;
import com.time13.techcontentclassifier.repository.ConteudoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConteudoService {
    private final ConteudoRepository conteudoRepository;
    private final ClassificadorService classificadorService;

    public ConteudoService(ConteudoRepository conteudoRepository,
                           ClassificadorService classificadorService) {
        this.conteudoRepository = conteudoRepository;
        this.classificadorService = classificadorService;
    }

    public ConteudoResponseDTO classificar(ConteudoRequestDTO request) {

        // Obtém a classificação (por enquanto do Mock)
        ConteudoResponseDTO resposta = classificadorService.classificar(request);

        // Cria a entidade
        Conteudo conteudo = criarConteudo(request, resposta);

        // Salva no banco
        conteudoRepository.save(conteudo);

        // Retorna a resposta para o cliente
        return resposta;
    }

    /**
     * Converte os DTOs em uma entidade Conteudo.
     */
    private Conteudo criarConteudo(ConteudoRequestDTO request,
                                   ConteudoResponseDTO resposta) {

        return Conteudo.builder()
                .titulo(request.titulo())
                .texto(request.texto())
                .categoria(resposta.categoria())
                .probabilidade(resposta.probabilidade())
                .informacoesAdicionais(
                        String.join(", ", resposta.informacoesAdicionais()))
                .build();
    }
}
