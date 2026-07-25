package com.time13.techcontentclassifier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal de inicialização da aplicação Spring Boot TechContentClassifier.
 * 
 * Responsável por configurar e subir o contexto do Spring, expondo as APIs REST
 * de classificação de conteúdo e busca por palavra-chave.
 */
@SpringBootApplication
public class TechContentClassifierApplication {

    /**
     * Ponto de entrada (main) da aplicação Java.
     * 
     * @param args Argumentos passados via linha de comando
     */
    public static void main(String[] args) {
        SpringApplication.run(TechContentClassifierApplication.class, args);
    }

}