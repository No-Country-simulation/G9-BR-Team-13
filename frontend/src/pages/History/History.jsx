import { useState } from "react";
import {
  Calendar,
  Check,
  Clock3,
  Copy,
  History as HistoryIcon,
  Tag,
  X,
} from "lucide-react";

import { getHistory } from "../../services/history";

function History() {
  const [history] = useState(() => getHistory());
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [copiedAnalysisId, setCopiedAnalysisId] = useState(null);
  const [copyError, setCopyError] = useState("");

  function closeModal() {
    setSelectedAnalysis(null);
  }

  async function copyAnalysisJson(item) {
    setCopyError("");

    try {
      const formattedJson = JSON.stringify(item.response, null, 2);

      await navigator.clipboard.writeText(formattedJson);

      setCopiedAnalysisId(item.id);

      window.setTimeout(() => {
        setCopiedAnalysisId(null);
      }, 2000);
    } catch {
      setCopyError(
        "Não foi possível copiar o JSON. Tente novamente.",
      );
    }
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">
          Histórico de Análises
        </h2>

        <p className="mt-2 text-slate-400">
          Consulte os conteúdos analisados anteriormente.
        </p>
      </div>

      {copyError && (
        <div
          className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {copyError}
        </div>
      )}

      {history.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
            <HistoryIcon size={26} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-white">
            Nenhuma análise registrada
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <Clock3 size={16} />

            <span>As análises realizadas serão exibidas aqui.</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item) => {
            const percentage =
              item.summary.probabilidade !== null
                ? Math.round(item.summary.probabilidade * 100)
                : 0;

            const keywords =
              item.response?.informacoesAdicionais ?? [];

            const wasCopied = copiedAnalysisId === item.id;

            return (
              <article
                key={item.id}
                className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-300">
                      {item.summary.categoria}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Categoria identificada pela IA
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar size={16} />

                    <span>
                      {new Date(item.createdAt).toLocaleString(
                        "pt-BR",
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-slate-300">
                      Confiança
                    </span>

                    <span className="font-bold text-cyan-300">
                      {item.summary.probabilidade !== null
                        ? `${percentage}%`
                        : "Não informada"}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2 text-slate-300">
                    <Tag size={18} />

                    <span className="font-medium">
                      Palavras-chave
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {keywords.length > 0 ? (
                      keywords.map((keyword, index) => (
                        <span
                          key={`${keyword}-${index}`}
                          className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        Nenhuma palavra-chave encontrada.
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-xl border border-cyan-500 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10"
                    onClick={() =>
                      setSelectedAnalysis(item.response)
                    }
                  >
                    Ver JSON
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-300"
                    onClick={() => copyAnalysisJson(item)}
                  >
                    {wasCopied ? (
                      <>
                        <Check size={16} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copiar JSON
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="cursor-not-allowed rounded-xl border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400/50"
                    disabled
                  >
                    Excluir
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedAnalysis !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={closeModal}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="json-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h3
                  id="json-modal-title"
                  className="text-xl font-bold text-white"
                >
                  Resposta completa da API
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  JSON armazenado no histórico desta análise.
                </p>
              </div>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                onClick={closeModal}
                aria-label="Fechar modal"
              >
                <X size={22} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto p-6">
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950 p-5 text-sm leading-6 text-cyan-200">
                <code>
                  {JSON.stringify(selectedAnalysis, null, 2)}
                </code>
              </pre>
            </div>

            <div className="flex justify-end border-t border-white/10 px-6 py-4">
              <button
                type="button"
                className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
                onClick={closeModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default History;