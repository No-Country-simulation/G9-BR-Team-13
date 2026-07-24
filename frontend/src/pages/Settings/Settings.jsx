import { Database, Server, Settings as SettingsIcon } from "lucide-react";

function Settings() {
  return (
    <section>
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Configurações
        </h2>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          Informações e preferências da plataforma.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-6">
          <div className="mb-3 flex items-center gap-3 sm:mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 sm:h-11 sm:w-11">
              <Server size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white">Configuração da API</h3>
              <p className="text-xs text-slate-500 sm:text-sm">
                Endereço utilizado pelo frontend
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 p-3 sm:p-4">
            <p className="text-xs text-slate-500">URL padrão</p>
            <p className="mt-1 break-all text-xs text-slate-300 sm:text-sm">
              http://localhost:8080
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-6">
          <div className="mb-3 flex items-center gap-3 sm:mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300 sm:h-11 sm:w-11">
              <Database size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white">Armazenamento</h3>
              <p className="text-xs text-slate-500 sm:text-sm">
                Integração com banco e OCI
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 p-3 sm:p-4">
            <p className="text-xs text-slate-400 sm:text-sm">
              As configurações de armazenamento serão disponibilizadas
              futuramente.
            </p>
          </div>
        </article>
      </div>

      <article className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-4 sm:mt-6 sm:p-6">
        <div className="flex items-center gap-3">
          <SettingsIcon size={20} className="shrink-0 text-amber-300" />

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white">InfoHub AI</h3>
            <p className="text-xs text-slate-500 sm:text-sm">
              Versão inicial da plataforma — 1.0.0
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Settings;
