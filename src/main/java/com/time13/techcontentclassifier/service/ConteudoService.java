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

    public ConteudoService(ConteudoRepository conteudoRepository) {
        this.conteudoRepository = conteudoRepository;
    }
    public ConteudoResponseDTO classificar(ConteudoRequestDTO request) {

        // Simulação da classificação (depois será substituída pela IA)
        String categoria = "Backend";
        Double probabilidade = 0.98;
        List<String> informacoes = List.of("Java", "Spring Boot", "API REST");

        // Cria a entidade
        Conteudo conteudo = Conteudo.builder()
                .titulo(request.titulo())
                .texto(request.texto())
                .categoria(categoria)
                .probabilidade(probabilidade)
                .informacoesAdicionais(String.join(", ", informacoes))
                .build();

        // Salva no banco
        conteudoRepository.save(conteudo);

        // Retorna a resposta para o cliente
        return new ConteudoResponseDTO(
                categoria,
                probabilidade,
                informacoes
        );
    }
}
