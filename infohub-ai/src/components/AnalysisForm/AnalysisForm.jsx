import { FileText, Sparkles } from "lucide-react";

function AnalysisForm() {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <FileText size={24} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">Analisar conteúdo</h3>
          <p className="text-sm text-slate-400">
            Envie um conteúdo técnico para classificação inteligente.
          </p>
        </div>
      </div>

      <form className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Título do conteúdo
          </label>

          <input
            type="text"
            placeholder="Ex: Introdução ao Spring Boot"
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Texto técnico
          </label>

          <textarea
            placeholder="Cole aqui documentação, anotação, artigo ou material técnico..."
            className="min-h-52 w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          <Sparkles size={20} />
          Analisar Conteúdo
        </button>
      </form>
    </section>
  );
}

export default AnalysisForm;