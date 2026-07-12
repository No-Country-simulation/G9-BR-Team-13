import { FileText, LoaderCircle, Sparkles } from "lucide-react";
import { useState } from "react";

function AnalysisForm({ onSubmit, isLoading, error }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    await onSubmit({
      titulo: title.trim(),
      texto: content.trim(),
    });
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <FileText size={24} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">
            Analisar conteúdo
          </h3>

          <p className="text-sm text-slate-400">
            Envie um conteúdo técnico para classificação inteligente.
          </p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Título do conteúdo
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isLoading}
            required
            placeholder="Ex: Introdução ao Spring Boot"
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Texto técnico
          </label>

          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={isLoading}
            required
            placeholder="Cole aqui documentação, anotação, artigo ou material técnico..."
            className="min-h-52 w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin" size={20} />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Analisar Conteúdo
            </>
          )}
        </button>

        {error && (
          <p
            role="alert"
            className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
          >
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

export default AnalysisForm;