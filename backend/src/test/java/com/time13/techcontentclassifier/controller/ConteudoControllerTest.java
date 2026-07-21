package com.time13.techcontentclassifier.controller;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.exception.MlServiceException;
import com.time13.techcontentclassifier.service.ConteudoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ConteudoController.class)
class ConteudoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ConteudoService conteudoService;

    @Test
    void deveClassificarConteudoComSucesso() throws Exception {
        ConteudoResponseDTO respostaMock = new ConteudoResponseDTO(
                "Backend",
                0.95,
                List.of("Java", "Spring Boot")
        );

        when(conteudoService.classificar(any(ConteudoRequestDTO.class))).thenReturn(respostaMock);

        mockMvc.perform(post("/conteudo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "titulo": "Desenvolvimento Spring Boot",
                                    "texto": "Artigo sobre desenvolvimento de APIs REST com Spring Boot e Java"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoria").value("Backend"))
                .andExpect(jsonPath("$.probabilidade").value(0.95))
                .andExpect(jsonPath("$.informacoes_adicionais").isArray())
                .andExpect(jsonPath("$.informacoes_adicionais[0]").value("Java"));
    }

    @Test
    void deveRetornar503QuandoServicoDeMlIndisponivel() throws Exception {
        when(conteudoService.classificar(any(ConteudoRequestDTO.class)))
                .thenThrow(new MlServiceException(
                        "Não foi possível processar o conteúdo no momento. Tente novamente.",
                        new RuntimeException("timeout")));

        mockMvc.perform(post("/conteudo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "titulo": "Título válido",
                                    "texto": "Texto de exemplo com tamanho suficiente para passar na validação"
                                }
                                """))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.erro").value("ML_SERVICE_UNAVAILABLE"))
                .andExpect(jsonPath("$.mensagem").value(
                        "Não foi possível processar o conteúdo no momento. Tente novamente."));
    }

    @Test
    void deveRetornarBadRequestQuandoTituloInvalido() throws Exception {
        mockMvc.perform(post("/conteudo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "titulo": "ab",
                                    "texto": "Texto valido com tamanho suficiente para passar na validacao"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornarBadRequestQuandoTextoInvalido() throws Exception {
        mockMvc.perform(post("/conteudo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "titulo": "Titulo Valido",
                                    "texto": "Curto"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornarBadRequestQuandoCamposObrigatoriosFaltando() throws Exception {
        mockMvc.perform(post("/conteudo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "titulo": ""
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveBuscarConteudosPorPalavraChaveComSucesso() throws Exception {
        List<ConteudoResponseDTO> resultadosMock = List.of(
                new ConteudoResponseDTO("Backend", 0.92, List.of("Java", "Spring Boot")),
                new ConteudoResponseDTO("Backend", 0.88, List.of("API", "REST"))
        );

        when(conteudoService.buscarPorPalavraChave(eq("Spring"))).thenReturn(resultadosMock);

        mockMvc.perform(get("/conteudo")
                        .param("palavra-chave", "Spring"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].categoria").value("Backend"))
                .andExpect(jsonPath("$[0].probabilidade").value(0.92))
                .andExpect(jsonPath("$[0].informacoes_adicionais[0]").value("Java"))
                .andExpect(jsonPath("$[1].categoria").value("Backend"))
                .andExpect(jsonPath("$[1].probabilidade").value(0.88));
    }

    @Test
    void deveRetornarListaVaziaQuandoNenhumResultadoEncontrado() throws Exception {
        when(conteudoService.buscarPorPalavraChave(eq("Inexistente"))).thenReturn(List.of());

        mockMvc.perform(get("/conteudo")
                        .param("palavra-chave", "Inexistente"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void deveRetornarBadRequestQuandoParametroPalavraChaveAusente() throws Exception {
        mockMvc.perform(get("/conteudo"))
                .andExpect(status().isBadRequest());
    }
}