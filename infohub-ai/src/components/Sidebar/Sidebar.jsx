function Sidebar() {
  const menuItems = [
    "Dashboard",
    "Analisar Conteúdo",
    "Base de Conhecimento",
    "Histórico",
    "Configurações",
  ];

  return (
    <aside className="hidden w-72 border-r border-white/10 bg-slate-900/80 p-6 lg:block">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500 font-bold text-slate-950">
          IH
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">InfoHub AI</h1>
          <p className="text-sm text-slate-400">Knowledge Platform</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <a
            key={item}
            className={`block cursor-pointer rounded-xl px-4 py-3 transition ${
              index === 0
                ? "bg-cyan-500/10 text-cyan-300"
                : "text-slate-300 hover:bg-white/5"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;