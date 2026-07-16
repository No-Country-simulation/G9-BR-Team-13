package com.time13.conteudo.entity;

import com.time13.conteudo.dto.TipoDocumento;
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

    @Column(nullable = false)
    private LocalDateTime data;
    private String categoria;
    private Double probabilidade;

    @Column(name = "informacoes_adicionais", length = 500)
    private String informacoesAdicionais;

    // Armazena a lista de tags como elementos em uma tabela
    @ManyToMany
    @JoinTable(
            name = "conteudo_tags",
            joinColumns = @JoinColumn(name = "id_conteudo"),
            inverseJoinColumns = @JoinColumn(name = "id_tag")
    )
    private List<Tags> tagsSugeridas;

    public Conteudo(String titulo, String texto, LocalDateTime data,
                                        TipoDocumento tipoDocumento, String categoria, Double probabilidade, String informacoesAdicionais,
                                        List<Tags> tagsSugeridas) {
        this.titulo = titulo;
        this.texto = texto;
        this.data = data;
        this.categoria = categoria;
        this.probabilidade = probabilidade;
        this.informacoesAdicionais = informacoesAdicionais;
        this.tagsSugeridas = tagsSugeridas;
    }
}