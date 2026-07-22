package com.time13.techcontentclassifier.entity;

import jakarta.persistence.*;

/**
 * Entidade JPA referente à tabela "tb_tags".
 * 
 * Armazena as palavras-chave e tags únicas geradas ou associadas aos conteúdos.
 */
@Entity
@Table(name = "tb_tags")
public class Tags {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nome;

    /*
    // Espaço reservado para futura listagem bidirecional dos conteúdos associados a uma Tag
    @ManyToMany(mappedBy = "tagsSugeridas")
    private List<Conteudo> conteudos = new ArrayList<>();
    */

    public Tags() {
    }

    public Tags(String nome) {
        this.nome = nome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}

