package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConteudoService {
    public ConteudoResponseDTO classificar(ConteudoRequestDTO request){
        return new ConteudoResponseDTO(
                "Backend",
                0.97,
                List.of("Java", "Spring Boot", "API Rest")
        );
    }
}
