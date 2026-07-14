package com.time13.techcontentclassifier.mapper;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.entity.Conteudo;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ConteudoMapper {

    /**
     * Reúne os dados recebidos pela API e o resultado da classificação na entidade
     * que será persistida. Enquanto o banco mantiver as informações adicionais em
     * uma única coluna textual, os itens são armazenados separados por vírgula.
     */
    public Conteudo toEntity(
            ConteudoRequestDTO request,
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

    /**
     * Reconstrói o contrato de resposta a partir de um conteúdo persistido.
     * Este método fica disponível para futuros endpoints de consulta; o POST atual
     * devolve diretamente o resultado produzido pelo classificador.
     */
    public ConteudoResponseDTO toResponseDTO(Conteudo entity) {
        return new ConteudoResponseDTO(
                entity.getCategoria(),
                entity.getProbabilidade(),
                entity.getInformacoesAdicionais() != null
                        ? List.of(entity.getInformacoesAdicionais().split(", "))
                        : List.of()
        );
    }
}
