import { Menu } from "lucide-react";

function Header({ onToggleMenu }) {
  return (
    <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 lg:mb-8 lg:flex-row lg:items-center lg:justify-between lg:p-6">
      <div className="flex items-start gap-3 lg:gap-0">
        <button
          type="button"
          onClick={onToggleMenu}
          className="-ml-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-white sm:text-xl lg:text-3xl">
            Organização Inteligente de Conteúdo Técnico
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
            Classifique, consulte e reutilize conhecimento usando IA, API REST
            e integração com OCI.
          </p>
        </div>
      </div>

      <div className="shrink-0 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2.5 text-xs text-emerald-300 sm:px-4 sm:text-sm">
        ● API Online
      </div>
    </header>
  );
}

export default Header;
