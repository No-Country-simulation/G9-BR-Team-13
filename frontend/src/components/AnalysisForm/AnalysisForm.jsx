import { FileText, LoaderCircle, Sparkles } from "lucide-react";
import { useState } from "react";

/**
 * Componente de Formulário para Envio e Validação de Conteúdo Técnico.
 * 
 * Realiza validações locais em tempo real de tamanho mínimo e máximo do título e do texto,
 * e aciona a função de submissão recebida via props.
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit Função callback assíncrona executada ao enviar o formulário
 * @param {boolean} props.isLoading Indica se a requisição HTTP de classificação está em andamento
 * @param {string|null} props.error Mensagem de erro a ser exibida caso o envio falhe
 */
function AnalysisForm({ onSubmit, isLoading, error }) {
  // Estados para capturar os valores dos campos do formulário
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Remoção de espaços em branco antes e depois do texto
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  // Regras de validação idênticas às regras das anotações @Size do backend
  const isTitleValid =
    trimmedTitle.length >= 3 && trimmedTitle.length <= 200;

  const isContentValid =
    trimmedContent.length >= 20 && trimmedContent.length <= 5000;

  const isFormValid = isTitleValid && isContentValid;

  /**
   * Manipulador do evento de submissão do formulário.
   */
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
            minLength={3}
            maxLength={200}
            placeholder="Ex: Introdução ao Spring Boot"
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between gap-4 text-xs">
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
            minLength={20}
            maxLength={5000}
            placeholder="Cole aqui documentação, anotação, artigo ou material técnico..."
            className="min-h-52 w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between gap-4 text-xs">
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