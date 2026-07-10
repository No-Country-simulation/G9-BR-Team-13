function Home() {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold">Analisar conteúdo</h3>
            <p className="text-sm text-slate-400">
              Envie um título e um texto técnico para classificação.
            </p>
          </div>

          <div className="space-y-5">
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
              placeholder="Ex: Introdução ao Spring Boot"
            />

            <textarea
              className="min-h-44 w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
              placeholder="Cole aqui o texto técnico..."
            />

            <button className="w-full rounded-2xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300">
              Analisar Conteúdo
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-4 text-xl font-bold">Resultado</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Categoria</p>
                <p className="mt-2 text-lg font-bold text-cyan-300">Backend</p>
              </div>

              <div className="rounded-2xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Probabilidade</p>
                <p className="mt-2 text-lg font-bold text-emerald-300">0.94</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-4 text-xl font-bold">Resposta JSON</h3>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
{`{
  "categoria": "Backend",
  "probabilidade": 0.94
}`}
            </pre>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;