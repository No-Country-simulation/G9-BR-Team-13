package com.time13.techcontentclassifier.repository;

import com.time13.techcontentclassifier.entity.Conteudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConteudoRepository extends JpaRepository<Conteudo, Long> {

    @Query("""
        SELECT DISTINCT c FROM Conteudo c
        LEFT JOIN c.tagsSugeridas t
        WHERE LOWER(c.titulo) LIKE LOWER(CONCAT('%', :termo, '%'))
           OR LOWER(c.texto) LIKE LOWER(CONCAT('%', :termo, '%'))
           OR LOWER(c.categoria) LIKE LOWER(CONCAT('%', :termo, '%'))
           OR LOWER(c.informacoesAdicionais) LIKE LOWER(CONCAT('%', :termo, '%'))
           OR LOWER(t.nome) LIKE LOWER(CONCAT('%', :termo, '%'))
        ORDER BY c.criadoEm DESC
        """)
    List<Conteudo> buscarPorPalavraChave(@Param("termo") String termo);
}
