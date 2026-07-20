package com.time13.techcontentclassifier.controller;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;
import com.time13.techcontentclassifier.service.ConteudoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping
    public List<ConteudoResponseDTO> buscarPorPalavraChave(@RequestParam("palavra-chave") String termo) {
        return conteudoService.buscarPorPalavraChave(termo);
    }
}
