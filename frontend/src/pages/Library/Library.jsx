import { BookOpen, Search } from "lucide-react";

function Library() {
  return (
    <section>
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Base de Conhecimento
        </h2>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          Pesquise e organize conteúdos técnicos classificados pela plataforma.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="search"
            placeholder="Pesquisar conteúdo, categoria ou palavra-chave..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400 sm:pl-12"
          />
        </div>

        <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-6 text-center sm:mt-6 sm:min-h-64 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 sm:h-14 sm:w-14">
            <BookOpen size={22} />
          </div>

          <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
            Nenhum conteúdo disponível
          </h3>

          <p className="mt-2 max-w-md text-xs text-slate-400 sm:text-sm">
            Os conteúdos adicionados à base de conhecimento serão exibidos
            nesta área.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Library;
