package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.ConteudoHistoricoDTO;
import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.dto.ExplicabilidadeDTO;
import com.time13.techcontentclassifier.entity.Conteudo;
import com.time13.techcontentclassifier.entity.Tags;
import com.time13.techcontentclassifier.mapper.ConteudoMapper;
import com.time13.techcontentclassifier.repository.ConteudoRepository;
import com.time13.techcontentclassifier.repository.TagsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConteudoServiceTest {

    @Mock
    private ConteudoRepository conteudoRepository;

    @Mock
    private ClassificadorService classificadorService;

    @Mock
    private TagsRepository tagsRepository;

    @Spy
    private ConteudoMapper conteudoMapper = new ConteudoMapper();

    @InjectMocks
    private ConteudoService conteudoService;

    @BeforeEach
    void setUp() {
        lenient().when(tagsRepository.findByNome(any())).thenAnswer(invocation -> {
            String nome = invocation.getArgument(0);
            return Optional.of(new Tags(nome));
        });
    }

    @Test
    void deveSalvarEBuscarConteudoComExplicabilidadeNoCicloCompleto() {
        ConteudoRequestDTO request = new ConteudoRequestDTO(
                "Desenvolvimento Spring Boot",
                "Artigo completo sobre APIs REST em Java com Spring Boot"
        );

        List<ExplicabilidadeDTO> explicabilidadeEsperada = List.of(
                new ExplicabilidadeDTO("spring", 1.0),
                new ExplicabilidadeDTO("java", 0.85)
        );

        ConteudoResponseDTO respostaMl = new ConteudoResponseDTO(
                "Backend",
                0.95,
                List.of("Java", "Spring Boot"),
                explicabilidadeEsperada
        );

        when(classificadorService.classificar(request)).thenReturn(respostaMl);

        ConteudoResponseDTO respostaService = conteudoService.classificar(request);

        assertNotNull(respostaService);
        assertEquals("Backend", respostaService.categoria());
        assertEquals(explicabilidadeEsperada, respostaService.explicabilidade());

        ArgumentCaptor<Conteudo> conteudoCaptor = ArgumentCaptor.forClass(Conteudo.class);
        verify(conteudoRepository).save(conteudoCaptor.capture());

        Conteudo conteudoSalvo = conteudoCaptor.getValue();
        assertNotNull(conteudoSalvo);
        assertNotNull(conteudoSalvo.getExplicabilidade());
        assertTrue(conteudoSalvo.getExplicabilidade().contains("\"termo\":\"spring\""));
        assertTrue(conteudoSalvo.getExplicabilidade().contains("\"peso\":1.0"));

        conteudoSalvo.setId(10L);
        conteudoSalvo.setCriadoEm(LocalDateTime.now());
        when(conteudoRepository.buscarPorPalavraChave("Spring")).thenReturn(List.of(conteudoSalvo));

        List<ConteudoHistoricoDTO> historico = conteudoService.buscarPorPalavraChave("Spring");

        assertNotNull(historico);
        assertEquals(1, historico.size());

        ConteudoHistoricoDTO itemHistorico = historico.get(0);
        assertEquals("Desenvolvimento Spring Boot", itemHistorico.titulo());
        assertEquals("Backend", itemHistorico.categoria());
        assertNotNull(itemHistorico.explicabilidade());
        assertEquals(2, itemHistorico.explicabilidade().size());
        assertEquals("spring", itemHistorico.explicabilidade().get(0).termo());
        assertEquals(1.0, itemHistorico.explicabilidade().get(0).peso());
        assertEquals("java", itemHistorico.explicabilidade().get(1).termo());
        assertEquals(0.85, itemHistorico.explicabilidade().get(1).peso());
    }
}
