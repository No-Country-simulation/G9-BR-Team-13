package com.time13.techcontentclassifier.mapper;

import com.time13.techcontentclassifier.dto.ConteudoHistoricoDTO;
import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.entity.Conteudo;
import com.time13.techcontentclassifier.entity.Tags;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

/**
 * Componente responsável por mapear e converter dados entre os DTOs da API
 * e a entidade de banco de dados (Conteudo).
 */
@Component
public class ConteudoMapper {

    /**
     * Reúne os dados recebidos pela API (ConteudoRequestDTO) e o resultado da classificação (ConteudoResponseDTO)
     * construindo a entidade Conteudo que será persistida no banco de dados.
     * 
     * @param request DTO com os dados originais enviados pelo cliente
     * @param resposta DTO contendo a resposta retornada pela IA
     * @return Objeto Conteudo pronto para ser salvo no banco
     */
    public Conteudo toEntity(
            ConteudoRequestDTO request,
            ConteudoResponseDTO resposta) {

        // Converte as strings de tags recebidas na resposta da IA em objetos da entidade Tags
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
                .tagsSugeridas(tags) // Atribui as tags convertidas à entidade
                .build();
    }

    /**
     * Converte uma entidade Conteudo recuperada do banco de dados em um DTO de resposta (ConteudoResponseDTO).
     * Reúne informações adicionais textuais e os nomes das tags associadas.
     * 
     * @param entity Entidade Conteudo vinda do repositório
     * @return Objeto ConteudoResponseDTO formatado para ser retornado na API
     */
    public ConteudoResponseDTO toResponseDTO(Conteudo entity) {
        return new ConteudoResponseDTO(
                entity.getCategoria(),
                entity.getProbabilidade(),
                montarInformacoesAdicionais(entity)
        );
    }

    /**
     * Converte uma entidade Conteudo em um {@link ConteudoHistoricoDTO}, usado pelo endpoint
     * de consulta (GET /conteudo). Diferente do toResponseDTO, também expõe id, título, texto
     * e data de criação — necessários para telas de listagem/detalhe no frontend.
     *
     * @param entity Entidade Conteudo vinda do repositório
     * @return Objeto ConteudoHistoricoDTO formatado para ser retornado na API
     */
    public ConteudoHistoricoDTO toHistoricoDTO(Conteudo entity) {
        return new ConteudoHistoricoDTO(
                entity.getId(),
                entity.getTitulo(),
                entity.getTexto(),
                entity.getCategoria(),
                entity.getProbabilidade(),
                montarInformacoesAdicionais(entity),
                entity.getCriadoEm()
        );
    }

    /**
     * Reúne as informações adicionais gravadas na coluna de texto com os nomes das tags
     * vinculadas à entidade, formando a lista completa exposta pela API.
     */
    private List<String> montarInformacoesAdicionais(Conteudo entity) {
        List<String> infoAdicionais = entity.getInformacoesAdicionais() != null
                ? new ArrayList<>(List.of(entity.getInformacoesAdicionais().split(", ")))
                : new ArrayList<>();

        if (entity.getTagsSugeridas() != null) {
            List<String> tagsNomes = entity.getTagsSugeridas().stream()
                    .map(Tags::getNome)
                    .toList();
            infoAdicionais.addAll(tagsNomes);
        }
        return infoAdicionais;
    }
}

