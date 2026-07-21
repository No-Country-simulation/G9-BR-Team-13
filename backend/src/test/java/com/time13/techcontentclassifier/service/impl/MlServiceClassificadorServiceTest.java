package com.time13.techcontentclassifier.service.impl;

import com.sun.net.httpserver.HttpServer;
import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.exception.MlServiceException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Testa MlServiceClassificadorService contra um servidor HTTP de verdade (embutido no JDK,
 * sem dependencia nova), simulando o servico de ML respondendo com sucesso, com erro e
 * indisponivel.
 */
class MlServiceClassificadorServiceTest {

    private HttpServer server;

    @AfterEach
    void tearDown() {
        if (server != null) {
            server.stop(0);
        }
    }

    @Test
    void deveClassificarComSucessoQuandoServicoDeMlResponde() throws IOException {
        server = HttpServer.create(new InetSocketAddress("localhost", 0), 0);
        server.createContext("/predict", exchange -> {
            String json = """
                    {"categoria":"Backend","probabilidade":0.91,"informacoes_adicionais":["Java","Spring Boot"]}
                    """;
            byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        });
        server.start();

        MlServiceClassificadorService service = new MlServiceClassificadorService(
                "http://localhost:" + server.getAddress().getPort(), 2000, 2000);

        ConteudoResponseDTO resposta = service.classificar(
                new ConteudoRequestDTO("Introdução ao Spring Boot", "Texto de exemplo com tamanho suficiente."));

        assertThat(resposta.categoria()).isEqualTo("Backend");
        assertThat(resposta.probabilidade()).isEqualTo(0.91);
        assertThat(resposta.informacoesAdicionais()).containsExactly("Java", "Spring Boot");
    }

    @Test
    void deveLancarMlServiceExceptionQuandoServicoRespondeComErro() throws IOException {
        server = HttpServer.create(new InetSocketAddress("localhost", 0), 0);
        server.createContext("/predict", exchange -> {
            exchange.sendResponseHeaders(500, -1);
            exchange.close();
        });
        server.start();

        MlServiceClassificadorService service = new MlServiceClassificadorService(
                "http://localhost:" + server.getAddress().getPort(), 2000, 2000);

        assertThatThrownBy(() -> service.classificar(
                new ConteudoRequestDTO("Título válido", "Texto de exemplo com tamanho suficiente.")))
                .isInstanceOf(MlServiceException.class);
    }

    @Test
    void deveLancarMlServiceExceptionQuandoServicoIndisponivel() {
        // Porta sem nenhum servidor escutando -- simula o serviço de ML fora do ar.
        MlServiceClassificadorService service = new MlServiceClassificadorService(
                "http://localhost:1", 500, 500);

        assertThatThrownBy(() -> service.classificar(
                new ConteudoRequestDTO("Título válido", "Texto de exemplo com tamanho suficiente.")))
                .isInstanceOf(MlServiceException.class);
    }
}
