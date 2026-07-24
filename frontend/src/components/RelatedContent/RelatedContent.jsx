import {
  BookOpen,
  ExternalLink,
  GitBranch,
  Layers3,
} from "lucide-react";

const iconMap = {
  repository: GitBranch,
  database: Layers3,
  documentation: BookOpen,
};

function RelatedContent({ items = [] }) {
  return (
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

                <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:mt-2 sm:text-sm sm:leading-6">
                  {content.description}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RelatedContent;
