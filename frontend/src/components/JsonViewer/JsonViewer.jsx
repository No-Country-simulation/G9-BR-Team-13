import { Copy, FileJson } from "lucide-react";

/**
 * Componente JsonViewer.
 * 
 * Exibe a resposta JSON retornada pelo backend formatada com recuo (2 espaços)
 * e inclui a funcionalidade de copiar o conteúdo JSON para a área de transferência.
 * 
 * @param {Object} props
 * @param {Object|null} props.data Dados JSON a serem exibidos e copiados
 */
function JsonViewer({ data }) {
  /**
   * Copia a string JSON formatada para a área de transferência do sistema (clipboard).
   */
  async function handleCopy() {
    if (!data) return;

    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
            <FileJson size={24} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Resposta JSON</h3>

            <p className="text-sm text-slate-400">
              Retorno preparado para consumo por outras aplicações.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!data}
          className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Copy size={16} />
          Copiar
        </button>
      </div>

      <pre className="overflow-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-emerald-300">
        {data
          ? JSON.stringify(data, null, 2)
          : "Nenhuma resposta disponível."}
      </pre>
    </section>
  );
}

export default JsonViewer;