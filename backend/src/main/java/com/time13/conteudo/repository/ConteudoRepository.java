package com.time13.conteudo.repository;

import com.time13.conteudo.entity.Conteudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConteudoRepository extends JpaRepository<Conteudo, Long> {
}