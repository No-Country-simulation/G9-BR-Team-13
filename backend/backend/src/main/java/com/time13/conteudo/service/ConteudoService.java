package com.time13.conteudo.service;

import com.time13.conteudo.dto.*;
import com.time13.conteudo.entity.Conteudo;
import com.time13.conteudo.repository.ConteudoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConteudoService {
    private final ConteudoRepository conteudoRepository;
    public ConteudoService(ConteudoRepository conteudoRepository) {
        this.conteudoRepository = conteudoRepository;
    }

    public ConteudoResponseDTO processarEOrganizar(ConteudoRequestDTO request) {
        //Simulação do retorno do ML
        System.out.println("Entrou no service");
        String categoriaSugerida = "Backend";
        Double precisao = 0.89;
        List<String> tags = List.of("Java", "Spring Boot", "API REST");
        String resumo = "O Spring Boot revolucionou o desenvolvimento em Java...";

        //Simulação de entrada de Dados
        String titulo = "Springboot: Primeiros passos";
        String texto = "O Spring Boot revolucionou o desenvolvimento em Java ao tornar a criação de aplicações web e APIs muito mais ágil e intuitiva.";
        String autor = "Eduardo Lopes";
        TipoDocumento tipoDocumento = TipoDocumento.valueOf("CURSO");
        Conteudo novoConteudo = new Conteudo(
                titulo,
                texto,
                autor,
                LocalDateTime.now(),
                tipoDocumento,
                categoriaSugerida,
                precisao,
                tags,
                resumo
        );

        //Salvar no banco de dados
        Conteudo conteudoSalvo = conteudoRepository.save(novoConteudo);

        //Simulação de busca dos conteúdos relacionados
        List<ConteudoRelacionadoDTO> relacionados = List.of(
                new ConteudoRelacionadoDTO("042", "Spring Boot Microsservicos na pratica", 0.76)
        );

        //Devolve o ConteudoResponseDTO para o controller
        return new ConteudoResponseDTO(
                conteudoSalvo.getIdConteudo(),
                new ClassificacaoDTO(conteudoSalvo.getCategoria(), conteudoSalvo.getProbabilidade(), conteudoSalvo.getTagsSugeridas()),
                conteudoSalvo.getResumoAutomatico(),
                relacionados
        );
    }
}