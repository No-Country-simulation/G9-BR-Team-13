import { useEffect, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  GitBranch,
  Layers3,
  X,
} from "lucide-react";

const iconMap = {
  repository: GitBranch,
  database: Layers3,
  documentation: BookOpen,
};

function RelatedContent({ items = [] }) {
  const [selectedContent, setSelectedContent] = useState(null);

  function closeModal() {
    setSelectedContent(null);
  }

  useEffect(() => {
    if (!selectedContent) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedContent]);

  return (
    <>
      <section className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-2xl shadow-slate-950/40 sm:mt-6 sm:p-6">
        <div className="mb-5 sm:mb-6">
          <h3 className="text-lg font-bold text-white sm:text-xl">
            Conteúdos relacionados
          </h3>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Sugestões baseadas na categoria e nas palavras-chave identificadas.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="rounded-2xl bg-slate-950 p-4 text-xs text-slate-400 sm:p-5 sm:text-sm">
            Nenhum conteúdo relacionado foi encontrado.
          </p>
        ) : (
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {items.map((content) => {
              const Icon = iconMap[content.type] ?? BookOpen;

              return (
                <article
                  key={content.id}
                  className="group rounded-2xl border border-white/10 bg-slate-950 p-4 transition hover:-translate-y-1 hover:border-cyan-400/40 sm:p-5"
                >
                  <div className="mb-3 flex items-start justify-between gap-4 sm:mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 sm:h-11 sm:w-11">
                      <Icon size={20} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedContent(content)}
                      aria-label={`Abrir conteúdo ${content.title}`}
                      className="rounded-xl p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-cyan-300 sm:p-2"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>

                  <span className="inline-flex rounded-full bg-purple-400/10 px-2.5 py-0.5 text-xs font-medium text-purple-300 sm:px-3 sm:py-1">
                    {content.category}
                  </span>

                  <h4 className="mt-3 text-base font-bold text-white sm:mt-4 sm:text-lg">
                    {content.title}
                  </h4>

                  <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-slate-400 sm:mt-2 sm:text-sm sm:leading-6">
                    {content.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedContent(content)}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-cyan-300 transition hover:text-cyan-200 sm:text-sm"
                  >
                    Ver conteúdo completo
                    <ExternalLink size={14} />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={closeModal}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="related-content-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0 flex-1">
                <span className="inline-flex rounded-full bg-purple-400/10 px-3 py-1 text-xs font-medium text-purple-300">
                  {selectedContent.category}
                </span>

                <h3
                  id="related-content-modal-title"
                  className="mt-3 break-words text-lg font-bold text-white sm:text-xl"
                >
                  {selectedContent.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar conteúdo"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                {(() => {
                  const ModalIcon =
                    iconMap[selectedContent.type] ?? BookOpen;

                  return <ModalIcon size={22} />;
                })()}
              </div>

              <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                {selectedContent.description ||
                  "Nenhuma descrição disponível para este conteúdo."}
              </p>
            </div>

            <div className="flex justify-end border-t border-white/10 px-4 py-3 sm:px-6 sm:py-4">
              <button
                type="button"
                onClick={closeModal}
                className="w-full rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 sm:w-auto"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RelatedContent;