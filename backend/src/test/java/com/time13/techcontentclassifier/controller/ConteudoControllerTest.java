package com.time13.techcontentclassifier.controller;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.service.ConteudoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
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
}