package com.time13.techcontentclassifier.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidade JPA referente à tabela "conteudos".
 * 
 * Representa um artigo ou postagem cadastrado no sistema juntamente com
 * o resultado do seu processamento pela IA (categoria, probabilidade e tags).
 */
@Entity
@Table(name = "conteudos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conteudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(nullable = false, length = 50)
    private String categoria;

    @Column(nullable = false)
    private Double probabilidade;

    @Column(name = "informacoes_adicionais", length = 500)
    private String informacoesAdicionais;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    /**
     * Callback executado automaticamente pelo JPA antes de inserir o registro no banco.
     * Define a data e hora de criação do registro.
     */
    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }

    // Relacionamento muitos-para-muitos (N:N) entre Conteúdo e Tags através da tabela "conteudo_tags"
    @ManyToMany
    @JoinTable(
            name = "conteudo_tags",
            joinColumns = @JoinColumn(name = "id_conteudo"),
            inverseJoinColumns = @JoinColumn(name = "id_tag")
    )
    private List<Tags> tagsSugeridas;

    public Conteudo(String titulo, String texto, LocalDateTime criadoEm, String categoria, Double probabilidade, String informacoesAdicionais,
                                        List<Tags> tagsSugeridas) {
        this.titulo = titulo;
        this.texto = texto;
        this.criadoEm = criadoEm;
        this.categoria = categoria;
        this.probabilidade = probabilidade;
        this.informacoesAdicionais = informacoesAdicionais;
        this.tagsSugeridas = tagsSugeridas;
    }
}