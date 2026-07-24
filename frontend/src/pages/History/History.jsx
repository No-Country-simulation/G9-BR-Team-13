import { useState } from "react";
import {
  Calendar,
  Check,
  Clock3,
  Copy,
  History as HistoryIcon,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteAnalysis,
  getHistory,
} from "../../services/history";

function History() {
  const [history, setHistory] = useState(() => getHistory());
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [copiedAnalysisId, setCopiedAnalysisId] = useState(null);
  const [analysisToDelete, setAnalysisToDelete] = useState(null);
  const [copyError, setCopyError] = useState("");

  function closeJsonModal() {
    setSelectedAnalysis(null);
  }

  function closeDeleteModal() {
    setAnalysisToDelete(null);
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

  function confirmDeleteAnalysis() {
    if (!analysisToDelete) {
      return;
    }

    const updatedHistory = deleteAnalysis(analysisToDelete.id);

    setHistory(updatedHistory);
    setAnalysisToDelete(null);
  }

  return (
    <section>
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Histórico de Análises
        </h2>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          Consulte os conteúdos analisados anteriormente.
        </p>
      </div>

      {copyError && (
        <div
          className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:mb-6"
          role="alert"
        >
          {copyError}
        </div>
      )}

      {history.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900 p-6 text-center sm:min-h-72 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300 sm:h-14 sm:w-14">
            <HistoryIcon size={22} />
          </div>

          <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
            Nenhuma análise registrada
          </h3>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
            <Clock3 size={16} />

            <span>
              As análises realizadas serão exibidas aqui.
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
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
                className="rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-lg sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-cyan-300 sm:text-2xl">
                      {item.summary.categoria}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400 sm:mt-1 sm:text-sm">
                      Categoria identificada pela IA
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400 sm:text-sm">
                    <Calendar size={14} />

                    <span>
                      {new Date(item.createdAt).toLocaleString(
                        "pt-BR",
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <div className="mb-1.5 flex items-center justify-between sm:mb-2">
                    <span className="text-sm font-medium text-slate-300">
                      Confiança
                    </span>

                    <span className="text-sm font-bold text-cyan-300">
                      {item.summary.probabilidade !== null
                        ? `${percentage}%`
                        : "Não informada"}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-700 sm:h-3">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <div className="mb-2.5 flex items-center gap-2 text-slate-300 sm:mb-3">
                    <Tag size={16} />

                    <span className="text-sm font-medium">
                      Palavras-chave
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {keywords.length > 0 ? (
                      keywords.map((keyword, index) => (
                        <span
                          key={`${keyword}-${index}`}
                          className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300 sm:px-3 sm:text-sm"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 sm:text-sm">
                        Nenhuma palavra-chave encontrada.
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
                  <button
                    type="button"
                    className="rounded-xl border border-cyan-500 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/10 sm:px-4 sm:text-sm"
                    onClick={() =>
                      setSelectedAnalysis(item.response)
                    }
                  >
                    Ver JSON
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-600 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-300 sm:gap-2 sm:px-4 sm:text-sm"
                    onClick={() => copyAnalysisJson(item)}
                  >
                    {wasCopied ? (
                      <>
                        <Check size={14} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copiar JSON
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/70 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 sm:gap-2 sm:px-4 sm:text-sm"
                    onClick={() => setAnalysisToDelete(item)}
                  >
                    <Trash2 size={14} />
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 p-0 sm:p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={closeJsonModal}
        >
          <div
            className="flex max-h-[85vh] w-full flex-col rounded-t-3xl border border-white/10 bg-slate-900 shadow-2xl sm:max-h-[75vh] sm:max-w-3xl sm:rounded-3xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="json-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0 flex-1">
                <h3
                  id="json-modal-title"
                  className="text-lg font-bold text-white sm:text-xl"
                >
                  Resposta completa da API
                </h3>

                <p className="mt-0.5 text-xs text-slate-400 sm:mt-1 sm:text-sm">
                  JSON armazenado no histórico desta análise.
                </p>
              </div>

              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
                onClick={closeJsonModal}
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950 p-3 text-xs leading-5 text-cyan-200 sm:p-5 sm:text-sm sm:leading-6">
                <code>
                  {JSON.stringify(selectedAnalysis, null, 2)}
                </code>
              </pre>
            </div>

            <div className="flex justify-end border-t border-white/10 px-4 py-3 sm:px-6 sm:py-4">
              <button
                type="button"
                className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 sm:py-2"
                onClick={closeJsonModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {analysisToDelete !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 p-0 sm:p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={closeDeleteModal}
        >
          <div
            className="w-full rounded-t-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 sm:h-12 sm:w-12">
              <Trash2 size={22} />
            </div>

            <h3
              id="delete-modal-title"
              className="mt-4 text-lg font-bold text-white sm:mt-5 sm:text-xl"
            >
              Excluir análise?
            </h3>

            <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:mt-2 sm:text-sm sm:leading-6">
              A análise da categoria{" "}
              <strong className="text-slate-200">
                {analysisToDelete.summary.categoria}
              </strong>{" "}
              será removida permanentemente do histórico local.
            </p>

            <div className="mt-5 flex justify-end gap-2 sm:mt-6 sm:gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 sm:flex-initial"
                onClick={closeDeleteModal}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-400 sm:flex-initial"
                onClick={confirmDeleteAnalysis}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default History;
