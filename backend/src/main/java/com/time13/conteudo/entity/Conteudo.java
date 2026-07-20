package com.time13.techcontentclassifier.entity;

import com.time13.techcontentclassifier.dto.TipoDocumento;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "conteudos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conteudo {
    @Id
    @Column(name = "id_conteudo")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConteudo;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist(){
        this.criadoEm = LocalDateTime.now();
    }

    private String categoria;
    private Double probabilidade;

    @Column(name = "informacoes_adicionais", length = 500)
    private String informacoesAdicionais;

    // Relacionamento muitos-para-muitos entre Conteúdo e Tags
    @ManyToMany
    @JoinTable(
            name = "conteudo_tags",
            joinColumns = @JoinColumn(name = "id_conteudo"),
            inverseJoinColumns = @JoinColumn(name = "id_tag")
    )
    private List<Tags> tagsSugeridas;

    public Conteudo(String titulo, String texto, LocalDateTime criadoEm,
                                        TipoDocumento tipoDocumento, String categoria, Double probabilidade, String informacoesAdicionais,
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