package com.time13.conteudo.mapper;

import com.time13.conteudo.dto.ConteudoRequestDTO;
import com.time13.conteudo.dto.ConteudoResponseDTO;
import com.time13.conteudo.entity.Conteudo;
import com.time13.conteudo.entity.Tags;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
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

        // Converte as strings vindas de 'tagsSugeridas' do DTO para objetos 'Tags'
        List<Tags> tags = List.of();
        if (resposta.informacoesAdicionais() != null) {
            tags = resposta.informacoesAdicionais().stream()
                    .map(Tags::new)
                    .toList();
        }
        return Conteudo.builder()
                .titulo(request.titulo())
                .texto(request.texto())
                .categoria(resposta.categoria())
                .probabilidade(resposta.probabilidade())
                .informacoesAdicionais(null)
                .tagsSugeridas(tags) //adiciona Tags
                .build();
    }

    /**
     * Reconstrói o contrato de resposta a partir de um conteúdo persistido.
     * Este método fica disponível para futuros endpoints de consulta; o POST atual
     * devolve diretamente o resultado produzido pelo classificador.
     */
    public ConteudoResponseDTO toResponseDTO(Conteudo entity) {
        // Recupera as informações adicionais
        List<String> infoAdicionais = entity.getInformacoesAdicionais() != null
                ? new ArrayList<>(List.of(entity.getInformacoesAdicionais().split(", ")))
                : new ArrayList<>();

        // Recupera as Tags e extrai os nomes
        if (entity.getTagsSugeridas() != null) {
            List<String> tagsNomes = entity.getTagsSugeridas().stream()
                    .map(Tags::getNome)
                    .toList(); // Adiciona os nomes das tags diretamente dentro da lista de informações adicionais
            infoAdicionais.addAll(tagsNomes);
        }
        return new ConteudoResponseDTO(
                entity.getCategoria(),
                entity.getProbabilidade(),
                infoAdicionais // Envia a lista unificada para o DTO
        );
    }
}
