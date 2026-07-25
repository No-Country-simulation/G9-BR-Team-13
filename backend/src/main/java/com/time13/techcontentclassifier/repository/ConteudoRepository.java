package com.time13.techcontentclassifier.repository;

import com.time13.techcontentclassifier.entity.Conteudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório Spring Data JPA para gerenciamento das operações no banco de dados
 * referente à entidade Conteudo.
 */
@Repository
public interface ConteudoRepository extends JpaRepository<Conteudo, Long> {

    /**
     * Consulta JPQL para busca case-insensitive por palavra-chave.
     * Pesquisa o termo nos campos titulo, texto, categoria, informacoesAdicionais e no nome das tags associadas.
     * 
     * @param termo Palavra-chave enviada pelo usuário
     * @return Lista de conteúdos encontrados ordenada pela data de criação em ordem decrescente (mais recentes primeiro)
     */
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

