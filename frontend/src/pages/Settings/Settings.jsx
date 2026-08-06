import {
  AlertTriangle,
  Check,
  Download,
  FileJson,
  Info,
  Layers3,
  Moon,
  Palette,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  clearHistory,
  exportHistoryAsJson,
  getHistory,
} from "../../services/history";
import {
  getRelatedContentLimit,
  saveRelatedContentLimit,
} from "../../services/preferences";
import {
  getStoredTheme,
  saveTheme,
} from "../../services/theme";

const themeOptions = [
  {
    value: "dark",
    title: "Tema escuro",
    description:
      "Interface atual do TechMind, com fundos escuros e destaques em azul.",
    icon: Moon,
    previewClass: "bg-slate-950",
  },
  {
    value: "light",
    title: "Tema claro",
    description:
      "Visual claro e profissional, inspirado em interfaces corporativas.",
    icon: Sun,
    previewClass: "bg-slate-100",
  },
];

const relatedContentOptions = [
  {
    value: 3,
    title: "3 conteúdos",
    description:
      "Exibição compacta e direta.",
  },
  {
    value: 5,
    title: "5 conteúdos",
    description:
      "Equilíbrio entre variedade e espaço.",
  },
  {
    value: 10,
    title: "10 conteúdos",
    description:
      "Maior quantidade de sugestões relacionadas.",
  },
];

