---

# Guia de Integração com o Backend Spring Boot

Esta seção descreve o processo completo de integração do serviço de Machine Learning com o Backend desenvolvido em **Java + Spring Boot**.

O objetivo é disponibilizar um endpoint único para o Frontend, mantendo toda a comunicação com o serviço de IA encapsulada no Backend.

## Arquitetura da Integração

```text
                 React + Tailwind

                        │

                 HTTP REST (JSON)

                        │

                Spring Boot API

                        │

              POST /api/v1/classify

                        │

               RestTemplate/WebClient

                        │

             POST http://localhost:8000/predict

                        │

                  FastAPI (ML Service)

                        │

                 Modelo Machine Learning

                        │

                Resultado da Classificação
```

O Frontend **não deve consumir diretamente** o serviço FastAPI. Toda comunicação deve ocorrer através do Backend.

---

# 1. Dependências Maven

Adicionar as dependências abaixo ao arquivo **pom.xml** do Backend.

```xml
<dependencies>

    <!-- Spring Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Circuit Breaker -->
    <dependency>
        <groupId>io.github.resilience4j</groupId>
        <artifactId>resilience4j-spring-boot2</artifactId>
        <version>1.7.0</version>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

</dependencies>
```

---

# 2. Configuração da Aplicação

Editar o arquivo:

```text
src/main/resources/application.properties
```

Adicionar as seguintes propriedades:

```properties
# Endpoint do Serviço de Machine Learning
ml.service.url=http://localhost:8000/predict

# Timeout do RestTemplate
ml.service.timeout.connect=5000
ml.service.timeout.read=5000

# Configuração do Circuit Breaker
resilience4j.circuitbreaker.instances.mlService.failure-rate-threshold=50
resilience4j.circuitbreaker.instances.mlService.slow-call-rate-threshold=50
resilience4j.circuitbreaker.instances.mlService.slow-call-duration-threshold=2s
resilience4j.circuitbreaker.instances.mlService.permitted-number-of-calls-in-half-open-state=3
resilience4j.circuitbreaker.instances.mlService.max-wait-duration-in-half-open-state=10s
```

### Ambiente de Produção

Após a implantação do serviço de Machine Learning na Oracle Cloud Infrastructure (OCI), alterar a propriedade:

```properties
ml.service.url=http://<ip-ou-dns-da-vm>:8000/predict
```

ou

```properties
ml.service.url=http://10.0.0.4:8000/predict
```

caso a comunicação ocorra utilizando IP privado dentro da mesma VCN.

---

# 3. Criação dos DTOs

Criar o pacote:

```text
src/main/java/com/techknowledge/ai/dto
```

## TextInput.java

```java
package com.techknowledge.ai.dto;

import lombok.Data;

@Data
public class TextInput {

    private String titulo;

    private String texto;

}
```

## PredictionOutput.java

```java
package com.techknowledge.ai.dto;

import lombok.Data;
import java.util.List;

@Data
public class PredictionOutput {

    private String categoria;

    private Double probabilidade;

    private List<String> palavrasChave;

}
```

Esses DTOs representam o contrato de comunicação entre o Backend e o serviço FastAPI.

---

# 4. Serviço de Comunicação com o ML

Criar o pacote:

```text
src/main/java/com/techknowledge/ai/service
```

Criar a classe:

```text
MLService.java
```

Responsabilidades:

- realizar chamadas HTTP para o serviço FastAPI;
- configurar timeout de conexão e leitura;
- serializar e desserializar JSON;
- aplicar Circuit Breaker;
- fornecer método de fallback quando o serviço estiver indisponível.

