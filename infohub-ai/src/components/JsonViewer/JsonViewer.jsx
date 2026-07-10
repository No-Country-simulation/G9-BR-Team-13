import { FileJson, Copy } from "lucide-react";

function JsonViewer() {
  const response = {
    categoria: "Backend",
    probabilidade: 0.94,
    palavrasChave: [
      "Java",
      "Spring Boot",
      "API REST"
    ],
    modelo: "TF-IDF + Logistic Regression",
    status: "Modelo carregado"
  };

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
            <FileJson size={24} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              Resposta JSON
            </h3>

            <p className="text-sm text-slate-400">
              Retorno da API REST.
            </p>
          </div>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700">

          <Copy size={16} />

          Copiar

        </button>

      </div>

      <pre className="overflow-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-emerald-300">

{JSON.stringify(response, null, 2)}

      </pre>

    </section>
  );
}

export default JsonViewer;