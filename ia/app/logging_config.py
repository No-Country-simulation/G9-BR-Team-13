"""
Configuração de logging estruturado em JSON para produção.

Substitui o logging textual padrão por saída JSON padronizada,
facilitando a ingestão por ferramentas de observabilidade (ELK, Loki, etc.).
"""

import json
import logging
import sys
from datetime import datetime, timezone


class JsonFormatter(logging.Formatter):
    """
    Formatter que serializa logs em JSON com campos padronizados.

    Cada entrada de log produz um JSON flat com timestamp ISO 8601,
    nível, nome do logger e a mensagem formatada.
    """

    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info and record.exc_info[0]:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry, ensure_ascii=False)


def setup_json_logging(level: int = logging.INFO) -> None:
    """
    Configura o handler raiz com formatação JSON.

    Args:
        level (int): Nível mínimo de log. Padrão é logging.INFO.
    """
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())

    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
