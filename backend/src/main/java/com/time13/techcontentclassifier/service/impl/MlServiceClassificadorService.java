package com.time13.techcontentclassifier.service.impl;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.exception.MlServiceException;
import com.time13.techcontentclassifier.service.ClassificadorService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

/**
 * Implementação da interface ClassificadorService integrada ao serviço externo de Machine Learning / IA.
 * 
 * Utiliza o cliente HTTP RestClient (disponibilizado no Spring Boot 3.2+) com timeouts de conexão
 * e leitura configurados no application.properties.
 */
@Service
@Primary // Define esta classe como a implementação primária/padrão injetada pelo Spring
public class MlServiceClassificadorService implements ClassificadorService {

    private final RestClient restClient;

    /**
     * Construtor da classe de serviço.
     * Configura o RestClient com a URL base e os limites de tempo de conexão (timeout) via propriedades da aplicação.
     * 
     * @param iaServiceUrl URL base do serviço de IA (propriedade: ia.service.url)
     * @param connectTimeoutMs Tempo máximo para estabelecimento da conexão em milissegundos
     * @param readTimeoutMs Tempo máximo de espera pela resposta em milissegundos
     */
    public MlServiceClassificadorService(
            @Value("${ia.service.url}") String iaServiceUrl,
            @Value("${ia.service.timeout.connect}") int connectTimeoutMs,
            @Value("${ia.service.timeout.read}") int readTimeoutMs) {

        // Configuração de timeouts da fábrica de requisições HTTP
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(connectTimeoutMs);
        requestFactory.setReadTimeout(readTimeoutMs);

        // Inicialização fluente do RestClient
        this.restClient = RestClient.builder()
                .baseUrl(iaServiceUrl)
                .requestFactory(requestFactory)
                .build();
    }

    /**
     * Envia o texto a ser classificado via requisição HTTP POST para o endpoint "/predict" da API de Machine Learning.
     * 
     * @param request DTO com o título e texto a ser analisado
     * @return DTO com a classificação retornada pelo modelo
     * @throws MlServiceException em caso de falha de conexão, erro HTTP ou timeout
     */
    @Override
    public ConteudoResponseDTO classificar(ConteudoRequestDTO request) {
        try {
            return restClient.post()
                    .uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(ConteudoResponseDTO.class);
        } catch (Exception e) {
            // Encapsula exceções genéricas ou de rede na exceção customizada da aplicação
            throw new MlServiceException("Não foi possível processar o conteúdo no momento. Tente novamente.", e);
        }
    }
}