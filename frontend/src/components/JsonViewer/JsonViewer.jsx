import { Copy, FileJson } from "lucide-react";

function JsonViewer({ data }) {
  async function handleCopy() {
    if (!data) return;

    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }

  return (
    <section className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-2xl shadow-slate-950/40 sm:mt-6 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 sm:h-12 sm:w-12">
            <FileJson size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-white sm:text-xl">
              Resposta JSON
            </h3>

            <p className="text-xs text-slate-400 sm:text-sm">
              Retorno preparado para consumo por outras aplicações.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!data}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:self-center"
        >
          <Copy size={16} />
          Copiar
        </button>
      </div>

      <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-emerald-300 sm:p-5 sm:text-sm sm:leading-7">
        {data
          ? JSON.stringify(data, null, 2)
          : "Nenhuma resposta disponível."}
      </pre>
    </section>
  );
}

export default JsonViewer;
