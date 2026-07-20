package com.time13.techcontentclassifier.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_tags")
public class Tags {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nome;

    /*
    //para no futuro listar os conteúdos associados a uma Tag
    @ManyToMany(mappedBy = "tags")
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
