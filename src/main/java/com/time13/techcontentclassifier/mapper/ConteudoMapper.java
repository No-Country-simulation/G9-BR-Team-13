package com.time13.techcontentclassifier.mapper;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.entity.Conteudo;
import org.springframework.stereotype.Component;

@Component
public class ConteudoMapper {

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
}
