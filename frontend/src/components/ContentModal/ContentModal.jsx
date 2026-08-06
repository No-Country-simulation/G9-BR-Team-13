import { BookOpen, Tag, X } from "lucide-react";

function formatConfidence(probability) {
  const numericProbability = Number(probability);

  if (Number.isNaN(numericProbability)) {
    return "Não informada";
  }

  const percentage =
    numericProbability <= 1
      ? numericProbability * 100
      : numericProbability;

  return `${percentage.toFixed(1)}%`;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function ContentModal({ item, onClose }) {
  if (!item) {
    return null;
  }

  const title = item.titulo?.trim() || "Conteúdo sem título";
  const text = item.texto?.trim() || "";
  const category = item.categoria || "Não informada";
  const confidence = formatConfidence(item.probabilidade);
  const createdAt = formatDate(item.criadoEm);
  const keywords = Array.isArray(item.informacoesAdicionais)
    ? item.informacoesAdicionais
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <BookOpen size={23} />
            </div>

            <div className="min-w-0">
              <h3
                id="content-modal-title"
                className="break-words text-lg font-bold text-white sm:text-xl"
              >
                {title}
              </h3>

              {createdAt && (
                <p className="mt-1 text-xs text-slate-500">
                  Classificado em {createdAt}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            {category}
          </span>

          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            Confiança: {confidence}
          </span>
        </div>

        <div className="mt-5 overflow-y-auto rounded-2xl bg-slate-950/60 p-4">
          {text ? (
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
              {text}
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              Texto completo não disponível.
            </p>
          )}
        </div>

        {keywords.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Tag size={15} />
              Palavras-chave
            </div>

            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={`${keyword}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                >
                  <Tag size={12} />
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentModal;
