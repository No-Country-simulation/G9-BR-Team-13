function Header() {
  return (
    <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white lg:text-3xl">
          Organização Inteligente de Conteúdo Técnico
        </h2>

        <p className="mt-2 text-slate-400">
          Classifique, consulte e reutilize conhecimento usando IA, API REST e
          integração com OCI.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
        ● API Online
      </div>
    </header>
  );
}

export default Header;