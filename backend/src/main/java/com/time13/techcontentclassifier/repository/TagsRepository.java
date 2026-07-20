package com.time13.techcontentclassifier.repository;

import com.time13.techcontentclassifier.entity.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagsRepository extends JpaRepository<Tags, Long> {
    Optional<Tags> findByNome(String nome);
}