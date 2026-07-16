package com.time13.conteudo.controller;
import com.time13.conteudo.dto.ConteudoRequestDTO;
import com.time13.conteudo.dto.ConteudoResponseDTO;
import com.time13.conteudo.service.ConteudoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/conteudo")
public class ConteudoController {

    private final ConteudoService conteudoService;

    public ConteudoController(ConteudoService conteudoService) {
        this.conteudoService = conteudoService;
    }

    @PostMapping
    public ConteudoResponseDTO classificar(@Valid @RequestBody ConteudoRequestDTO request){
        return conteudoService.classificar(request);
    }
}