package com.time13.conteudo.controller;
import com.time13.conteudo.dto.ConteudoRequestDTO;
import com.time13.conteudo.dto.ConteudoResponseDTO;
import com.time13.conteudo.service.ConteudoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analises")
public class ConteudoController {

    private final ConteudoService analiseService;

    public ConteudoController(ConteudoService analiseService) {
        this.analiseService = analiseService;
    }

    @PostMapping
    public ResponseEntity<ConteudoResponseDTO> analisarTextoTecnico(@Valid @RequestBody ConteudoRequestDTO request) {

        System.out.println("Entrou no controller");
        ConteudoResponseDTO response = analiseService.processarEOrganizar(request);

        // Retorna o status HTTP 200 OK junto com o JSON de resposta
        return ResponseEntity.ok(response);
    }
}