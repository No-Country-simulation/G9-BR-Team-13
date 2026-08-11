package com.time13.techcontentclassifier.mapper;

import com.time13.techcontentclassifier.dto.ConteudoHistoricoDTO;
import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.dto.ExplicabilidadeDTO;
import com.time13.techcontentclassifier.entity.Conteudo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ConteudoMapperTest {

    private ConteudoMapper conteudoMapper;

    @BeforeEach
    void setUp() {
        conteudoMapper = new ConteudoMapper();
    }

    @Test
    void deveMapearParaEntityComExplicabilidadeSerializada() {
        ConteudoRequestDTO request = new ConteudoRequestDTO("Título Java", "Texto explicativo sobre Java e Spring Boot");
        ConteudoResponseDTO resposta = new ConteudoResponseDTO(
                "Backend",
                0.95,
                List.of("Java", "Spring"),
                List.of(
                        new ExplicabilidadeDTO("java", 1.0),
                        new ExplicabilidadeDTO("spring", 0.85)
                )
        );

        Conteudo entity = conteudoMapper.toEntity(request, resposta);

        assertNotNull(entity);
        assertEquals("Título Java", entity.getTitulo());
        assertEquals("Backend", entity.getCategoria());
        assertNotNull(entity.getExplicabilidade());
        assertTrue(entity.getExplicabilidade().contains("\"termo\":\"java\""));
        assertTrue(entity.getExplicabilidade().contains("\"peso\":1.0"));
    }

    @Test
    void deveMapearParaHistoricoDTOComExplicabilidadeDesserializada() {
        String explicabilidadeJson = "[{\"termo\":\"java\",\"peso\":1.0},{\"termo\":\"spring\",\"peso\":0.85}]";
        Conteudo entity = Conteudo.builder()
                .id(1L)
                .titulo("Título Java")
                .texto("Texto de teste com tamanho suficiente")
                .categoria("Backend")
                .probabilidade(0.95)
                .explicabilidade(explicabilidadeJson)
                .criadoEm(LocalDateTime.now())
                .build();

        ConteudoHistoricoDTO dto = conteudoMapper.toHistoricoDTO(entity);

        assertNotNull(dto);
        assertEquals(1L, dto.id());
        assertNotNull(dto.explicabilidade());
        assertEquals(2, dto.explicabilidade().size());
        assertEquals("java", dto.explicabilidade().get(0).termo());
        assertEquals(1.0, dto.explicabilidade().get(0).peso());
        assertEquals("spring", dto.explicabilidade().get(1).termo());
        assertEquals(0.85, dto.explicabilidade().get(1).peso());
    }

    @Test
    void deveTratarExplicabilidadeNulaOuVaziaSemQuebrar() {
        Conteudo entitySemExplicabilidade = Conteudo.builder()
                .id(2L)
                .titulo("Conteúdo Legado")
                .texto("Texto gravado antes da nova funcionalidade")
                .categoria("Backend")
                .probabilidade(0.80)
                .explicabilidade(null)
                .criadoEm(LocalDateTime.now())
                .build();

        ConteudoHistoricoDTO dto = conteudoMapper.toHistoricoDTO(entitySemExplicabilidade);

        assertNotNull(dto);
        assertNotNull(dto.explicabilidade());
        assertTrue(dto.explicabilidade().isEmpty());
    }

    @Test
    void deveTratarJsonInvalidoRetornandoListaVazia() {
        Conteudo entityJsonInvalido = Conteudo.builder()
                .id(3L)
                .titulo("Conteúdo Corrompido")
                .texto("Texto de exemplo para teste de erro")
                .categoria("Backend")
                .probabilidade(0.80)
                .explicabilidade("{json_invalido}")
                .criadoEm(LocalDateTime.now())
                .build();

        ConteudoHistoricoDTO dto = conteudoMapper.toHistoricoDTO(entityJsonInvalido);

        assertNotNull(dto);
        assertNotNull(dto.explicabilidade());
        assertTrue(dto.explicabilidade().isEmpty());
    }
}
