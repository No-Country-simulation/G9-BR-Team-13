import { useState } from "react";
import {
  Check,
  Copy,
  FileJson,
} from "lucide-react";

function JsonViewer({ data }) {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  async function handleCopy() {
    if (!data) {
      return;
    }

    setCopyError("");

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(data, null, 2),
      );

      setIsCopied(true);

      window.setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      setCopyError(
        "Não foi possível copiar o JSON. Tente novamente.",
      );
    }
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
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 sm:self-center ${
            isCopied
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {isCopied ? (
            <>
              <Check size={16} />
              Copiado!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copiar
            </>
          )}
        </button>
      </div>

      {copyError && (
        <p
          role="alert"
          className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {copyError}
        </p>
      )}

      <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-emerald-300 sm:p-5 sm:text-sm sm:leading-7">
        {data
          ? JSON.stringify(data, null, 2)
          : "Nenhuma resposta disponível."}
      </pre>
    </section>
  );
}

export default JsonViewer;