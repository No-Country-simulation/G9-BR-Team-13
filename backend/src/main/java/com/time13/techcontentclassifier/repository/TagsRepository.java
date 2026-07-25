package com.time13.techcontentclassifier.repository;

import com.time13.techcontentclassifier.entity.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositório Spring Data JPA para acesso aos dados da entidade Tags.
 */
public interface TagsRepository extends JpaRepository<Tags, Long> {

    /**
     * Busca uma tag cadastrada pelo seu nome exato.
     * 
     * @param nome Nome da tag pesquisada
     * @return Optional contendo a Tag se encontrada, ou vazio caso contrário
     */
    Optional<Tags> findByNome(String nome);
}