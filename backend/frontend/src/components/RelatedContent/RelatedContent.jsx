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
    <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">
          Conteúdos relacionados
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Sugestões baseadas na categoria e nas palavras-chave identificadas.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl bg-slate-950 p-5 text-sm text-slate-400">
          Nenhum conteúdo relacionado foi encontrado.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((content) => {
            const Icon = iconMap[content.type] ?? BookOpen;

            return (
              <article
                key={content.id}
                className="group rounded-2xl border border-white/10 bg-slate-950 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <Icon size={22} />
                  </div>

                  <button
                    type="button"
                    aria-label={`Abrir conteúdo ${content.title}`}
                    className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-cyan-300"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>

                <span className="inline-flex rounded-full bg-purple-400/10 px-3 py-1 text-xs font-medium text-purple-300">
                  {content.category}
                </span>

                <h4 className="mt-4 text-lg font-bold text-white">
                  {content.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
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