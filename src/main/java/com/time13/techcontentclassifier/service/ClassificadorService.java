package com.time13.techcontentclassifier.service;

import com.time13.techcontentclassifier.dto.ConteudoRequestDTO;
import com.time13.techcontentclassifier.dto.ConteudoResponseDTO;

public interface ClassificadorService {
    ConteudoResponseDTO classificar(ConteudoRequestDTO request);
}