function Settings() {
  const [theme, setTheme] = useState(() =>
    getStoredTheme(),
  );

  const [
    relatedContentLimit,
    setRelatedContentLimit,
  ] = useState(() =>
    getRelatedContentLimit(),
  );

  const [historyCount, setHistoryCount] =
    useState(() => getHistory().length);

  const [exportMessage, setExportMessage] =
    useState("");

  const [exportStatus, setExportStatus] =
    useState("");

  const [historyMessage, setHistoryMessage] =
    useState("");

  const [isClearModalOpen, setIsClearModalOpen] =
    useState(false);

  function handleThemeChange(selectedTheme) {
    const savedTheme =
      saveTheme(selectedTheme);

    setTheme(savedTheme);
  }

  function handleRelatedContentLimitChange(
    selectedLimit,
  ) {
    const savedLimit =
      saveRelatedContentLimit(selectedLimit);

    setRelatedContentLimit(savedLimit);
  }

  function handleExportHistory() {
    const result = exportHistoryAsJson();

    setExportMessage(result.message);

    setExportStatus(
      result.success ? "success" : "error",
    );

    setHistoryMessage("");
  }

  function openClearModal() {
    if (historyCount === 0) {
      return;
    }

    setIsClearModalOpen(true);
  }

  function closeClearModal() {
    setIsClearModalOpen(false);
  }

  function handleClearHistory() {
    clearHistory();

    setHistoryCount(0);
    setExportMessage("");
    setExportStatus("");
    setHistoryMessage(
      "Histórico removido com sucesso.",
    );
    setIsClearModalOpen(false);
  }

  useEffect(() => {
    if (!isClearModalOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeClearModal();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      document.body.style.overflow = "";
    };
  }, [isClearModalOpen]);

  return (
    <>
      <section>
        <div className="mb-5 sm:mb-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Configurações
          </h2>

          <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
            Personalize a aparência e as preferências da
            plataforma.
          </p>
        </div>

        <article className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-6">
          <div className="mb-5 flex items-start gap-3 sm:mb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Palette size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Aparência
              </h3>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Escolha como o TechMind será exibido neste
                navegador.
              </p>
            </div>
          </div>

          <div
            className="grid gap-3 sm:grid-cols-2 sm:gap-4"
            role="radiogroup"
            aria-label="Tema da plataforma"
          >
            {themeOptions.map((option) => {
              const Icon = option.icon;

              const isSelected =
                theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() =>
                    handleThemeChange(
                      option.value,
                    )
                  }
                  className={`relative rounded-3xl border p-4 text-left transition sm:p-5 ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-white/10 bg-slate-950/40 hover:border-cyan-400/40"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-slate-950">
                      <Check size={16} />
                    </span>
                  )}

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 ${option.previewClass}`}
                  >
                    <Icon
                      size={22}
                      className={
                        option.value === "dark"
                          ? "text-cyan-300"
                          : "text-amber-500"
                      }
                    />
                  </div>

                  <h4 className="mt-4 pr-8 text-base font-bold text-white">
                    {option.title}
                  </h4>

                  <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          <p
            className="mt-4 text-xs text-slate-500 sm:text-sm"
            aria-live="polite"
          >
            Tema selecionado:{" "}
            <strong className="text-cyan-300">
              {theme === "dark"
                ? "Escuro"
                : "Claro"}
            </strong>
            . A preferência fica salva automaticamente.
          </p>
        </article>

        <article className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-4 sm:mt-6 sm:p-6">
          <div className="mb-5 flex items-start gap-3 sm:mb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Layers3 size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Conteúdos relacionados
              </h3>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Defina quantas sugestões serão exibidas
                depois de cada análise.
              </p>
            </div>
          </div>

          <div
            className="grid gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-label="Quantidade de conteúdos relacionados"
          >
            {relatedContentOptions.map(
              (option) => {
                const isSelected =
                  relatedContentLimit ===
                  option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() =>
                      handleRelatedContentLimitChange(
                        option.value,
                      )
                    }
                    className={`relative rounded-3xl border p-4 text-left transition sm:p-5 ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-slate-950/40 hover:border-cyan-400/40"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-slate-950">
                        <Check size={16} />
                      </span>
                    )}

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-lg font-bold text-cyan-300">
                      {option.value}
                    </div>

                    <h4 className="mt-4 pr-8 text-base font-bold text-white">
                      {option.title}
                    </h4>

                    <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                      {option.description}
                    </p>
                  </button>
                );
              },
            )}
          </div>

          <p
            className="mt-4 text-xs text-slate-500 sm:text-sm"
            aria-live="polite"
          >
            O TechMind exibirá até{" "}
            <strong className="text-cyan-300">
              {relatedContentLimit}
            </strong>{" "}
            conteúdos relacionados após cada análise.
          </p>
        </article>

        <article className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-4 sm:mt-6 sm:p-6">
          <div className="mb-5 flex items-start gap-3 sm:mb-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
              <FileJson size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Histórico
              </h3>

              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Exporte ou remova as análises salvas neste
                navegador.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-white">
                    Exportar histórico em JSON
                  </h4>

                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    {historyCount === 0
                      ? "Nenhuma análise está disponível para exportação."
                      : `${historyCount} ${
                          historyCount === 1
                            ? "análise disponível"
                            : "análises disponíveis"
                        } para exportação.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportHistory}
                  disabled={historyCount === 0}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <Download size={18} />
                  Exportar JSON
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-white">
                    Limpar todo o histórico
                  </h4>

                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    Remove permanentemente todas as análises
                    armazenadas neste navegador.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openClearModal}
                  disabled={historyCount === 0}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/70 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <Trash2 size={18} />
                  Limpar histórico
                </button>
              </div>
            </div>
          </div>

          {exportMessage && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                exportStatus === "success"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-red-400/20 bg-red-400/10 text-red-300"
              }`}
            >
              {exportMessage}
            </div>
          )}

          {historyMessage && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
            >
              {historyMessage}
            </div>
          )}
        </article>

        <article className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-4 sm:mt-6 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
              <Info size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold">
                <span className="text-cyan-400">
                  Tech
                </span>

                <span className="text-white">
                  Mind
                </span>
              </h3>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Plataforma de organização inteligente de
                conteúdo técnico — versão 1.0.0.
              </p>
            </div>
          </div>
        </article>
      </section>

      {isClearModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={closeClearModal}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-history-modal-title"
            aria-describedby="clear-history-modal-description"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <AlertTriangle size={23} />
              </div>

              <button
                type="button"
                onClick={closeClearModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Fechar confirmação"
              >
                <X size={20} />
              </button>
            </div>

            <h3
              id="clear-history-modal-title"
              className="mt-4 text-lg font-bold text-white sm:mt-5 sm:text-xl"
            >
              Limpar todo o histórico?
            </h3>

            <p
              id="clear-history-modal-description"
              className="mt-2 text-sm leading-6 text-slate-400"
            >
              As {historyCount}{" "}
              {historyCount === 1
                ? "análise armazenada"
                : "análises armazenadas"}{" "}
              neste navegador serão removidas
              permanentemente.
            </p>

            <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              Esta ação não poderá ser desfeita.
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:mt-6 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={closeClearModal}
                className="w-full rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 sm:w-auto"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleClearHistory}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-400 sm:w-auto"
              >
                <Trash2 size={17} />
                Apagar histórico
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;