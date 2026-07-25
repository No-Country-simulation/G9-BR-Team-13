# ==============================================================================
# ESTÁGIO 1: COMPILAÇÃO (BUILD)
# ==============================================================================
# Utiliza imagem Maven com JDK 21 para compilar o código Java e gerar o arquivo JAR.
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copia arquivo do projeto e baixa dependências primeiro (aproveita cache de camadas Docker)
COPY pom.xml .
COPY src ./src

# Compila o projeto criando o pacote (.jar) sem rodar testes unitários no build
RUN mvn clean package -DskipTests

# ==============================================================================
# ESTÁGIO 2: EXECUÇÃO (RUNTIME)
# ==============================================================================
# Utiliza uma imagem JRE Alpine minimalista sem ferramentas de compilação.
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Cria usuário e grupo não-root para execução segura no container (Boa prática de Segurança)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia apenas o JAR gerado no Estágio 1
COPY --from=build /app/target/*.jar app.jar

# Define permissão para o usuário não-root
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=docker

ENTRYPOINT ["java", "-jar", "app.jar"]

