package com.time13.conteudo.entity;

import com.time13.conteudo.dto.TipoDocumento;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tb_conteudos")
public class Conteudo {
    @Id
    @Column(name = "id_conteudo")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConteudo;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(nullable = false)
    private String autor;

    @Column(nullable = false)
    private LocalDateTime data;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false)
    private TipoDocumento tipoDocumento;

    private String categoria;
    private Double probabilidade;

    // Armazena a lista de tags como elementos em uma tabela auxiliar integrada
    @ElementCollection
    @CollectionTable(name = "tb_conteudo_tags", joinColumns = @JoinColumn(name = "id_conteudo"))
    @Column(name = "tag")
    private List<String> tagsSugeridas;

    @Column(name = "resumo_automatico", columnDefinition = "TEXT")
    private String resumoAutomatico;

    public Conteudo() {}

    public Conteudo(String titulo, String texto, String autor, LocalDateTime data,
                    TipoDocumento tipoDocumento, String categoria, Double probabilidade,
                    List<String> tagsSugeridas, String resumoAutomatico) {
        this.titulo = titulo;
        this.texto = texto;
        this.autor = autor;
        this.data = data;
        this.tipoDocumento = tipoDocumento;
        this.categoria = categoria;
        this.probabilidade = probabilidade;
        this.tagsSugeridas = tagsSugeridas;
        this.resumoAutomatico = resumoAutomatico;
    }

    public Long getIdConteudo() { return idConteudo; }
    public String getTitulo() { return titulo; }
    public String getTexto() { return texto; }
    public String getAutor() { return autor; }
    public LocalDateTime getData() { return data; }
    public TipoDocumento getTipoDocumento() { return tipoDocumento; }
    public String getCategoria() { return categoria; }
    public Double getProbabilidade() { return probabilidade; }
    public List<String> getTagsSugeridas() { return tagsSugeridas; }
    public String getResumoAutomatico() { return resumoAutomatico; }
}