```java
package com.techknowledge.ai.service;

import com.techknowledge.ai.dto.PredictionOutput;
import com.techknowledge.ai.dto.TextInput;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;

@Service
public class MLService {

    private final RestTemplate restTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public MLService(RestTemplate restTemplate) {

        this.restTemplate = restTemplate;

        var factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();

        factory.setConnectTimeout(Duration.ofMillis(5000));

        factory.setReadTimeout(Duration.ofMillis(5000));

        this.restTemplate.setRequestFactory(factory);

    }

    @CircuitBreaker(name = "mlService", fallbackMethod = "fallbackPredict")
    public PredictionOutput predict(TextInput input) {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TextInput> request = new HttpEntity<>(input, headers);

        return restTemplate.postForObject(
                mlServiceUrl,
                request,
                PredictionOutput.class
        );

    }

    public PredictionOutput fallbackPredict(TextInput input, Throwable t) {

        PredictionOutput fallback = new PredictionOutput();

        fallback.setCategoria("ERRO_ML");

        fallback.setProbabilidade(0.0);

        fallback.setPalavrasChave(
                List.of("Serviço ML indisponível")
        );

        return fallback;

    }

}
```

---

# 5. Controller

Criar o pacote:

```text
src/main/java/com/techknowledge/ai/controller
```

Criar a classe:

```text
ClassifyController.java
```

```java
package com.techknowledge.ai.controller;

import com.techknowledge.ai.dto.PredictionOutput;
import com.techknowledge.ai.dto.TextInput;
import com.techknowledge.ai.service.MLService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/classify")
public class ClassifyController {

    @Autowired
    private MLService mlService;

    @PostMapping
    public ResponseEntity<PredictionOutput> classifyContent(
            @RequestBody TextInput input) {

        PredictionOutput result = mlService.predict(input);

        return ResponseEntity.ok(result);

    }

}
```

Esse endpoint será consumido exclusivamente pelo Frontend.

---

# 6. Configuração do RestTemplate

Para centralizar sua configuração, recomenda-se criar um Bean.

Criar o pacote:

```text
src/main/java/com/techknowledge/ai/config
```

Criar a classe:

```java
package com.techknowledge.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {

        return new RestTemplate();

    }

}
```

Essa abordagem facilita futuras customizações como interceptadores, autenticação e SSL.

---

# 7. Testando a Integração

## Passo 1

Inicializar o serviço FastAPI.

```bash
uvicorn app.main:app --reload --port 8000
```

---

## Passo 2

Inicializar o Backend.

```bash
mvn spring-boot:run
```

ou executar diretamente pela IDE.

---

## Passo 3

Enviar uma requisição para o Backend.

```bash
curl -X POST http://localhost:8080/api/v1/classify \
-H "Content-Type: application/json" \
-d '{
    "titulo":"Spring Boot Avançado",
    "texto":"Construção de microserviços com Spring Cloud e JWT."
}'
```

Resposta esperada:

```json
{
    "categoria":"Backend",
    "probabilidade":0.94,
    "palavrasChave":[
        "spring",
        "boot",
        "cloud",
        "jwt"
    ]
}
```

---

# 8. Implantação na Oracle Cloud Infrastructure (OCI)

Durante a implantação em produção, o Backend e o serviço de Machine Learning poderão ser executados em máquinas distintas.

Exemplo:

```text
Backend Spring Boot

↓

10.0.0.2

↓

HTTP REST

↓

10.0.0.4

↓

FastAPI
```

Requisitos:

- atualizar `ml.service.url`;
- utilizar IP privado ou DNS interno;
- liberar a porta **8000** nas regras de Security List ou Network Security Group;
- garantir que ambas as instâncias pertençam à mesma VCN ou possuam roteamento entre si.

---

# 9. Resumo da Configuração

| Componente | Configuração |
|------------|--------------|
| Dependências Maven | spring-boot-starter-web, resilience4j-spring-boot2, lombok |
| DTOs | TextInput e PredictionOutput |
| Serviço | MLService |
| Controller | ClassifyController |
| Cliente HTTP | RestTemplate |
| Endpoint FastAPI | POST /predict |
| Endpoint Backend | POST /api/v1/classify |
| Timeout | 5 segundos |
| Circuit Breaker | Resilience4j |
| Produção | Atualizar ml.service.url para o endereço da instância ML |

---

## Boas Práticas

- O serviço FastAPI deve permanecer desacoplado do Backend.
- Toda comunicação deve utilizar `application/json`.
- O Frontend nunca deve acessar diretamente o serviço de Machine Learning.
- O Backend é responsável por autenticação, autorização, validações, persistência de dados e regras de negócio.
- O contrato da API (`request` e `response`) deve ser mantido para garantir compatibilidade entre os serviços.