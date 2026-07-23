import { FileText, LoaderCircle, Sparkles } from "lucide-react";
import { useState } from "react";

function AnalysisForm({ onSubmit, isLoading, error }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  const isTitleValid =
    trimmedTitle.length >= 3 && trimmedTitle.length <= 200;

  const isContentValid =
    trimmedContent.length >= 20 && trimmedContent.length <= 5000;

  const isFormValid = isTitleValid && isContentValid;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isFormValid || isLoading) {
      return;
    }

    await onSubmit({
      titulo: trimmedTitle,
      texto: trimmedContent,
    });
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-2xl shadow-slate-950/40 sm:p-6">
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 sm:h-12 sm:w-12">
          <FileText size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-white sm:text-xl">
            Analisar conteúdo
          </h3>

          <p className="text-xs text-slate-400 sm:text-sm">
            Envie um conteúdo técnico para classificação inteligente.
          </p>
        </div>
      </div>

      <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-slate-300 sm:mb-2"
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
            minLength={3}
            maxLength={200}
            placeholder="Ex: Introdução ao Spring Boot"
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="mt-1.5 flex items-center justify-between gap-4 text-xs sm:mt-2">
            <span
              className={
                title.length > 0 && !isTitleValid
                  ? "text-red-300"
                  : "text-slate-500"
              }
            >
              O título deve ter entre 3 e 200 caracteres.
            </span>

            <span className="shrink-0 text-slate-500">
              {title.length}/200
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-1.5 block text-sm font-medium text-slate-300 sm:mb-2"
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
            minLength={20}
            maxLength={5000}
            placeholder="Cole aqui documentação, anotação, artigo ou material técnico..."
            className="min-h-44 w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-52"
          />

          <div className="mt-1.5 flex items-center justify-between gap-4 text-xs sm:mt-2">
            <span
              className={
                content.length > 0 && !isContentValid
                  ? "text-red-300"
                  : "text-slate-500"
              }
            >
              O texto deve ter entre 20 e 5000 caracteres.
            </span>

            <span className="shrink-0 text-slate-500">
              {content.length}/5000
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3"
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
            className="rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300 sm:p-4"
          >
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

export default AnalysisForm;
