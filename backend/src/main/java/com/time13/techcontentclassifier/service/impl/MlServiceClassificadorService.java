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

@Service
@Primary // Define esta classe como a implementação padrão injetada pelo Spring
public class MlServiceClassificadorService implements ClassificadorService {

    private final RestClient restClient;

    public MlServiceClassificadorService(
            @Value("${ia.service.url}") String iaServiceUrl,
            @Value("${ia.service.timeout.connect}") int connectTimeoutMs,
            @Value("${ia.service.timeout.read}") int readTimeoutMs) {

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(connectTimeoutMs);
        requestFactory.setReadTimeout(readTimeoutMs);

        this.restClient = RestClient.builder()
                .baseUrl(iaServiceUrl)
                .requestFactory(requestFactory)
                .build();
    }

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
            throw new MlServiceException("Não foi possível processar o conteúdo no momento. Tente novamente.", e);
        }
    }
}