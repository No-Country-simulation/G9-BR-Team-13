import { BookOpen, Search } from "lucide-react";

function Library() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">
          Base de Conhecimento
        </h2>

        <p className="mt-2 text-slate-400">
          Pesquise e organize conteúdos técnicos classificados pela plataforma.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="search"
            placeholder="Pesquisar conteúdo, categoria ou palavra-chave..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
          />
        </div>

        <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <BookOpen size={26} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-white">
            Nenhum conteúdo disponível
          </h3>

          <p className="mt-2 max-w-md text-sm text-slate-400">
            Os conteúdos adicionados à base de conhecimento serão exibidos
            nesta área.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Library;