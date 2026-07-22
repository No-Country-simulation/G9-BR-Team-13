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

/**
 * Controller REST responsável pela gestão e processamento de conteúdos.
 * Expõe endpoints para classificação de novos textos e consultas por palavra-chave.
 */
@RestController
@RequestMapping("/conteudo")
public class ConteudoController {

    private final ConteudoService conteudoService;

    // Injeção de dependência do serviço via construtor (boa prática de imutabilidade)
    public ConteudoController(ConteudoService conteudoService) {
        this.conteudoService = conteudoService;
    }

    /**
     * Endpoint para submeter um conteúdo e obter sua classificação.
     * 
     * @param request DTO com os dados do conteúdo a ser classificado (validado via @Valid)
     * @return DTO com o resultado da classificação realizada
     */
    @PostMapping
    public ConteudoResponseDTO classificar(@Valid @RequestBody ConteudoRequestDTO request){
        return conteudoService.classificar(request);
    }

    /**
     * Endpoint para buscar conteúdos classificados filtrados por palavra-chave.
     * Exemplo de chamada: GET /conteudo?palavra-chave=tecnologia
     * 
     * @param termo Palavra-chave enviada como parâmetro de busca na URL (Query Param)
     * @return Lista de conteúdos encontrados correspondentes ao termo informado
     */
    @GetMapping
    public List<ConteudoResponseDTO> buscarPorPalavraChave(@RequestParam("palavra-chave") String termo) {
        return conteudoService.buscarPorPalavraChave(termo);
    }
}

