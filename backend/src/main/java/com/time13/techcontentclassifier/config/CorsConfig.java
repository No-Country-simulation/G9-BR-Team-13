package com.time13.techcontentclassifier.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração global de CORS (Cross-Origin Resource Sharing).
 * 
 * Permite que aplicações frontend hospedadas em domínios/portas diferentes
 * façam requisições HTTP para as APIs deste backend.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // ATENÇÃO: '*' permite requisições de qualquer origem.
                // Recomendado manter '*' para ambiente de desenvolvimento.
                // Em produção, substitua '*' pela URL exata do frontend (ex: "https://meudominio.com").
                .allowedOrigins("*")
                
                // Define os métodos HTTP autorizados para requisições entre origens
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                
                // Permite a inclusão de quaisquer cabeçalhos (headers) nas requisições (ex: Authorization, Content-Type)
                .allowedHeaders("*");
    }
}

